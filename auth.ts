import NextAuth from 'next-auth';
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/db/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' },
            },
            async authorize(credentials) {
                if(credentials == null) return null;

                // find a user in database
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                });

                // check if the user exists and if the password matches
                if(user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password)

                    // if password is correct, return user
                    if(isMatch){
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                }

                // if user does not exist or password does not match then return null
                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            // set the user id from the token
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;

            // if there is an update, set the user name
            if(trigger === "update"){
                session.user.name=user.name;
            }

            return session
        },
        async jwt({ token, user, trigger, session }: any){
            // Assign user fields to the token
            if(user){
                token.id = user.id;
                token.role = user.role;

                // If user has no name then use the email
                if(user.name === "NO_NAME"){
                    token.name = user.email!.split('@')[0]

                    // Update the database to reflect the token name
                    await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            name: token.name
                        }
                    })
                }

                if(trigger==='signIn' || trigger==="signUp"){
                    const cookiesObject = await cookies()
                    const sessionCartId = cookiesObject.get("sessionCartId")?.value;

                    if(sessionCartId){
                        const sessionCart = await prisma.cart.findFirst({
                            where : {sessionCartId}
                        })
                        
                        // delete current user cart
                        if(sessionCart){
                            await prisma.cart.deleteMany({
                                where: { userId: user.id },
                            })
                            
                            // assign new cart
                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: { userId: user.id },
                            })
                        }

                    }
                }
            }

            // handle session update
            if(session?.user.name && trigger === "update"){
                token.name = session.user.name;
            }
            return token;
        },
        authorized({ request, auth}: any){
            // array of reguex patterns of paths we want to protect
            const protectedPaths = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ];

            // get pathname from the request URL object
            const { pathname } = request.nextUrl;

            // check if user is not authenticated and accessing a protected path
            if(!auth && protectedPaths.some((p)=>p.test(pathname))) return false;

            // check fo session cart cookie
            if(!request.cookies.get('sessionCartId')){
                // Generate new session cart id cookie
                const sessionCartId = crypto.randomUUID();

                // clone the request headers
                const newRequestHeaders = new Headers(request.headers);

                // create new response and add the new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders
                    }
                });

                // set newly generated sessoinCartId in the response cookies
                response.cookies.set("sessionCartId", sessionCartId)
                return response;
            } else {
                return true;
            }
        }
    },
} satisfies NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(config);