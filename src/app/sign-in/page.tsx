import Link from "next/link";
import { signInAction } from "../actions/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "./SignInForm";

export default async function SignInPage() {
    
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(session){
        return redirect("/");
    }

    return(
        <SignInForm />
    );

}