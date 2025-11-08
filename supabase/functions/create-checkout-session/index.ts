import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.x";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase and Stripe clients
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

if (!supabaseUrl || !serviceRoleKey || !stripeSecretKey) {
  console.error("Missing environment variables.");
}

const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);
const stripe = new Stripe(stripeSecretKey!);

async function getOrCreateStripeCustomer(userId: string, supabase: SupabaseClient): Promise<string> {
  const { data: existingSubscription, error: fetchError } = await supabase
    .from("user_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: row not found
    throw new Error(`Database error: Could not fetch subscription data. ${fetchError.message}`);
  }

  if (existingSubscription && existingSubscription.stripe_customer_id) {
    return existingSubscription.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    metadata: { supabaseUserId: userId },
  });

  const { error: updateError } = await supabase
    .from("user_subscriptions")
    .upsert({
      user_id: userId,
      stripe_customer_id: customer.id,
      subscription_status: 'incomplete',
    }, { onConflict: 'user_id' });

  if (updateError) {
    throw new Error(`Failed to update user subscription with new Stripe customer ID. ${updateError.message}`);
  }

  return customer.id;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const origin = req.headers.get("origin") || Deno.env.get("SITE_URL") || 'http://localhost:3000';

    const supabaseClient = createClient(supabaseUrl!, req.headers.get('apikey')!, {
        global: { headers: { Authorization: req.headers.get('Authorization')! } }
    });
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { priceId, planName } = await req.json();
    if (!priceId) {
      return new Response(JSON.stringify({ error: "priceId is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const stripeCustomerId = await getOrCreateStripeCustomer(user.id, supabaseAdmin);

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${origin}/post-payment-info?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: {
        planName: planName,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
