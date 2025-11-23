import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
    providers: [],
    callbacks: {
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
    }
} satisfies NextAuthConfig;