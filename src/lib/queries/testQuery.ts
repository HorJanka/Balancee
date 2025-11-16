import { db } from "@/src/db";
import { testTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getTest(id: number){
    const test = await db   .select()
                            .from(testTable)
                            .where(eq(testTable.id, id));
    return test[0];                
}

export async function addTest() {

    const test: typeof testTable.$inferInsert = {
        name: 'John',
        email: 'john@example.com'
    };
    await db.insert(testTable).values(test);
    console.log('New test created!')    
}

export async function findAllTest() {
    const tests = await db.select().from(testTable);
    return tests;
}