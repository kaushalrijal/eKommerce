"use server";

import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut} from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma"
import { formatError } from "../utils";

// sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get("email"),
            password: formData.get("password")
        })

        const callbackUrl = (formData.get("callbackUrl") as string) || "/";
        
        await signIn('credentials', {
            ...user,
            redirectTo: callbackUrl
        });

        return { success: true, message: 'Signed in successfully' }
    } catch (error) {
        if(isRedirectError(error)){
            throw error;
        } 

        return { success: false, message: "Invalid email or password"}
    }
}

// sign user out
export async function signOutUser() {
    await signOut();
}

// sign up usre
export async function signUpUser(prevState: unknown, formData: FormData){
    try{
        const user = signUpFormSchema.parse({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        })

        const plainPassword = user.password

        const callbackUrl = (formData.get("callbackUrl") as string) || "/";

        user.password = hashSync(user.password, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        });

        await signIn("credentials", {
            email: user.email,
            password: plainPassword,
            redirectTo: callbackUrl
        });

        return {
            success: true,
            message: "User registered successfully!"
        }
    } catch (error) {
        console.log(error)
        if(isRedirectError(error)){
            throw error;
        }

        return {success: false, message: formatError(error)};
    }
}