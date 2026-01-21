"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import {
    User, CreditCard, Shield, Loader2, CheckCircle,
    AlertTriangle, Zap, Calendar, Crown, XCircle, RotateCcw, HardDrive
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- FONTS & TOKENS ---
const heading = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const TOKENS = {
    bg: "#0B0C0F",
    panel: "#16181D",
    text: "#F5F5F5",
    muted: "#9CA3AF",
    lime: "#DFFF00",
    purple: "#A855F7",
    red: "#FF4D4D",
    orange: "#FFA500",
};

export default function AccountPage() {
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState(null);
    const [sub, setSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // 'portal' | 'cancel' | 'reactivate'

    // --- INITIAL DATA FETCH ---
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }
            setUser(session.user);

            try {
                const subscriptionData = await api.getMySubscription();
                setSub(subscriptionData);
            } catch (err) {
                console.error("Failed to fetch subscription:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [router]);

    // --- HANDLERS ---

    const handlePortal = async () => {
        setActionLoading('portal');
        try {
            // POST /subscriptions/portal -> returns { url: string }
            const res = await api.createPortalSession();
            if (res?.url) window.location.href = res.url;
            else alert("Error: No portal URL returned");
        } catch (err) {
            alert("Failed to load billing portal.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Are you sure? You will lose access to features at the end of the billing period.")) return;
        setActionLoading('cancel');
        try {
            // POST /subscriptions/cancel -> returns CancellationResponse
            await api.cancelSubscription();
            // Optimistic update: Set canceling flag
            setSub(prev => ({ ...prev, cancelAtPeriodEnd: true }));
        } catch (err) {
            alert("Cancellation failed. Please try again.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReactivate = async () => {
        setActionLoading('reactivate');
        try {
            // POST /subscriptions/reactivate -> returns void (204)
            await api.reactivateSubscription();
            // Optimistic update: Remove canceling flag
            setSub(prev => ({ ...prev, cancelAtPeriodEnd: false, status: 'active' }));
        } catch (err) {
            alert("Reactivation failed. Please contact support.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center text-white">
                <Loader2 className="w-10 h-10 text-[#DFFF00] animate-spin" />
            </div>
        );
    }

    // --- DERIVED STATE ---
    // Normalize Plan Code: "FREE", "PLUS", "PRO"
    const planCode = (sub?.planCode || "FREE").toUpperCase();
    const isPaid = planCode === "PLUS" || planCode === "PRO";
    const isCanceling = sub?.cancelAtPeriodEnd;

    // Plan Configuration
    const PLAN_CONFIG = {
        FREE: { label: "Casual Plan", price: "$0 / Forever", limit: "100 MB / File", color: TOKENS.muted, bgGradient: "#16181D" },
        PLUS: { label: "Lazydrop Plus", price: "$9.99 / Month", limit: "1 GB / File", color: TOKENS.lime, bgGradient: "linear-gradient(145deg, rgba(223,255,0,0.05) 0%, #16181D 100%)" },
        PRO:  { label: "Lazydrop Pro",  price: "$19.99 / Month", limit: "2 GB / File", color: TOKENS.purple, bgGradient: "linear-gradient(145deg, rgba(168,85,247,0.05) 0%, #16181D 100%)" },
    };

    const currentPlan = PLAN_CONFIG[planCode] || PLAN_CONFIG.FREE;

    // Status Label Logic
    let statusLabel = "Active";
    let statusColor = currentPlan.color;

    if (sub?.status && sub.status.toLowerCase() !== 'active') {
        statusLabel = sub.status; // e.g. "past_due"
        statusColor = TOKENS.muted;
    }
    if (isCanceling) {
        statusLabel = "Canceling";
        statusColor = TOKENS.orange;
    }

    return (
        <div className={`${body.className} min-h-screen flex flex-col`} style={{ background: TOKENS.bg, color: TOKENS.text }}>
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className={`${heading.className} text-4xl md:text-5xl font-bold mb-4`}>Account Settings</h1>
                        <p className="text-gray-400 text-lg">Manage your membership and billing details.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* LEFT: PROFILE CARD */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="p-6 rounded-3xl border border-white/5 bg-[#16181D]">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-400">
                                    <User size={32} />
                                </div>
                                <div className="space-y-1 mb-6">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</p>
                                    <p className="text-white font-medium truncate" title={user.email}>{user.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">User ID</p>
                                    <p className={`${mono.className} text-xs text-gray-600 truncate`}>{user.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: SUBSCRIPTION CARD */}
                        <div className="md:col-span-2 space-y-6">

                            {/* 1. MAIN CARD */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative rounded-[32px] overflow-hidden p-8 sm:p-10 border transition-all"
                                style={{
                                    borderColor: isPaid ? `${currentPlan.color}40` : "rgba(255,255,255,0.1)",
                                    background: currentPlan.bgGradient
                                }}
                            >
                                {/* Glow Effect for Paid Plans */}
                                {isPaid && (
                                    <div
                                        className="absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none opacity-20"
                                        style={{ background: currentPlan.color }}
                                    />
                                )}

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Current Plan</p>
                                        <h2 className={`${heading.className} text-4xl font-bold flex items-center gap-3 text-white`}>
                                            {currentPlan.label}
                                            {isPaid && <Crown size={28} style={{ color: currentPlan.color }} />}
                                        </h2>
                                    </div>

                                    {/* Status Badge */}
                                    {isPaid && (
                                        <div className="px-3 py-1.5 rounded-full border bg-black/20 backdrop-blur-md flex items-center gap-2"
                                             style={{ borderColor: statusColor }}>
                                            <div className={`w-2 h-2 rounded-full ${!isCanceling ? 'animate-pulse' : ''}`} style={{ background: statusColor }} />
                                            <span className={`${mono.className} text-xs font-bold uppercase`} style={{ color: statusColor }}>
                                                {statusLabel}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Plan Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 flex items-center gap-2"><CreditCard size={12} /> Billing</p>
                                        <p className="text-xl font-medium text-white capitalize">{currentPlan.price}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 flex items-center gap-2"><HardDrive size={12} /> Storage Limit</p>
                                        <p className="text-xl font-medium text-white">{currentPlan.limit}</p>
                                    </div>

                                    {/* Only show Date if Paid */}
                                    {isPaid && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                                <Calendar size={12} /> {isCanceling ? "Expires On" : "Renews On"}
                                            </p>
                                            <p className="text-xl font-medium text-white">
                                                {sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "Unknown"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* PRIMARY ACTIONS */}
                                <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                                    {!isPaid ? (
                                        // Case: Free -> Upgrade
                                        <button
                                            onClick={() => router.push("/pricing")}
                                            className="w-full sm:w-auto px-8 py-4 bg-[#DFFF00] text-black font-bold rounded-xl hover:bg-[#ccee00] transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(223,255,0,0.2)]"
                                        >
                                            <Crown size={18} /> Upgrade Plan
                                        </button>
                                    ) : (
                                        // Case: Paid -> Manage Billing
                                        <button
                                            onClick={handlePortal}
                                            disabled={actionLoading === 'portal'}
                                            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {actionLoading === 'portal' ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                                            Manage Billing
                                        </button>
                                    )}

                                    {/* Case: Canceling -> Reactivate */}
                                    {isCanceling && (
                                        <button
                                            onClick={handleReactivate}
                                            disabled={actionLoading === 'reactivate'}
                                            className="w-full sm:w-auto px-8 py-4 border border-[#DFFF00] text-[#DFFF00] font-bold rounded-xl hover:bg-[#DFFF00]/10 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {actionLoading === 'reactivate' ? <Loader2 className="animate-spin" /> : <RotateCcw size={18} />}
                                            Reactivate Now
                                        </button>
                                    )}
                                </div>
                            </motion.div>

                            {/* 2. DANGER ZONE (Cancel) */}
                            {/* Show only if Paid AND Not currently canceling */}
                            {isPaid && !isCanceling && (
                                <div className="p-6 rounded-3xl border border-red-500/10 bg-red-500/5">
                                    <h3 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                                        <AlertTriangle size={16} /> Danger Zone
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                                        Canceling will disable {currentPlan.label} features at the end of your current billing cycle ({new Date(sub?.currentPeriodEnd).toLocaleDateString()}).
                                    </p>
                                    <button
                                        onClick={handleCancel}
                                        disabled={actionLoading === 'cancel'}
                                        className="text-xs font-bold text-red-400 hover:text-red-300 hover:underline disabled:opacity-50"
                                    >
                                        {actionLoading === 'cancel' ? "Processing..." : "Cancel Subscription"}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}