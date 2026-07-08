// Mapeamento de ativos suportados -> ID do CoinGecko
// Adicione mais moedas aqui conforme for expandindo o produto.

export const SUPPORTED_ASSETS: Record<string, { label: string; coingeckoId: string }> = {
  ETH: { label: "Ethereum (ETH)", coingeckoId: "ethereum" },
  SOL: { label: "Solana (SOL)", coingeckoId: "solana" },
  ADA: { label: "Cardano (ADA)", coingeckoId: "cardano" },
  DOT: { label: "Polkadot (DOT)", coingeckoId: "polkadot" },
  ATOM: { label: "Cosmos (ATOM)", coingeckoId: "cosmos" },
  BTC: { label: "Bitcoin (BTC)", coingeckoId: "bitcoin" },
  USDC: { label: "USD Coin (USDC)", coingeckoId: "usd-coin" },
  USDT: { label: "Tether (USDT)", coingeckoId: "tether" },
  DAI: { label: "Dai (DAI)", coingeckoId: "dai" },
};

export const ALL_COINGECKO_IDS = Array.from(
  new Set(Object.values(SUPPORTED_ASSETS).map((a) => a.coingeckoId))
);
