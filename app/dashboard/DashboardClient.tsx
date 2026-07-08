"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, ReferenceLine,
} from "recharts";
import {
  Wallet, TrendingUp, AlertTriangle, Plus, Trash2, Radio, Calculator,
  ShieldAlert, ArrowUpRight, ArrowDownRight, Activity, FileText,
  LayoutDashboard, LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SUPPORTED_ASSETS } from "@/lib/assets";

const ACCENT = "#00ff88";
const ACCENT2 = "#00c4ff";
const GOLD = "#c9a24a";
const MUTED = "#6b7a8d";
const CARD = "#0e1520";
const BORDER = "#1e2a38";

const CATEGORIES = ["Core", "Estável", "Satélite", "Reserva"] as const;
const CAT_COLORS: Record<string, string> = {
  Core: "#00ff88",
  "Estável": "#00c4ff",
  "Satélite": "#c9a24a",
  Reserva: "#5a6472",
};

type Asset = {
  id: string;
  name: string;
  coingecko_id: string;
  category: string;
  target_pct: number;
  quantity: number;
  apy: number;
};

type Sale = {
  id: string;
  asset_name: string;
  sale_date: string | null;
  sale_value: number;
  cost_value: number;
};

const brl = (n: number) =>
  (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
const pct = (n: number) => `${(n || 0).toFixed(1)}%`;

export default function DashboardClient({
  userEmail,
  initialAssets,
  initialSales,
}: {
  userEmail: string;
  initialAssets: Asset[];
  initialSales: Sale[];
}) {
  const supabase = createClient();
  const [tab, setTab] = useState<"dashboard" | "carteira" | "rendimento" | "ir">("dashboard");
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [prices, setPrices] = useState<Record<string, { brl: number }>>({});
  const [history, setHistory] = useState<{ t: number; v: number }[]>([]);

  // ---- preço real via nossa rota /api/prices (CoinGecko por trás) ----
  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      setPrices(data);
    } catch (e) {
      // silencioso — mantém último preço conhecido
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 20_000);
    return () => clearInterval(id);
  }, [fetchPrices]);

  const liveAssets = useMemo(
    () =>
      assets.map((a) => ({
        ...a,
        price: prices[a.coingecko_id]?.brl ?? 0,
        liveValue: a.quantity * (prices[a.coingecko_id]?.brl ?? 0),
      })),
    [assets, prices]
  );

  const totalValue = useMemo(() => liveAssets.reduce((s, a) => s + a.liveValue, 0), [liveAssets]);

  useEffect(() => {
    if (totalValue === 0) return;
    setHistory((h) => [...h, { t: h.length, v: totalValue }].slice(-30));
  }, [totalValue]);

  const totalMonthlyYield = useMemo(
    () => liveAssets.reduce((s, a) => s + (a.liveValue * (a.apy / 100)) / 12, 0),
    [liveAssets]
  );

  const maxDeviation = useMemo(() => {
    if (totalValue === 0) return { asset: "—", dev: 0 };
    let worst = { asset: "—", dev: 0 };
    liveAssets.forEach((a) => {
      const currentPct = (a.liveValue / totalValue) * 100;
      const dev = currentPct - a.target_pct;
      if (Math.abs(dev) > Math.abs(worst.dev)) worst = { asset: a.name, dev };
    });
    return worst;
  }, [liveAssets, totalValue]);

  const totalTaxEstimate = useMemo(() => {
    const gainSum = sales.reduce((s, x) => s + Math.max(0, x.sale_value - x.cost_value), 0);
    const salesSum = sales.reduce((s, x) => s + x.sale_value, 0);
    return salesSum > 35000 ? gainSum * 0.15 : 0;
  }, [sales]);

  // ---- CRUD ----
  const addAsset = async (payload: Omit<Asset, "id">) => {
    const { data, error } = await supabase.from("portfolio_assets").insert(payload).select().single();
    if (!error && data) setAssets((prev) => [...prev, data as Asset]);
  };
  const removeAsset = async (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("portfolio_assets").delete().eq("id", id);
  };
  const addSale = async (payload: Omit<Sale, "id">) => {
    const { data, error } = await supabase.from("sales").insert(payload).select().single();
    if (!error && data) setSales((prev) => [...prev, data as Sale]);
  };
  const removeSale = async (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    await supabase.from("sales").delete().eq("id", id);
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-display">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="w-[220px] border-r border-border p-4 flex-shrink-0 flex flex-col">
          <div className="flex items-center gap-2 pb-5 border-b border-border mb-4 px-2">
            <div className="w-[26px] h-[26px] rounded-md bg-accent flex items-center justify-center font-black text-[#06110c] text-[13px]">
              C
            </div>
            <div className="font-extrabold text-sm tracking-tight">CriptoPassivo</div>
          </div>

          <NavItem active={tab === "dashboard"} onClick={() => setTab("dashboard")} icon={LayoutDashboard} label="Dashboard" />
          <NavItem active={tab === "carteira"} onClick={() => setTab("carteira")} icon={Wallet} label="Carteira" />
          <NavItem active={tab === "rendimento"} onClick={() => setTab("rendimento")} icon={TrendingUp} label="Rendimento" />
          <NavItem active={tab === "ir"} onClick={() => setTab("ir")} icon={FileText} label="Declaração IR" />

          <div className="mt-auto pt-4 border-t border-border">
            <div className="text-[11px] text-muted truncate px-2 mb-2">{userEmail}</div>
            <button onClick={signOut} className="flex items-center gap-2 text-[12.5px] text-muted hover:text-ink px-2 py-2 w-full">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between px-6 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Radio size={13} color={ACCENT} className="animate-[pulse-dot_1.6s_infinite]" />
              <span className="text-[11px] font-mono tracking-wide text-accent">AO VIVO</span>
              <span className="text-[11px] text-muted font-mono">· preço real via CoinGecko</span>
            </div>
            <div className="font-mono text-[15px] font-bold">{brl(totalValue)}</div>
          </div>

          <div className="px-6 py-6 pb-16">
            {tab === "dashboard" && (
              <DashboardTab
                totalValue={totalValue}
                totalMonthlyYield={totalMonthlyYield}
                maxDeviation={maxDeviation}
                totalTaxEstimate={totalTaxEstimate}
                liveAssets={liveAssets}
                history={history}
              />
            )}
            {tab === "carteira" && (
              <CarteiraTab liveAssets={liveAssets} totalValue={totalValue} addAsset={addAsset} removeAsset={removeAsset} />
            )}
            {tab === "rendimento" && <RendimentoTab liveAssets={liveAssets} />}
            {tab === "ir" && (
              <IRTab sales={sales} addSale={addSale} removeSale={removeSale} totalTaxEstimate={totalTaxEstimate} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------

function NavItem({ active, onClick, icon: Icon, label }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg cursor-pointer text-[13.5px] font-semibold mb-1 transition-all ${
        active ? "bg-accent/10 text-accent border border-accent/25" : "text-muted hover:bg-card hover:text-ink"
      }`}
    >
      <Icon size={16} /> {label}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub, tone }: any) {
  const color = tone === "warn" ? GOLD : tone === "accent" ? ACCENT : "#e8edf2";
  return (
    <div className="bg-card border border-border rounded-[10px] p-4 flex-1 min-w-[190px]">
      <div className="flex items-center gap-2 mb-2.5">
        <Icon size={15} color={MUTED} />
        <span className="text-[11px] text-muted font-mono tracking-wide uppercase">{label}</span>
      </div>
      <div className="text-[22px] font-extrabold font-mono" style={{ color }}>
        {value}
      </div>
      {sub && <div className="text-[11.5px] text-muted mt-1">{sub}</div>}
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-5">
      <div className="text-xl font-extrabold tracking-tight">{title}</div>
      <div className="text-[12.5px] text-muted mt-0.5">{sub}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10.5px] text-muted mb-1 font-mono tracking-wide">{children}</div>;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-border rounded-[10px] p-10 text-center text-muted text-[13px]">
      {text}
    </div>
  );
}

const chartTooltip = { background: "#0a0f16", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 };

// ---------------------------------------------------------------

function DashboardTab({ totalValue, totalMonthlyYield, maxDeviation, totalTaxEstimate, liveAssets, history }: any) {
  const pieData = liveAssets.map((a: any) => ({ name: a.name, value: a.liveValue, category: a.category }));

  return (
    <div>
      <SectionTitle title="Visão Geral" sub="Sua carteira, seu rendimento e seus alertas — tudo num só lugar" />

      <div className="flex gap-3.5 flex-wrap mb-5">
        <Kpi icon={Wallet} label="Valor Total (ao vivo)" value={brl(totalValue)} sub="atualiza a cada 20s" tone="accent" />
        <Kpi icon={TrendingUp} label="Rendimento Mensal Est." value={brl(totalMonthlyYield)} sub="baseado no APY de cada ativo" />
        <Kpi
          icon={Math.abs(maxDeviation.dev) > 3 ? AlertTriangle : Activity}
          label="Maior Desvio de Alocação"
          value={`${maxDeviation.dev > 0 ? "+" : ""}${maxDeviation.dev.toFixed(1)} p.p.`}
          sub={maxDeviation.asset}
          tone={Math.abs(maxDeviation.dev) > 3 ? "warn" : undefined}
        />
        <Kpi
          icon={ShieldAlert}
          label="Imposto Estimado (IR)"
          value={brl(totalTaxEstimate)}
          sub={totalTaxEstimate > 0 ? "vendas acima da isenção" : "dentro da isenção mensal"}
          tone={totalTaxEstimate > 0 ? "warn" : undefined}
        />
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="bg-card border border-border rounded-[10px] p-5 flex-[1_1_320px]">
          <div className="text-[13px] font-bold mb-1">Valor da carteira (tempo real)</div>
          <div className="text-[11px] text-muted mb-3">Preço real via CoinGecko, atualizado a cada 20s</div>
          {history.length < 2 ? (
            <EmptyState text="Aguardando histórico suficiente pra desenhar o gráfico..." />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <CartesianGrid stroke={BORDER} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" hide />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip contentStyle={chartTooltip} formatter={(v: any) => brl(v)} labelFormatter={() => ""} />
                <Line type="monotone" dataKey="v" stroke={ACCENT} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border border-border rounded-[10px] p-5 flex-[1_1_260px]">
          <div className="text-[13px] font-bold mb-1">Alocação por ativo</div>
          <div className="text-[11px] text-muted mb-2">Distribuição atual da carteira</div>
          {pieData.length === 0 ? (
            <EmptyState text="Adicione ativos na aba Carteira pra ver o gráfico." />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((entry: any, i: number) => (
                    <Cell key={i} fill={CAT_COLORS[entry.category] || ACCENT} stroke="#080b0f" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltip} formatter={(v: any) => brl(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------

function CarteiraTab({ liveAssets, totalValue, addAsset, removeAsset }: any) {
  const [form, setForm] = useState({ name: "", symbol: "ETH", category: "Core", target_pct: "", quantity: "", apy: "" });

  const submit = async () => {
    if (!form.quantity) return;
    const asset = SUPPORTED_ASSETS[form.symbol];
    await addAsset({
      name: form.name || asset.label,
      coingecko_id: asset.coingeckoId,
      category: form.category,
      target_pct: Number(form.target_pct) || 0,
      quantity: Number(form.quantity) || 0,
      apy: Number(form.apy) || 0,
    });
    setForm({ name: "", symbol: "ETH", category: "Core", target_pct: "", quantity: "", apy: "" });
  };

  const barData = liveAssets.map((a: any) => {
    const currentPct = totalValue ? (a.liveValue / totalValue) * 100 : 0;
    return { name: a.name.split(" ")[0], desvio: Number((currentPct - a.target_pct).toFixed(1)) };
  });

  return (
    <div>
      <SectionTitle title="Carteira" sub="Adicione seus ativos com a quantidade real — o preço vem direto da CoinGecko" />

      <div className="bg-card border border-border rounded-[10px] p-4.5 mb-4.5" style={{ padding: 18 }}>
        <div className="text-[12.5px] font-bold mb-3 text-muted tracking-wide">ADICIONAR ATIVO</div>
        <div className="grid gap-2.5 items-end" style={{ gridTemplateColumns: "1.4fr 1fr 1fr 0.8fr 0.8fr 0.8fr auto" }}>
          <div>
            <Label>Apelido (opcional)</Label>
            <input className="cp-input" placeholder="ex: ETH Staking Lido" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Ativo</Label>
            <select className="cp-input" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })}>
              {Object.entries(SUPPORTED_ASSETS).map(([sym, a]) => (
                <option key={sym} value={sym}>{a.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Categoria</Label>
            <select className="cp-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Alvo (%)</Label>
            <input className="cp-input" type="number" placeholder="20" value={form.target_pct} onChange={(e) => setForm({ ...form, target_pct: e.target.value })} />
          </div>
          <div>
            <Label>Quantidade</Label>
            <input className="cp-input" type="number" step="any" placeholder="0.5" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div>
            <Label>APY (%)</Label>
            <input className="cp-input" type="number" placeholder="5" value={form.apy} onChange={(e) => setForm({ ...form, apy: e.target.value })} />
          </div>
          <button className="cp-btn" onClick={submit}><Plus size={14} /> Adicionar</button>
        </div>
      </div>

      {liveAssets.length === 0 ? (
        <EmptyState text="Nenhum ativo ainda. Adicione o primeiro pra ver sua carteira ganhar vida." />
      ) : (
        <>
          <div className="bg-card border border-border rounded-[10px] overflow-hidden mb-4.5" style={{ marginBottom: 18 }}>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#0a0f16]">
                  {["Ativo", "Categoria", "Qtd.", "Preço Atual", "Valor (ao vivo)", "% Atual", "Desvio", ""].map((h) => (
                    <th key={h} className="text-left px-3.5 py-2.5 text-[10.5px] text-muted font-mono tracking-wide uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {liveAssets.map((a: any) => {
                  const currentPct = totalValue ? (a.liveValue / totalValue) * 100 : 0;
                  const dev = currentPct - a.target_pct;
                  return (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-3.5 py-2.5 font-semibold">{a.name}</td>
                      <td className="px-3.5 py-2.5">
                        <span className="text-[11px] px-2 py-0.5 rounded" style={{ background: `${CAT_COLORS[a.category]}22`, color: CAT_COLORS[a.category] }}>
                          {a.category}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 font-mono text-muted">{a.quantity}</td>
                      <td className="px-3.5 py-2.5 font-mono text-muted">{a.price ? brl(a.price) : "..."}</td>
                      <td className="px-3.5 py-2.5 font-mono">{brl(a.liveValue)}</td>
                      <td className="px-3.5 py-2.5 font-mono">{pct(currentPct)}</td>
                      <td className="px-3.5 py-2.5 font-mono flex items-center gap-1" style={{ color: Math.abs(dev) > 3 ? GOLD : ACCENT }}>
                        {dev > 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {dev > 0 ? "+" : ""}{dev.toFixed(1)} p.p.
                      </td>
                      <td className="px-3.5 py-2.5">
                        <Trash2 size={14} color={MUTED} className="cursor-pointer" onClick={() => removeAsset(a.id)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-card border border-border rounded-[10px] p-5">
            <div className="text-[13px] font-bold mb-1">Desvio de alocação por ativo</div>
            <div className="text-[11px] text-muted mb-3">Acima de 3 pontos percentuais = hora de rebalancear</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid stroke={BORDER} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} />
                <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} />
                <ReferenceLine y={3} stroke={GOLD} strokeDasharray="4 4" />
                <ReferenceLine y={-3} stroke={GOLD} strokeDasharray="4 4" />
                <ReferenceLine y={0} stroke={BORDER} />
                <Tooltip contentStyle={chartTooltip} />
                <Bar dataKey="desvio" radius={[4, 4, 4, 4]}>
                  {barData.map((d: any, i: number) => (
                    <Cell key={i} fill={Math.abs(d.desvio) > 3 ? GOLD : ACCENT} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------

function RendimentoTab({ liveAssets }: any) {
  const projection = useMemo(() => {
    const months = 12;
    const data = [];
    let balances = liveAssets.map((a: any) => a.liveValue);
    for (let m = 0; m <= months; m++) {
      const total = balances.reduce((s: number, v: number) => s + v, 0);
      data.push({ mes: m, total });
      balances = balances.map((v: number, i: number) => v * (1 + (liveAssets[i]?.apy || 0) / 100 / 12));
    }
    return data;
  }, [liveAssets]);

  const totalMonthly = liveAssets.reduce((s: number, a: any) => s + (a.liveValue * a.apy) / 100 / 12, 0);
  const totalAnnual = liveAssets.reduce((s: number, a: any) => s + (a.liveValue * a.apy) / 100, 0);
  const totalValue = liveAssets.reduce((s: number, a: any) => s + a.liveValue, 0);

  return (
    <div>
      <SectionTitle title="Calculadora de Rendimento" sub="Projeção composta de 12 meses com base no APY de cada ativo" />

      <div className="flex gap-3.5 flex-wrap mb-5">
        <Kpi icon={Wallet} label="Capital Total (ao vivo)" value={brl(totalValue)} />
        <Kpi icon={TrendingUp} label="Rendimento Mensal" value={brl(totalMonthly)} tone="accent" />
        <Kpi icon={Calculator} label="Rendimento Anual Est." value={brl(totalAnnual)} sub={`~${totalValue ? ((totalAnnual / totalValue) * 100).toFixed(1) : 0}% APY médio`} />
      </div>

      <div className="bg-card border border-border rounded-[10px] p-5 mb-5">
        <div className="text-[13px] font-bold mb-1">Projeção de crescimento (12 meses, juros compostos)</div>
        <div className="text-[11px] text-muted mb-3">Assumindo reinvestimento automático das recompensas</div>
        {liveAssets.length === 0 ? (
          <EmptyState text="Adicione ativos pra ver a projeção." />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={projection}>
              <CartesianGrid stroke={BORDER} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} tickFormatter={(v) => `M${v}`} />
              <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={chartTooltip} formatter={(v: any) => brl(v)} labelFormatter={(v) => `Mês ${v}`} />
              <Line type="monotone" dataKey="total" stroke={ACCENT2} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {liveAssets.length > 0 && (
        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#0a0f16]">
                {["Ativo", "Valor (ao vivo)", "APY", "Rendimento Mensal", "Rendimento Anual"].map((h) => (
                  <th key={h} className="text-left px-3.5 py-2.5 text-[10.5px] text-muted font-mono tracking-wide uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {liveAssets.map((a: any) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-3.5 py-2.5 font-semibold">{a.name}</td>
                  <td className="px-3.5 py-2.5 font-mono">{brl(a.liveValue)}</td>
                  <td className="px-3.5 py-2.5 text-muted">{pct(a.apy)}</td>
                  <td className="px-3.5 py-2.5 font-mono" style={{ color: ACCENT }}>{brl((a.liveValue * a.apy) / 100 / 12)}</td>
                  <td className="px-3.5 py-2.5 font-mono">{brl((a.liveValue * a.apy) / 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------

function IRTab({ sales, addSale, removeSale, totalTaxEstimate }: any) {
  const [form, setForm] = useState({ name: "", date: "", saleValue: "", costValue: "" });

  const submit = async () => {
    if (!form.name || !form.saleValue || !form.costValue) return;
    await addSale({
      asset_name: form.name,
      sale_date: form.date || null,
      sale_value: Number(form.saleValue),
      cost_value: Number(form.costValue),
    });
    setForm({ name: "", date: "", saleValue: "", costValue: "" });
  };

  const salesSum = sales.reduce((s: number, x: Sale) => s + x.sale_value, 0);
  const gainSum = sales.reduce((s: number, x: Sale) => s + Math.max(0, x.sale_value - x.cost_value), 0);
  const isento = salesSum <= 35000;

  return (
    <div>
      <SectionTitle title="Declaração de Cripto no IR" sub="Registre suas vendas do mês e veja se está dentro da faixa de isenção" />

      <div className="rounded-lg px-4 py-3 mb-5 text-[12.5px] leading-relaxed" style={{ background: "rgba(201,162,74,0.08)", border: `1px solid ${GOLD}44`, borderLeft: `3px solid ${GOLD}`, color: "#d9c896" }}>
        Vendas de cripto até <strong>R$ 35.000,00 no mês</strong> (somando todas as exchanges) são isentas de imposto
        sobre o ganho de capital. Acima disso, todo o ganho do mês é tributado. Esta calculadora usa a alíquota
        simplificada de 15% — confirme sempre com um contador antes de declarar.
      </div>

      <div className="flex gap-3.5 flex-wrap mb-5">
        <Kpi icon={Wallet} label="Total Vendido no Mês" value={brl(salesSum)} tone={isento ? undefined : "warn"} />
        <Kpi icon={TrendingUp} label="Ganho de Capital" value={brl(gainSum)} />
        <Kpi
          icon={isento ? Activity : AlertTriangle}
          label="Status"
          value={isento ? "Isento" : "Tributável"}
          sub={isento ? "dentro da faixa de R$35k" : "acima da faixa de isenção"}
          tone={isento ? "accent" : "warn"}
        />
        <Kpi icon={ShieldAlert} label="Imposto Estimado" value={brl(totalTaxEstimate)} tone={totalTaxEstimate > 0 ? "warn" : undefined} />
      </div>

      <div className="bg-card border border-border rounded-[10px] p-[18px] mb-[18px]">
        <div className="text-[12.5px] font-bold mb-3 text-muted tracking-wide">REGISTRAR VENDA</div>
        <div className="grid gap-2.5 items-end" style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr auto" }}>
          <div>
            <Label>Ativo</Label>
            <input className="cp-input" placeholder="ex: ETH" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Data</Label>
            <input className="cp-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <Label>Valor Venda (R$)</Label>
            <input className="cp-input" type="number" placeholder="5000" value={form.saleValue} onChange={(e) => setForm({ ...form, saleValue: e.target.value })} />
          </div>
          <div>
            <Label>Custo Aquisição (R$)</Label>
            <input className="cp-input" type="number" placeholder="4200" value={form.costValue} onChange={(e) => setForm({ ...form, costValue: e.target.value })} />
          </div>
          <button className="cp-btn" onClick={submit}><Plus size={14} /> Registrar</button>
        </div>
      </div>

      {sales.length === 0 ? (
        <EmptyState text="Nenhuma venda registrada este mês. Adicione uma pra calcular o ganho de capital." />
      ) : (
        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#0a0f16]">
                {["Ativo", "Data", "Venda", "Custo", "Ganho", ""].map((h) => (
                  <th key={h} className="text-left px-3.5 py-2.5 text-[10.5px] text-muted font-mono tracking-wide uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map((s: Sale) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-3.5 py-2.5 font-semibold">{s.asset_name}</td>
                  <td className="px-3.5 py-2.5 text-muted">{s.sale_date || "—"}</td>
                  <td className="px-3.5 py-2.5 font-mono">{brl(s.sale_value)}</td>
                  <td className="px-3.5 py-2.5 font-mono text-muted">{brl(s.cost_value)}</td>
                  <td className="px-3.5 py-2.5 font-mono" style={{ color: ACCENT }}>{brl(s.sale_value - s.cost_value)}</td>
                  <td className="px-3.5 py-2.5">
                    <Trash2 size={14} color={MUTED} className="cursor-pointer" onClick={() => removeSale(s.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
