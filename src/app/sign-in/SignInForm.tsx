'use client';

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { addAllTransactionFromMonthlyIncome } from "../fixed-income/action";

export default function SignInForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | undefined>();

    const handleSubmit = async () => {

        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!pattern.test(email)){
            setError("Helytelen email formátum");
            return;
        }
        
        const { data,error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
            rememberMe: false
        },
        {
            onRequest: () => {
                console.log("Signing in...");
            },
            onSuccess: () => {
                console.log("Sign in successfull!");
                addAllTransactionFromMonthlyIncome();
            },
            onError: (ctx) => {
                //setError(ctx.error.message);
                setError("Helytelen email vagy jelszó");
                //console.error("Sign in failed:",ctx.error);
            }
        }
        );

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-lime-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Üdvözöljük
                        </h1>
                        <p className="text-gray-600">
                            Lépjen be a Balancee fiókjába
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">

                        {error && (
                            <p className="text-red-700 text-sm text-center">{error}</p>
                        )}

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e)=>{setEmail(e.target.value)}}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Jelszó
                                </label>

                                {/* Forgot password */}
                                {/* <Link
                                        href="/forgot-password"
                                        className="text-sm text-lime-600 hover:text-lime-700 font-medium"
                                    >
                                        Forgot password?
                                    </Link> */}
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e)=>{setPassword(e.target.value)}}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-lime-600 text-white py-2.5 rounded-lg font-medium hover:bg-lime-700 transition duration-200 shadow-lg hover:shadow-xl"
                        >
                            Bejelentkezés
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Nem regisztrált felhasználó?{" "}
                        <Link
                            href="/sign-up"
                            className="text-lime-600 font-medium hover:text-lime-700"
                        >
                            Regisztráció
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}