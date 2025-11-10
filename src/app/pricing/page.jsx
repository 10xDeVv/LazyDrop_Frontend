"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe-client";
import { motion } from "framer-motion";
import {
    Check,
    Crown,
    ArrowLeft,
    Loader2,
    Zap,
} from "lucide-react";

export default function PricingPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);

        try {
            // Check if user is logged in
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Redirect to signup
                router.push("/signup?redirect=pricing");
                return;
            }

            // Create checkout session
            const response = await fetch("/api/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID,
                }),
            });

            const { sessionId } = await response.json();

            // Redirect to Stripe Checkout
            const stripe = await getStripe();
            await stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            name: "Free",
            price: "0",
            description: "Perfect for casual use",
            features: [
                "Instant file sharing",
                "Up to 100MB per file",
                "10 minute sessions",
                "No signup required",
                "Basic support",
            ],
            cta: "Start Free",
            href: "/receive",
            popular: false,
        },
        {
            name: "Plus",
            price: "4.99",
            description: "For power users",
            features: [
                "Everything in Free",
                "Up to 2GB per file",
                "2 hour sessions",
                "Transfer history",
                "Password protection",
                "Priority speeds",
                "Multiple devices",
                "Priority support",
            ],
            cta: "Upgrade to Plus",
            onClick: handleCheckout,
            popular: true,
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl">🦥</span>
                            <span className="text-lg font-semibold">LazyDrop</span>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm text-[#999] hover:text-white transition"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Back to home</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                            <Zap size={16} className="text-[#00ff88]" />
                            <span className="text-sm text-[#999]">Simple, transparent pricing</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            Choose your speed
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-[#999] max-w-2xl mx-auto"
                        >
                            Start free, upgrade when you need more. Cancel anytime.
                        </motion.p>
                    </div>

                    {/* Plans */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.3 }}
                                className={`relative p-8 rounded-2xl ${
                                    plan.popular
                                        ? "border-2 border-[#00ff88] bg-gradient-to-b from-[#00ff88]/10 to-transparent"
                                        : "border border-white/10 bg-white/5"
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00ff88] text-black text-sm font-semibold flex items-center gap-2">
                                        <Crown size={16} />
                                        POPULAR
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-[#999] mb-4">{plan.description}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold">${plan.price}</span>
                                        {plan.price !== "0" && (
                                            <span className="text-[#666]">/month</span>
                                        )}
                                    </div>
                                    {plan.price !== "0" && (
                                        <p className="text-sm text-[#666] mt-2">
                                            or $49/year (save $10)
                                        </p>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <Check
                                                size={20}
                                                className="text-[#00ff88] shrink-0 mt-0.5"
                                            />
                                            <span className="text-sm text-[#ccc]">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {plan.href ? (
                                    <Link
                                        href={plan.href}
                                        className={`block w-full py-3 text-center rounded-xl font-semibold transition ${
                                            plan.popular
                                                ? "bg-[#00ff88] text-black hover:bg-[#00dd77]"
                                                : "border border-white/20 text-white hover:bg-white/5"
                                        }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={plan.onClick}
                                        disabled={loading}
                                        className={`w-full py-3 text-center rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 ${
                                            plan.popular
                                                ? "bg-[#00ff88] text-black hover:bg-[#00dd77]"
                                                : "border border-white/20 text-white hover:bg-white/5"
                                        }`}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            plan.cta
                                        )}
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="mt-24 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Frequently asked questions
                        </h2>

                        <div className="space-y-6">
                            {[
                                {
                                    q: "Can I cancel anytime?",
                                    a: "Yes! Cancel anytime from your dashboard. No questions asked. Your subscription remains active until the end of your billing period.",
                                },
                                {
                                    q: "What payment methods do you accept?",
                                    a: "We accept all major credit cards (Visa, Mastercard, American Express) through Stripe. Your payment information is secure and encrypted.",
                                },
                                {
                                    q: "Do you offer refunds?",
                                    a: "We offer a 7-day money-back guarantee. If you're not satisfied within the first week, contact us for a full refund.",
                                },
                                {
                                    q: "Can I switch plans later?",
                                    a: "Absolutely! Upgrade or downgrade anytime from your dashboard. Changes take effect immediately.",
                                },
                            ].map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-xl border border-white/10 bg-white/5"
                                >
                                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                                    <p className="text-[#999]">{faq.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}