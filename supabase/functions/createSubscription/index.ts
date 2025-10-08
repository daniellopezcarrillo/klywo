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

  const { userId, priceId, name, email, phone, address } = await req.json();

  if (!userId || !priceId) {
    return new Response(JSON.stringify({ error: "User ID and Price ID are required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    let customerId;

    // 1. Get Customer ID from DB
    const { data: existingSubscription } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (existingSubscription && existingSubscription.stripe_customer_id) {
      // 2. Verify customer ID with Stripe
      try {
        const customer = await stripe.customers.retrieve(existingSubscription.stripe_customer_id);
        // If customer is not deleted, use it
        if (!customer.deleted) {
            customerId = existingSubscription.stripe_customer_id;
            // Optional: Update customer details if they've changed
            await stripe.customers.update(customerId, { name, email, phone, address: { line1: address } });
        }
      } catch (error) {
        // Customer not found in current Stripe environment (e.g., test vs. live),
        // proceed to create a new one.
        console.warn(`Could not retrieve customer ${existingSubscription.stripe_customer_id}, creating a new one. Error: ${error.message}`);
      }
    }

    // 3. If no valid customerId yet, create or find one
    if (!customerId) {
      const customers = await stripe.customers.list({ email: email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const newCustomer = await stripe.customers.create({
          name,
          email,
          phone,
          address: { line1: address },
          metadata: { supabase_user_id: userId },
        });
        customerId = newCustomer.id;
      }
    }

    // 2. Update profiles table (with correct columns)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId, 
        full_name: name, 
        phone_number: phone
      }, { onConflict: 'id' });

    if (profileError) throw profileError;

    // 3. Create Stripe Subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // 4. Update user_subscriptions table (with all correct data)
    const { error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        plan_id: priceId,
        subscription_status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (subscriptionError) throw subscriptionError;

    // 5. Return client secret
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