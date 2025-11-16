import Link from "next/link";
import { signUpAction } from "../actions/auth";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        return redirect("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-lime-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600">
                            Sign up to get started with Balancee
                        </p>
                    </div>

                    {/* Form */}
                    <form action={signUpAction}>
                        <div className="space-y-6">
                            {/* Username */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition"
                                    placeholder="johndoe"
                                />
                            </div>

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
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-lime-600 text-white py-2.5 rounded-lg font-medium hover:bg-lime-700 transition duration-200 shadow-lg hover:shadow-xl"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="text-lime-600 font-medium hover:text-lime-700"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}