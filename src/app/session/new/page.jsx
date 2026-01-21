"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useApp } from "@/context/InstantShareContext";
import { Space_Grotesk, Inter } from "next/font/google";
import { Loader2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const heading = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

const TOKENS = {
    bg: "#0E0F12",
    text: "#F5F5F5",
    lime: "#DFFF00",
};

export default function NewSessionPage() {
    const router = useRouter();
    const { createPairing, loading, showToast } = useApp();

    const handleStart = async () => {
        try {
            const s = await createPairing();
            if (s?.code) {
                router.push(`/session/${s.code}`);
            } else {
                showToast("Failed to create session", "error");
            }
        } catch (e) {
            console.error(e);
            showToast("Failed to create session", "error");
        }
    };

    return (
        <div className={`${body.className} min-h-screen flex flex-col`} style={{ background: TOKENS.bg, color: TOKENS.text }}>
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="max-w-xl w-full text-center"
                >
                    <h1 className={`${heading.className} text-5xl sm:text-6xl font-bold tracking-tight`}>
                        Start a <span style={{ color: TOKENS.lime }}>Drop</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                        Create a secure session. Share the link. Drop files instantly.
                    </p>

                    <div className="mt-10">
                        <button
                            onClick={handleStart}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-black bg-[#DFFF00]
                         hover:bg-[#ccee00] active:scale-95 transition disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Zap className="fill-black" />}
                            {loading ? "Creating..." : "Create Session"}
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
