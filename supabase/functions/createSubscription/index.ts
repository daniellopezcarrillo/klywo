import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.x";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

if (!supabaseUrl || !serviceRoleKey || !stripeSecretKey) {
  throw new Error("Supabase URL, Service Role Key, and Stripe Secret Key must be set.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const stripe = new Stripe(stripeSecretKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { userId, priceId } = await req.json();

  if (!userId || !priceId) {
    return new Response(JSON.stringify({ error: "User ID and Price ID are required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { data: userSubscription, error: fetchError } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (fetchError || !userSubscription || !userSubscription.stripe_customer_id) {
      console.error("Stripe customer not found for user:", userId, fetchError);
      return new Response(JSON.stringify({ error: "Stripe customer not found for user." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const customerId = userSubscription.stripe_customer_id;

    // Create a subscription in Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        plan_id: priceId,
        subscription_status: subscription.status,
        stripe_subscription_id: subscription.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (updateError) {
      console.error("Database error updating subscription details:", updateError);
      throw updateError;
    }

    // Check if the expanded object and client_secret exist
    const latestInvoice = subscription.latest_invoice;
    if (typeof latestInvoice === 'object' && latestInvoice !== null && 'payment_intent' in latestInvoice) {
      const paymentIntent = latestInvoice.payment_intent;
      if (typeof paymentIntent === 'object' && paymentIntent !== null && 'client_secret' in paymentIntent) {
        return new Response(JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          subscriptionId: subscription.id,
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    throw new Error("Could not retrieve client_secret from subscription.");

  } catch (error) {
    console.error("Error creating Stripe subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});