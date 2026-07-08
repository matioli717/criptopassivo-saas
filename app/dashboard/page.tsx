import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: assets }, { data: sales }] = await Promise.all([
    supabase.from("portfolio_assets").select("*").order("created_at", { ascending: true }),
    supabase.from("sales").select("*").order("created_at", { ascending: true }),
  ]);

  return (
    <DashboardClient
      userEmail={user.email ?? ""}
      initialAssets={assets ?? []}
      initialSales={sales ?? []}
    />
  );
}
