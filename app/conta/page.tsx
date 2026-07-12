import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ContaPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("plan, subscription_status, subscription_expires_at, cakto_customer_id, cakto_customer_email, cakto_subscription_id")
    .eq("id", user.id)
    .single();

  const caktoCustomerId = profile?.cakto_customer_id || profile?.cakto_customer_email;
  const isPro = profile?.plan === "pro" 
    && profile?.subscription_status === "active" 
    && (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  return (
    <div className="min-h-screen bg-bg text-ink font-display py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center font-black text-[#06110c] text-base">C</div>
          <span className="font-extrabold text-lg tracking-tight">CriptoPassivo</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h1 className="text-xl font-bold mb-1">Minha Conta</h1>
          <p className="text-muted text-sm mb-6">{user.email}</p>

          <div className={`bg-${isPro ? "accent" : "muted"}/10 border border-${isPro ? "accent" : "muted"}/30 rounded-lg p-4 mb-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg capitalize">{isPro ? "Plano Pro" : "Plano Grátis"}</p>
                <p className="text-sm text-muted mt-1">
                  {isPro 
                    ? `Próxima cobrança: ${profile?.subscription_expires_at ? new Date(profile.subscription_expires_at).toLocaleDateString("pt-BR") : "—"}`
                    : "Limite de 5 ativos • Sem IR completo"}
                </p>
              </div>
              {isPro ? (
                <Link 
                  href={`https://app.cakto.com.br/cliente/${caktoCustomerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cp-btn text-sm"
                >
                  Gerenciar no Cakto
                </Link>
              ) : (
                <button 
                  onClick={() => window.location.href = "/dashboard"}
                  className="cp-btn text-sm"
                >
                  Upgrade Pro (R$ 57,90/mês)
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-[#0a0f16] border border-border rounded-lg p-4">
              <p className="text-[11px] font-mono tracking-wide text-muted uppercase mb-1">Plano</p>
              <p className="font-bold capitalize">{profile?.plan || "free"}</p>
            </div>
            <div className="bg-[#0a0f16] border border-border rounded-lg p-4">
              <p className="text-[11px] font-mono tracking-wide text-muted uppercase mb-1">Status</p>
              <p className="font-bold capitalize">{profile?.subscription_status || "inactive"}</p>
            </div>
            <div className="bg-[#0a0f16] border border-border rounded-lg p-4">
              <p className="text-[11px] font-mono tracking-wide text-muted uppercase mb-1">Expira em</p>
              <p className="font-bold">
                {profile?.subscription_expires_at 
                  ? new Date(profile.subscription_expires_at).toLocaleDateString("pt-BR")
                  : "—"}
              </p>
            </div>
            <div className="bg-[#0a0f16] border border-border rounded-lg p-4">
              <p className="text-[11px] font-mono tracking-wide text-muted uppercase mb-1">Customer ID</p>
              <p className="font-mono text-xs text-muted truncate">{caktoCustomerId || "—"}</p>
            </div>
          </div>
        </div>

        <Link href="/dashboard" className="text-accent text-sm underline hover:text-accent2">
          ← Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}