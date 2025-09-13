import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.x";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

if (!supabaseUrl || !supabaseAnonKey || !stripeSecretKey || !stripeWebhookSecret) {
  throw new Error("Supabase URL, Supabase Anon Key, Stripe Secret Key, and Stripe Webhook Secret must be set as environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-01", // Specify the API version
});

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    return new Response(JSON.stringify({ error: "Stripe signature is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(JSON.stringify({ error: "Webhook signature verification failed" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const subscriptionId = subscription.id;
      const status = subscription.status;
      const priceId = subscription.items.data[0]?.price?.id; // Assuming one item per subscription

      // Retrieve the user ID from the Stripe customer
      const { data: customerData, error: customerError } = await supabase.rpc('get_user_id_from_stripe_customer', {
        p_stripe_customer_id: customerId,
      });

      if (customerError) {
        console.error("Error fetching user ID from Stripe customer:", customerError);
        return new Response(JSON.stringify({ error: "Failed to retrieve user ID from Stripe customer" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!customerData || customerData.length === 0) {
        console.warn(`Stripe customer ID ${customerId} not found in Supabase. Skipping webhook event.`);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      const userId = customerData[0].user_id; // Assuming the RPC returns an array with one object

      // Update the user_subscriptions table
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: status,
          plan_id: priceId,
          current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
          current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' }); // Use onConflict to handle cases where user_id might already exist

      if (updateError) {
        console.error("Error updating user_subscriptions table:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update user subscription data" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

// Helper function (needs to be created in Supabase DB as a PostgreSQL function)
// This function would look up the user_id based on the stripe_customer_id
// Example SQL for the function:
/*
CREATE OR REPLACE FUNCTION get_user_id_from_stripe_customer(p_stripe_customer_id text)
RETURNS SETOF uuid AS $$
BEGIN
  RETURN QUERY
  SELECT user_id::uuid
  FROM user_subscriptions
  WHERE stripe_customer_id = p_stripe_customer_id
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
*/
