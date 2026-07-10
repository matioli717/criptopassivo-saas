"use server";

import { createClient } from "@/lib/supabase/server";
import { CAKTO_SAAS_PRODUCT_ID } from "@/lib/cakto";

export async function createUpsellCheckout(userId: string): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('cakto_customer_id')
    .eq('id', userId)
    .single();
  
  // Cakto checkout URL - formato típico
  const baseUrl = process.env.CAKTO_CHECKOUT_URL || "https://pay.cakto.com.br";
  const productId = CAKTO_SAAS_PRODUCT_ID;
  
  // Se já tem customer_id, usa; senão Cakto cria pelo email
  const customerParam = profile?.cakto_customer_id 
    ? `&customer_id=${profile.cakto_customer_id}` 
    : `&customer_email=${encodeURIComponent(user.email!)}`;
  
  const checkoutUrl = `${baseUrl}/checkout/${productId}?external_id=${userId}${customerParam}`;
  
  return checkoutUrl;
}