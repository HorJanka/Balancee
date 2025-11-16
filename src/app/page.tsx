import Image from "next/image";
import { findAllTest } from "../lib/queries/testQuery";



export default async function Home() {
  
  const testData = await findAllTest();
  console.log(testData);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
    </div>
  );
}
