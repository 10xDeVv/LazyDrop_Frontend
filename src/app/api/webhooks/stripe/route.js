import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin access
);

export async function POST(request) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error('Webhook signature verification failed:', error);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.metadata.userId;
                const subscriptionId = session.subscription;

                // Get subscription details
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                // Create subscription record in database
                await supabase.from('subscriptions').insert({
                    user_id: userId,
                    plan: 'plus',
                    status: 'active',
                    stripe_subscription_id: subscriptionId,
                    current_period_end: new Date(subscription.current_period_end * 1000),
                });

                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;

                // Update subscription status
                await supabase
                    .from('subscriptions')
                    .update({
                        status: subscription.status,
                        current_period_end: new Date(subscription.current_period_end * 1000),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;

                // Mark subscription as canceled
                await supabase
                    .from('subscriptions')
                    .update({ status: 'canceled' })
                    .eq('stripe_subscription_id', subscription.id);

                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const subscriptionId = invoice.subscription;

                // Mark subscription as past_due
                await supabase
                    .from('subscriptions')
                    .update({ status: 'past_due' })
                    .eq('stripe_subscription_id', subscriptionId);

                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}