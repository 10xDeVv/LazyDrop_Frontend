"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import {
    Zap, ChevronRight, Activity, LogOut, Loader2, Trash2,
    Crown, HardDrive, FileText, AlertTriangle, User, Shield
} from "lucide-react";
import { motion } from "framer-motion";

// --- TYPOGRAPHY ---
const heading = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

// --- TOKENS ---
const TOKENS = {
    bg: "#0B0C0F",
    panel: "#16181D",
    text: "#F5F5F5",
    muted: "#9CA3AF",
    lime: "#DFFF00",
    red: "#FF4D4D",
    border: "rgba(255,255,255,0.08)"
};

export default function Dashboard() {
    const router = useRouter();
    const supabase = createClient();

    // State
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSessions, setActiveSessions] = useState([]);
    const [subscription, setSubscription] = useState(null); // { plan: 'FREE', activeSessionsCount: 2, limit: 3 }

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user || null;
            setUser(currentUser);

            try {
                // 1. Fetch Sessions
                const sessionsData = await api.getActiveSessions();
                // Expecting sessionsData to be array of SessionDto
                // SessionDto needs: { id, code, myRole, createdAt, expiresAt, participantCount }
                setActiveSessions(sessionsData.sessions || []);

                // 2. Fetch Subscription (If Auth)
                if (currentUser) {
                    try {
                        const subData = await api.getMySubscription();
                        setSubscription(subData);
                    } catch (e) {
                        console.warn("Sub fetch failed", e);
                    }
                }
            } catch (err) {
                console.error("Failed to load dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    // --- ACTIONS ---

    const handleSessionAction = async (session) => {
        const isOwner = session.myRole === 'OWNER';
        if (!confirm(isOwner ? "End session for everyone?" : "Leave this session?")) return;

        try {
            if (isOwner) {
                await api.endSession(session.id); // DELETE /sessions/{id}
            } else {
                await api.leaveSession(session.id); // DELETE /sessions/{id}/participants
            }
            // Optimistic update
            setActiveSessions(prev => prev.filter(s => s.id !== session.id));
        } catch (err) {
            alert("Action failed. Please try again.");
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
    const planName = subscription?.planCode || "GUEST"; // GUEST, FREE, PLUS, PRO
    const sessionLimit = subscription?.limits?.maxActiveSessions || 1;
    const currentUsage = activeSessions.length;
    const usagePercent = Math.min((currentUsage / sessionLimit) * 100, 100);

    return (
        <div className={`${body.className} min-h-screen flex flex-col`} style={{ background: TOKENS.bg, color: TOKENS.text }}>
            <Navbar />

            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className={`${heading.className} text-4xl md:text-5xl font-bold mb-3 tracking-tight`}>
                            Mission Control
                        </h1>
                        <p className="text-gray-400 text-lg flex items-center gap-2">
                            Welcome, <span className="text-white font-medium">{user?.email || "Guest"}</span>.
                            {user && <span className={`text-xs px-2 py-0.5 rounded border border-white/20 uppercase tracking-widest ${mono.className}`}>{planName}</span>}
                        </p>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-3">
                        {!user ? (
                            <div className="flex flex-col items-end gap-2">
                                <Link href="/signup" className="text-sm text-[#DFFF00] hover:underline flex items-center gap-1">
                                    <AlertTriangle size={14} /> Sign in to sync sessions
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 text-sm font-bold hover:text-white hover:bg-white/10 transition flex items-center gap-2"
                            >
                                <LogOut size={16} /> Log Out
                            </button>
                        )}
                    </div>
                </div>

                {/* --- SUBSCRIPTION METER (If User) --- */}
                {user && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Meter Card */}
                        <div className="md:col-span-2 bg-[#16181D] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                            <div className="flex justify-between items-end mb-4 relative z-10">
                                <div>
                                    <p className={`${mono.className} text-xs text-gray-500 uppercase tracking-widest mb-1`}>Active Sessions</p>
                                    <h3 className="text-2xl font-bold text-white">{currentUsage} <span className="text-gray-500">/ {sessionLimit}</span></h3>
                                </div>
                                {currentUsage >= sessionLimit && (
                                    <Link href="/pricing" className="text-xs font-bold text-[#DFFF00] hover:underline flex items-center gap-1">
                                        <Zap size={12} /> Increase Limit
                                    </Link>
                                )}
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative z-10">
                                <div
                                    className="h-full bg-[#DFFF00] transition-all duration-500 ease-out"
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>

                            {/* Bg Decoration */}
                            <Activity size={100} className="absolute -right-4 -bottom-4 text-white/5 rotate-12 pointer-events-none" />
                        </div>

                        {/* Plan Upgrade CTA */}
                        {planName === 'FREE' && (
                            <div className="bg-gradient-to-br from-[#16181D] to-[#1A1D23] border border-[#DFFF00]/20 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:border-[#DFFF00]/40 transition-all" onClick={() => router.push("/pricing")}>
                                <div>
                                    <div className="w-10 h-10 rounded-full bg-[#DFFF00]/10 flex items-center justify-center mb-4 text-[#DFFF00]">
                                        <Crown size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Upgrade Plan</h3>
                                    <p className="text-xs text-gray-400 mt-1">Unlock 2GB transfers & history.</p>
                                </div>
                                <div className="mt-4 flex items-center text-[#DFFF00] text-sm font-bold group-hover:translate-x-1 transition-transform">
                                    View Pricing <ChevronRight size={16} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- SESSION LIST --- */}
                <h2 className={`${heading.className} text-2xl font-bold mb-6 flex items-center gap-3`}>
                    Active Sessions
                    <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400 font-mono">{activeSessions.length}</span>
                </h2>

                {activeSessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeSessions.map((session) => {
                            const isOwner = session.myRole === 'OWNER';
                            const isExpired = new Date(session.expiresAt) < new Date();

                            return (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`
                                        bg-[#16181D] border rounded-3xl p-6 relative flex flex-col justify-between group hover:border-[#DFFF00]/30 transition-all
                                        ${isExpired ? "border-red-500/20 opacity-60" : "border-white/5"}
                                    `}
                                >
                                    {/* Top Row */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg text-white">
                                                {session.code.slice(0, 1)}
                                            </div>
                                            <div>
                                                <h3 className={`${mono.className} text-xl font-bold text-white tracking-wider`}>
                                                    {session.code}
                                                </h3>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">
                                                    {isOwner ? "Owner" : "Peer"}
                                                </p>
                                            </div>
                                        </div>
                                        {isExpired && (
                                            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase rounded border border-red-500/20">
                                                Expired
                                            </span>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center gap-2"><User size={14} /> Participants</span>
                                            <span className="text-white font-mono">{session.participantCount || 1}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center gap-2"><FileText size={14} /> Files</span>
                                            <span className="text-white font-mono">{session.fileCount || 0}</span>
                                        </div>
                                        <div className="w-full h-px bg-white/5 my-2" />
                                        <p className="text-xs text-gray-500 text-right">
                                            Exp: {new Date(session.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {!isExpired ? (
                                            <Link
                                                href={`/session/${session.code}`}
                                                className="col-span-1 py-3 bg-[#DFFF00] text-black font-bold rounded-xl text-sm text-center hover:bg-[#ccee00] transition flex items-center justify-center gap-2"
                                            >
                                                Rejoin
                                            </Link>
                                        ) : (
                                            <button disabled className="col-span-1 py-3 bg-white/5 text-gray-600 font-bold rounded-xl text-sm cursor-not-allowed">
                                                Expired
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleSessionAction(session)}
                                            className={`
                                                col-span-1 py-3 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition border
                                                ${isOwner
                                                ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                                                : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                            }
                                            `}
                                        >
                                            {isOwner ? <Trash2 size={14} /> : <LogOut size={14} />}
                                            {isOwner ? "End" : "Leave"}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    // --- EMPTY STATE ---
                    <div className="flex flex-col items-center justify-center py-20 bg-[#16181D]/50 rounded-[32px] border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Activity size={32} className="text-gray-600" />
                        </div>
                        <h3 className={`${heading.className} text-2xl font-bold text-white mb-2`}>No Active Sessions</h3>
                        <p className="text-gray-500 max-w-sm text-center mb-8">
                            You aren't connected to any rooms right now. Start a transfer to see it appear here.
                        </p>
                        <Link
                            href="/send"
                            className="px-8 py-4 bg-[#DFFF00] text-black font-bold rounded-xl hover:bg-[#ccee00] transition shadow-lg flex items-center gap-2"
                        >
                            <Zap size={18} fill="black" /> Start New Drop
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}