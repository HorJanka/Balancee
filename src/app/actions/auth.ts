'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// TODO add validation

export async function signUpAction(formData: FormData){
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    await auth.api.signUpEmail({
        body: {
            email,
            password,
            name: username
        }
    });

    redirect("/");
}

export async function signInAction(formData: FormData){
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    });

    redirect("/");
}

export async function signOutAction(){
    await auth.api.signOut({
        headers: await headers()
    });

    redirect("/");
}