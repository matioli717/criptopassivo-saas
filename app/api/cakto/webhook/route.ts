import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCaktoSecret, activateProPlan, extendProPlan, revokeProPlanImmediate, CAKTO_SAAS_PRODUCT_ID } from "@/lib/cakto";

interface CaktoWebhookEvent {
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

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const event: CaktoWebhookEvent = JSON.parse(rawBody);

    if (!verifyCaktoSecret(event.secret)) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const supabase = createClient();

    switch (event.event) {
      case "purchase_approved": {
        const productId = event.data.product.id;
        const isSaaSUpsell = productId === CAKTO_SAAS_PRODUCT_ID;
        const customerEmail = event.data.customer.email;
        const subscriptionId = event.data.id;

        if (isSaaSUpsell) {
          // Buscar user pelo email do customer
          const { data: { users } } = await supabase.auth.admin.listUsers();
          const user = users.find(u => u.email === customerEmail);
          
          if (user) {
            await activateProPlan(supabase, customerEmail, subscriptionId, user.id);
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