import Link from "next/link";
import { signUpAction } from "../actions/auth";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInForm from "./SignUpForm";

export default async function SignUpPage() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        return redirect("/");
    }
    
    return(
        <SignInForm />
    );
}