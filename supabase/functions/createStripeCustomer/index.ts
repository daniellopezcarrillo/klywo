import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.x";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

if (!supabaseUrl || !supabaseAnonKey || !stripeSecretKey) {
  throw new Error("Supabase URL, Supabase Anon Key, and Stripe Secret Key must be set as environment variables.");
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

  const { userId } = await req.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check if customer already exists
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
      console.error("Error fetching existing subscription:", fetchError);
      return new Response(JSON.stringify({ error: "Error fetching existing subscription data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (existingSubscription && existingSubscription.stripe_customer_id) {
      // Customer already exists, return their Stripe customer ID
      return new Response(JSON.stringify({ stripeCustomerId: existingSubscription.stripe_customer_id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      metadata: {
        supabaseUserId: userId,
      },
    });

    // Update the user_subscriptions table with the new Stripe customer ID
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        stripe_customer_id: customer.id,
        // Initialize other fields as needed, e.g., subscription_status: 'incomplete'
        subscription_status: 'incomplete',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' }); // Use onConflict to handle cases where user_id might already exist but stripe_customer_id is null

    if (updateError) {
      console.error("Error updating user_subscriptions table:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update user subscription data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ stripeCustomerId: customer.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
