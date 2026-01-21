"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PricingCard from "@/components/PricingCard";
import { Space_Grotesk, Inter } from "next/font/google";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

const heading = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

const TOKENS = {
    bg: "#0B0C0F",
    text: "#F5F5F5",
    muted: "#9CA3AF",
    lime: "#DFFF00",
};

export default function PricingPage() {
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = useState(null);

    const handleCheckout = async (planType) => {
        setLoadingPlan(planType);

        try {
            // This will throw 401 if not logged in because auth: "required"
            const { url } = await api.createCheckoutSession(planType);

            // Stripe-hosted checkout URL
            window.location.href = url;
        } catch (err) {
            // Not logged in → send to signup/login
            if (err instanceof ApiError && err.status === 401) {
                router.push(`/signup?redirect=pricing`);
                return;
            }

            console.error("Checkout error:", err);
            alert(err?.message || "Something went wrong. Please try again.");
        } finally {
            setLoadingPlan(null);
        }
    };

    const plans = [
        {
            name: "Casual",
            planKey: "casual",
            price: "0",
            description: "For the occasional drop.",
            features: [
                "100 MB per file limit",
                "15 min Session Duration",
                "5 Files per Session",
                "Standard Speed",
                "No Signup Required",
            ],
            cta: "Start Free",
            href: "/send",
            popular: false,
        },
        {
            name: "Plus",
            planKey: "plus",
            price: "9.99",
            description: "More power, more time.",
            features: [
                "1 GB per file limit",
                "60 min Session Duration",
                "50 Files per Session",
                "Priority Speed",
                "Transfer History",
                "Password Protection",
            ],
            cta: "Get Plus",
            onClick: () => handleCheckout('PLUS'),
            popular: true, // ✅ NOW POPULAR
        },
        {
            name: "Pro",
            planKey: "pro",
            price: "19.99",
            description: "For heavy duty transfer.",
            features: [
                "2 GB per file limit",
                "120 min Session Duration",
                "75 Files per Session",
                "Turbo Speed",
                "2000 Note History",
                "Priority Support",
            ],
            cta: "Go Pro",
            onClick: () => handleCheckout('PRO'),
            popular: false, // ✅ STANDARD
        },
    ];

    return (
        <div className={`${body.className} min-h-screen flex flex-col`} style={{ background: TOKENS.bg, color: TOKENS.text }}>
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-[1400px] mx-auto">

                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                            <Zap size={16} className="text-[#DFFF00]" />
                            <span className="text-sm text-gray-400">Simple, transparent pricing</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`${heading.className} text-5xl md:text-6xl font-bold mb-6`}
                        >
                            Choose your speed.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-400 max-w-2xl mx-auto"
                        >
                            Start free, upgrade when you need more. Cancel anytime.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-24">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="flex"
                            >
                                <PricingCard
                                    plan={plan}
                                    loading={loadingPlan === plan.planKey}
                                    onCheckout={plan.onClick}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <h2 className={`${heading.className} text-3xl font-bold text-center mb-12`}>
                            Frequently asked questions
                        </h2>
                        <div className="space-y-6">
                            {[
                                { q: "Can I cancel anytime?", a: "Yes! Cancel anytime from your dashboard. No questions asked." },
                                { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) via Stripe." },
                                { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee if you're not satisfied." },
                                { q: "Can I switch plans later?", a: "Absolutely. Upgrade or downgrade anytime from your dashboard." },
                            ].map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-8 rounded-2xl border border-white/10 bg-[#16181D]"
                                >
                                    <h3 className={`${heading.className} font-bold text-lg mb-2 text-white`}>{faq.q}</h3>
                                    <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}