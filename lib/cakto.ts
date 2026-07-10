import { createClient } from "@/lib/supabase/server";

export const CAKTO_SAAS_PRODUCT_ID = process.env.CAKTO_SAAS_PRODUCT_ID!;

interface CaktoEvent {
  secret: string;
  event: string;
  data: {
    id: string;
    refId: string;
    customer: { name: string; email: string; phone: string };
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
  return secret === process.env.CAKTO_WEBHOOK_SECRET;
}

type SupabaseClient = ReturnType<typeof createClient>;

async function getProfileByCaktoCustomerId(supabase: SupabaseClient, customerId: string) {
  const { data } = await supabase
    .from('user_profiles')
    .select('id, cakto_customer_id')
    .eq('cakto_customer_id', customerId)
    .single();
  return data;
}

async function getProfileByUserId(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from('user_profiles')
    .select('id, cakto_customer_id')
    .eq('id', userId)
    .single();
  return data;
}

export async function activateProPlan(supabase: SupabaseClient, customerId: string, subscriptionId: string, userId?: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const updates = {
    plan: 'pro' as const,
    cakto_subscription_id: subscriptionId,
    subscription_status: 'active' as const,
    subscription_expires_at: expiresAt.toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    const { error } = await supabase.from('user_profiles').upsert({ id: userId, ...updates, cakto_customer_id: customerId });
    if (error) throw error;
  } else {
    const { error } = await supabase.from('user_profiles').upsert({ cakto_customer_id: customerId, ...updates });
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

export async function findOrCreateCaktoCustomer(supabase: SupabaseClient, email: string, userId: string) {
  const profile = await getProfileByUserId(supabase, userId);
  if (profile?.cakto_customer_id) return profile.cakto_customer_id;

  // Cakto não tem API pública de "create customer" isolado;
  // o customer é criado automaticamente no primeiro checkout.
  // Aqui apenas retornamos null para o webhook preencher depois.
  return null;
}