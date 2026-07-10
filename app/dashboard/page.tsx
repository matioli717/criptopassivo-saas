import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("plan, subscription_status, subscription_expires_at")
    .eq("id", user.id)
    .single();

  const isPro = profile?.plan === "pro" 
    && profile?.subscription_status === "active" 
    && (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  const [{ data: assets }, { data: sales }] = await Promise.all([
    supabase.from("portfolio_assets").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
    supabase.from("sales").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
  ]);

  return (
    <DashboardClient
      userEmail={user.email ?? ""}
      userId={user.id}
      initialAssets={assets ?? []}
      initialSales={sales ?? []}
      isPro={isPro}
    />
  );
}
