import { NextRequest, NextResponse } from "next/server";
import { ALL_COINGECKO_IDS } from "@/lib/assets";

// Cache simples em memória — evita estourar o rate limit gratuito do CoinGecko
// (10-30 chamadas/min). Preço fica "quase em tempo real": atualiza no máximo
// a cada 20 segundos entre requisições diferentes de usuários.
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 20_000;

export async function GET(_req: NextRequest) {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cache.data);
  }

  try {
    const ids = ALL_COINGECKO_IDS.join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl`;
    const res = await fetch(url, { next: { revalidate: 20 } });

    if (!res.ok) {
      throw new Error(`CoinGecko respondeu ${res.status}`);
    }

    const data = await res.json();
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (err) {
    // Se a CoinGecko falhar (rate limit, fora do ar), devolve o último cache
    // conhecido em vez de quebrar o dashboard do usuário.
    if (cache) return NextResponse.json(cache.data);
    return NextResponse.json({ error: "Não foi possível buscar preços agora." }, { status: 502 });
  }
}
