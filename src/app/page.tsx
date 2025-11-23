import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "./actions/auth";
import { getCategories } from "@/components/modal_forms/send";
import TransactionsMenuBar from "@/components/TransactionsMenuBar";


export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });  

  if(!session){
    return redirect("/sign-in");
  }
  const categories = await getCategories();

  return (
    <div>
      <div className="min-h-screen flex flex-col min-h-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        Welcome
        <form action={signOutAction}>
          <button 
            type="submit"
            className="w-full bg-red-600 text-white p-2.5 rounded-lg font-medium hover:bg-red-700 transition duration-200 shadow-lg hover:shadow-xl"
          >Logout</button>
        </form>
      </div>
      <TransactionsMenuBar categories={categories} />
    </div>
  );
}
