import { z } from "zod";

export const addAssetSchema = z.object({
  name: z.string().min(1).max(100),
  coingecko_id: z.string().min(1),
  category: z.enum(['Core', 'Estável', 'Satélite', 'Reserva']),
  target_pct: z.number().min(0).max(100),
  quantity: z.number().positive(),
  apy: z.number().min(0).max(1000),
});

export const updateAssetSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['Core', 'Estável', 'Satélite', 'Reserva']),
  target_pct: z.number().min(0).max(100),
  quantity: z.number().nonnegative(),
  apy: z.number().min(0).max(1000),
});

export const addSaleSchema = z.object({
  asset_name: z.string().min(1).max(100),
  sale_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  sale_value: z.number().positive(),
  cost_value: z.number().nonnegative(),
});

export const caktoWebhookSchema = z.object({
  secret: z.string().min(1),
  event: z.string().min(1),
  data: z.object({
    id: z.string().min(1),
    product: z.object({ id: z.string().min(1) }),
    customer: z.object({ email: z.string().email() }),
  }),
});
