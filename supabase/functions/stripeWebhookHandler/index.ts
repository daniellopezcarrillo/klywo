import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.x";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

if (!supabaseUrl || !supabaseAnonKey || !stripeSecretKey || !stripeWebhookSecret) {
  throw new Error("Missing required environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-01",
});

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    return new Response(JSON.stringify({ error: "Stripe signature is required" }), { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(JSON.stringify({ error: "Webhook signature verification failed" }), { status: 400 });
  }

  const subscription = event.data.object;
  const customerId = subscription.customer;

  const { data: userData, error: rpcError } = await supabase.rpc('get_user_id_from_stripe_customer', {
    p_stripe_customer_id: customerId,
  });

  if (rpcError || !userData || userData.length === 0) {
    console.warn(`User not found for Stripe customer ID ${customerId}. Skipping webhook.`);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }
  
  const userId = userData[0].user_id;

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          plan_id: subscription.items.data[0]?.price?.id,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (updateError) {
        console.error("Error updating user subscription:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update subscription" }), { status: 500 });
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});