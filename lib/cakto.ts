import { createClient } from "@/lib/supabase/server";
import { timingSafeEqual } from "crypto";

export const CAKTO_SAAS_PRODUCT_ID = process.env.CAKTO_SAAS_PRODUCT_ID!;

interface CaktoEvent {
  secret: string;
  event: string;
  data: {
    id: string;
    refId: string;
    customer: { id?: string; name: string; email: string; phone: string };
    offer: { id: string; name: string; price: number };
    offer_type: string;
    product: { id: string; name: string; type: string };
    parent_order: string;
    status: string;
    amount: number;
    paymentMethod: string;
    paidAt: string;
  };
}

export function verifyCaktoSecret(secret: string): boolean {
  const expected = process.env.CAKTO_WEBHOOK_SECRET ?? "";
  if (secret.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(secret), Buffer.from(expected));
}

type SupabaseClient = ReturnType<typeof createClient>;

export async function activateProPlan(supabase: SupabaseClient, customerValue: string, subscriptionId: string, userId?: string, kind: "id" | "email" = "id") {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const customerField = kind === "email"
    ? { cakto_customer_email: customerValue }
    : { cakto_customer_id: customerValue };

  const updates = {
    plan: 'pro' as const,
    cakto_subscription_id: subscriptionId,
    subscription_status: 'active' as const,
    subscription_expires_at: expiresAt.toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    const { error } = await supabase.from('user_profiles').upsert({ id: userId, ...updates, ...customerField });
    if (error) throw error;
  } else {
    const { error } = await supabase.from('user_profiles').upsert({ ...customerField, ...updates });
    if (error) throw error;
  }
}

export async function extendProPlan(supabase: SupabaseClient, subscriptionId: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { error } = await supabase
    .from('user_profiles')
    .update({
      subscription_status: 'active',
      subscription_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('cakto_subscription_id', subscriptionId);

  if (error) throw error;
}

export async function revokeProPlanImmediate(supabase: SupabaseClient, subscriptionId: string) {
  const { error } = await supabase
    .from('user_profiles')
    .update({
      plan: 'free',
      subscription_status: 'cancelled',
      subscription_expires_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('cakto_subscription_id', subscriptionId);

  if (error) throw error;
}