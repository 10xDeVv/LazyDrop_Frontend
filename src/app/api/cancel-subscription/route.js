import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { subscriptionId } = await request.json();

        // Cancel the subscription at period end
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        // Update database
        await supabase
            .from('subscriptions')
            .update({ status: 'canceling' })
            .eq('stripe_subscription_id', subscriptionId)
            .eq('user_id', session.user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}