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

  const { userId, priceId, paymentMethodId } = await req.json();

  if (!userId || !priceId) {
    return new Response(JSON.stringify({ error: "User ID and Price ID are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get the Stripe customer ID for the user
    const { data: userSubscription, error: fetchError } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id, subscription_status")
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user subscription:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch user subscription data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!userSubscription || !userSubscription.stripe_customer_id) {
      return new Response(JSON.stringify({ error: "Stripe customer not found for user. Please create a customer first." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let subscription;
    const subscriptionData = {
      user_id: userId,
      plan_id: priceId,
      subscription_status: 'incomplete', // Default status
      updated_at: new Date().toISOString(),
    };

    if (paymentMethodId) {
      // Attach the payment method to the customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: userSubscription.stripe_customer_id,
      });

      // Create the subscription with the payment method
      subscription = await stripe.subscriptions.create({
        customer: userSubscription.stripe_customer_id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        // If you want to set up a default payment method for future renewals:
        // default_payment_method: paymentMethodId,
      });

      subscriptionData.subscription_status = subscription.status;

    } else {
      // If no paymentMethodId is provided, it might be for a free plan or requires a separate step to add payment method
      // For now, we'll assume it's a case where payment method is handled elsewhere or it's a free tier
      // If it's a free tier, you might want to set status to 'active' directly or handle it differently
      // For this example, we'll create a subscription without a payment method attached, which might require manual intervention in Stripe or a different flow.
      // A more robust solution would involve creating a SetupIntent if no payment method is available.
      // For simplicity here, we'll assume priceId is for a plan that doesn't immediately require a payment method or it's handled by the frontend.
      // If this is a paid plan without paymentMethodId, the subscription will likely fail or be incomplete.
      // Let's assume for now that if no paymentMethodId is provided, it's a free plan or a plan that doesn't require immediate payment method setup.
      // A better approach for paid plans would be to use stripe.setupIntents.create and handle the confirmation on the frontend.

      // For now, let's create a subscription and assume the frontend will handle payment method attachment if needed.
      // If the price is not free, this will likely result in an 'incomplete' status.
      subscription = await stripe.subscriptions.create({
        customer: userSubscription.stripe_customer_id,
        items: [{ price: priceId }],
        expand: ['latest_invoice.payment_intent'],
      });
      subscriptionData.subscription_status = subscription.status;
    }

    // Update the user_subscriptions table with the new Stripe subscription ID and status
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .upsert({
        ...subscriptionData,
        stripe_subscription_id: subscription.id,
      }, { onConflict: 'user_id' });

    if (updateError) {
      console.error("Error updating user_subscriptions table:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update user subscription data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return relevant data, including the client secret for the PaymentIntent if it exists
    let clientSecret = null;
    if (subscription.latest_invoice && subscription.latest_invoice.payment_intent) {
      clientSecret = subscription.latest_invoice.payment_intent.client_secret;
    }

    return new Response(JSON.stringify({
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret: clientSecret,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error creating Stripe subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
