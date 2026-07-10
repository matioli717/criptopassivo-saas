"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Radio, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      setError("Você precisa aceitar os Termos e a Política de Privacidade");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError("Não foi possível enviar o link. Confira o e-mail e tente de novo.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center font-black text-[#06110c] text-sm">C</div>
          <span className="font-extrabold tracking-tight">CriptoPassivo</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-7">
          {sent ? (
            <div className="text-center">
              <Radio className="mx-auto mb-3 text-accent" size={22} />
              <p className="text-sm text-ink font-semibold mb-1">Link enviado!</p>
              <p className="text-xs text-muted">
                Confira <span className="text-ink">{email}</span> e clique no link pra entrar no
                dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <label className="block text-[11px] font-mono tracking-wide text-muted mb-2 uppercase">
                Seu e-mail
              </label>
              <input
                type="email"
                required
                className="cp-input mb-4"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="flex items-start gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-accent border-border bg-card text-accent focus:ring-accent rounded"
                />
                <span className="text-xs text-muted leading-relaxed">
                  Li e aceito os <a href="/termos" className="underline hover:text-accent">Termos de Uso</a> e a
                  <a href="/privacidade" className="underline hover:text-accent">Política de Privacidade</a>
                </span>
              </label>

              <button type="submit" disabled={loading || !accepted} className="cp-btn w-full justify-center opacity-50 hover:opacity-100 disabled:cursor-not-allowed">
                {loading ? "Enviando..." : "Entrar com link mágico"}
              </button>
              {error && <p className="text-xs text-gold mt-3">{error}</p>}
            </form>
          )}
        </div>

        <p className="text-center text-[11px] text-muted mt-5">
          Sem senha — a gente manda um link de acesso pro seu e-mail.
        </p>
      </div>
    </div>
  );
}