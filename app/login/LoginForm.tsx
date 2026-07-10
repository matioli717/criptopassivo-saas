"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, LogIn, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

const friendlyAuthError = (message: string) => {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (normalized.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (normalized.includes("user already registered")) return "Este e-mail já possui uma conta.";
  if (normalized.includes("password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (normalized.includes("unable to validate email")) return "Digite um endereço de e-mail válido.";
  if (normalized.includes("rate limit")) return "Muitas tentativas. Aguarde um pouco e tente novamente.";

  return "Não foi possível concluir o acesso. Tente novamente.";
};

export default function LoginForm({ confirmationError = false }: { confirmationError?: boolean }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    confirmationError
      ? "Não foi possível confirmar o e-mail. Solicite um novo cadastro ou tente novamente."
      : ""
  );
  const [message, setMessage] = useState("");

  const changeMode = () => {
    setMode((current) => (current === "login" ? "signup" : "login"));
    setPassword("");
    setConfirmPassword("");
    setAccepted(false);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (mode === "signup" && !accepted) {
      setError("Aceite os Termos de Uso e a Política de Privacidade para criar a conta.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          console.error("Erro ao entrar", signInError);
          setError(friendlyAuthError(signInError.message));
          return;
        }

        router.replace("/dashboard");
        router.refresh();
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (signUpError) {
        console.error("Erro ao criar conta", signUpError);
        setError(friendlyAuthError(signUpError.message));
        return;
      }

      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setMessage("Conta criada. Confira seu e-mail e clique no link de confirmação antes de entrar.");
      setPassword("");
      setConfirmPassword("");
    } catch (unexpectedError) {
      console.error("Erro inesperado na autenticação", unexpectedError);
      setError("Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center font-black text-[#06110c] text-sm">C</div>
          <span className="font-extrabold tracking-tight">CriptoPassivo</span>
        </div>

        <div className="bg-card border border-border rounded-lg p-7">
          <h1 className="text-xl font-bold mb-1">{isSignup ? "Criar conta" : "Entrar"}</h1>
          <p className="text-xs text-muted mb-6">
            {isSignup ? "Crie seu acesso com e-mail e senha." : "Acesse sua carteira com sua senha."}
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-[11px] font-mono tracking-wide text-muted mb-2 uppercase" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="cp-input mb-4"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label className="block text-[11px] font-mono tracking-wide text-muted mb-2 uppercase" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={6}
              required
              className="cp-input mb-4"
              placeholder="Mínimo de 6 caracteres"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {isSignup && (
              <>
                <label className="block text-[11px] font-mono tracking-wide text-muted mb-2 uppercase" htmlFor="confirm-password">
                  Confirmar senha
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="cp-input mb-4"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />

                <label className="flex items-start gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(event) => setAccepted(event.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-accent"
                  />
                  <span className="text-xs text-muted leading-relaxed">
                    Li e aceito os <a href="/termos" className="underline hover:text-accent">Termos de Uso</a> e a{" "}
                    <a href="/privacidade" className="underline hover:text-accent">Política de Privacidade</a>.
                  </span>
                </label>
              </>
            )}

            {error && (
              <div role="alert" className="mb-4 rounded-md border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200">
                {error}
              </div>
            )}

            {message && (
              <div role="status" className="mb-4 flex gap-2 rounded-md border border-accent/30 bg-accent/10 p-3 text-xs text-ink">
                <CheckCircle className="mt-0.5 shrink-0 text-accent" size={15} />
                <span>{message}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="cp-btn w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? (
                "Aguarde..."
              ) : isSignup ? (
                <><UserPlus size={15} /> Criar conta</>
              ) : (
                <><LogIn size={15} /> Entrar</>
              )}
            </button>
          </form>

          <button type="button" onClick={changeMode} disabled={loading} className="mt-5 w-full text-center text-xs text-muted hover:text-accent disabled:opacity-60">
            {isSignup ? "Já tem uma conta? Entrar" : "Ainda não tem conta? Criar conta"}
          </button>
        </div>
      </div>
    </main>
  );
}
