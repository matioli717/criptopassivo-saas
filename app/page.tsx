import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const supabase = createClient();

  if (searchParams.code) {
    await supabase.auth.exchangeCodeForSession(searchParams.code);
    redirect("/dashboard");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/dashboard" : "/login");
}