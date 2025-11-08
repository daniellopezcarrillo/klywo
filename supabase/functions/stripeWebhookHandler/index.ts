import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.1.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// These secrets are stored in Supabase environment variables
const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  // The service role key has full access to your database
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.error(err.message);
    return new Response(err.message, { status: 400 });
  }

  console.log(`🔔 Received event: ${event.type}`);

  try {
    const subscription = event.data.object as Stripe.Subscription;
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const user_id = (customer as Stripe.Customer).metadata.user_id;

    if (!user_id) {
      const errorMessage = "user_id not found in customer metadata";
      console.error(errorMessage);
      // Return a 200 to prevent Stripe from retrying, as this is a permanent error for this event.
      return new Response(JSON.stringify({ error: errorMessage }), { status: 200 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customer = await stripe.customers.retrieve(session.customer as string);
        const user_id = (customer as Stripe.Customer).metadata.user_id;

        if (!user_id) {
          const errorMessage = "user_id not found in customer metadata for checkout session";
          console.error(errorMessage, session.id);
          // Return 200 to prevent retries for this permanent error.
          return new Response(JSON.stringify({ error: errorMessage }), { status: 200 });
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const { id, status, items } = subscription;
        const price = items.data[0].price;

        const { error } = await supabase
          .from("subscriptions")
          .upsert({
            id: id,
            user_id: user_id,
            status: status,
            price_id: price.id,
          }, {
            onConflict: 'id',
          });

        if (error) {
          console.error("Supabase upsert error on checkout.session.completed:", error);
          throw error;
        }

        console.log(`Successfully processed checkout session for user ${user_id}`);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const { id, status, items } = subscription;
        const price = items.data[0].price;

        const { error } = await supabase
          .from("subscriptions")
          .upsert({
            id: id,
            user_id: user_id,
            status: status,
            price_id: price.id,
          }, {
            onConflict: 'id',
          });

        if (error) {
          console.error("Supabase upsert error:", error);
          throw error; // This will be caught by the outer catch block
        }
        
        console.log(`Successfully processed subscription ${id} for user ${user_id}`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (error) {
    console.error("Error processing webhook:", error.message);
    // Return a 500 error to indicate a server-side issue
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
});
