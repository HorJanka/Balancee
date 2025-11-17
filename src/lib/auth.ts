import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema"; // Import your schema


export const auth = betterAuth({
    emailAndPassword: { 
        enabled: true, 
    },
    user:{
        modelName: "users",
        fields: {
            name: "username",
        },
        additionalFields: {
            currentBalance: {
                type: "number",
                required: true,
                defaultValue: 0,
                input: false
            }
        }
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    plugins: [nextCookies()] // make sure nextCookies() is the last plugin in the array
});