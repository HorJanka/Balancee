import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";


export const auth = betterAuth({
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
    }),
});