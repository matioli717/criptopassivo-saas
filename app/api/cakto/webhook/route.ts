import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCaktoSecret, activateProPlan, extendProPlan, revokeProPlanImmediate, CAKTO_SAAS_PRODUCT_ID } from "@/lib/cakto";
import { caktoWebhookSchema } from "@/lib/validators";

interface CaktoWebhookEvent {
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

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const parsed = JSON.parse(rawBody);
    const parsedZod = caktoWebhookSchema.safeParse(parsed);
    if (!parsedZod.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const event = parsedZod.data as CaktoWebhookEvent;

    if (!verifyCaktoSecret(event.secret)) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const supabase = createAdminClient();

    switch (event.event) {
      case "purchase_approved": {
        const productId = event.data.product.id;
        const isSaaSUpsell = productId === CAKTO_SAAS_PRODUCT_ID;
        const customerEmail = event.data.customer.email;
        const customerId = event.data.customer.id;
        const subscriptionId = event.data.id;

        if (isSaaSUpsell) {
          let user: { id: string; email?: string } | null = null;
          let page = 1;
          const perPage = 50;
          while (true) {
            const { data: { users } } = await supabase.auth.admin.listUsers({ page, perPage });
            user = users.find(u => u.email === customerEmail) ?? null;
            if (user || users.length < perPage) break;
            page++;
          }

          if (user) {
            if (customerId) {
              await activateProPlan(supabase, customerId, subscriptionId, user.id);
            } else {
              await activateProPlan(supabase, customerEmail, subscriptionId, user.id, "email");
            }
          }
        }
        break;
      }

      case "subscription_renewed": {
        const subscriptionId = event.data.id;
        await extendProPlan(supabase, subscriptionId);
        break;
      }

      case "subscription_cancelled":
      case "payment_failed":
      case "charge_refunded": {
        const subscriptionId = event.data.id;
        await revokeProPlanImmediate(supabase, subscriptionId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Cakto webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}