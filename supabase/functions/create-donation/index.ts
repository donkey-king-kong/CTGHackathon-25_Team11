import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-DONATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase client with service role for database writes
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get request body
    const { donorName, donorEmail, amount, currency = 'hkd', message } = await req.json();
    logStep("Request data", { donorName, donorEmail, amount, currency, hasMessage: !!message });

    if (!donorName || !donorEmail || !amount) {
      throw new Error("Missing required fields: donorName, donorEmail, and amount are required");
    }

    // Validate amount (minimum $10 HKD or $2 SGD)
    const minAmount = currency === 'sgd' ? 200 : 1000; // 200 cents = $2 SGD, 1000 cents = $10 HKD
    if (amount < minAmount) {
      throw new Error(`Minimum donation amount is ${currency === 'sgd' ? '$2 SGD' : '$10 HKD'}`);
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if a Stripe customer record exists for this email
    const customers = await stripe.customers.list({ email: donorEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Create donation record in Supabase first
    const { data: donationData, error: donationError } = await supabaseClient
      .from("donations")
      .insert({
        donor_name: donorName,
        donor_email: donorEmail,
        amount: amount,
        currency: currency.toLowerCase(),
        status: "pending",
        message: message || null,
        donor_id: donorEmail, // Use email as donor_id for now
      })
      .select()
      .single();

    if (donationError) {
      logStep("Error creating donation record", donationError);
      throw new Error(`Failed to create donation record: ${donationError.message}`);
    }

    logStep("Created donation record", { donationId: donationData.id, livesImpacted: donationData.lives_impacted });

    // Create a one-time payment session with REACH branding
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : donorEmail,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { 
              name: "Donation to Project REACH",
              description: `Support English education for underserved kindergarteners in Hong Kong. This donation will impact ${donationData.lives_impacted} ${donationData.lives_impacted === 1 ? 'child' : 'children'}.`,
              images: ["https://reach.org.hk/_assets/media/bccd049f097f1b6c3fa333cefd16ff30.jpg"]
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/donate/cancel`,
      metadata: {
        donation_id: donationData.id,
        donor_name: donorName,
        lives_impacted: donationData.lives_impacted.toString(),
      },
    });

    logStep("Created Stripe session", { sessionId: session.id, url: session.url });

    // Update donation record with Stripe session ID
    const { error: updateError } = await supabaseClient
      .from("donations")
      .update({ stripe_session_id: session.id })
      .eq("id", donationData.id);

    if (updateError) {
      logStep("Warning: Failed to update donation with session ID", updateError);
    }

    return new Response(JSON.stringify({ 
      url: session.url,
      donation_id: donationData.id,
      lives_impacted: donationData.lives_impacted 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-donation", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});