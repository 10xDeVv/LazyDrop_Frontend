// app/send/page.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/InstantShareContext";
import { createClient } from "@/lib/supabase";
import { PLANS } from "@/lib/stripe";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import {
    Copy,
    Clock,
    FileText,
    Image as ImageIcon,
    Video,
    Music,
    FileArchive,
    File,
    Upload,
    X,
    Loader2,
    Lock,
    ArrowRight,
    Check,
    Share2,
    Zap,
    CheckCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Space_Grotesk, Inter } from "next/font/google";

// --- FONTS & TOKENS ---
const heading = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

const TOKENS = {
    bg: "#0E0F12",
    panel: "#16181D",
    text: "#F5F5F5",
    muted: "#9CA3AF",
    dim: "#6B7280",
    line: "rgba(255,255,255,0.10)",
    lime: "#DFFF00",
};

// --- HELPER COMPONENTS ---
const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop().toLowerCase() || "";
    const iconClass = "w-6 h-6";
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileText className={`${iconClass} text-blue-400`} />;
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return <ImageIcon className={`${iconClass} text-purple-400`} />;
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return <Video className={`${iconClass} text-red-400`} />;
    if (["mp3", "wav", "ogg", "flac"].includes(ext)) return <Music className={`${iconClass} text-yellow-400`} />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return <FileArchive className={`${iconClass} text-orange-400`} />;
    return <File className={`${iconClass} text-gray-400`} />;
};

function PasswordModal({ onSubmit, onClose }) {
    const [password, setPassword] = useState("");
    const handleSubmit = (e) => { e.preventDefault(); if (password.length >= 4) onSubmit(password); };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#16181D] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DFFF00] to-transparent" />
                <h3 className={`${heading.className} text-xl font-bold mb-1 text-white`}>Secure Session</h3>
                <p className="text-sm text-gray-400 mb-6">Set a password for your receiver.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" autoFocus className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#DFFF00] focus:outline-none transition text-white" />
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-sm font-bold border border-white/10 rounded-xl hover:bg-white/5 text-gray-300">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-3 text-sm font-bold bg-[#DFFF00] text-black rounded-xl hover:bg-[#ccee00]">Set Password</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// --- MAIN COMPONENT ---
export default function SendPage() {
    const {
        currentSession,
        createPairing,
        timeLeft,
        formatTime,
        hasPeer,
        files,
        leaveRoom,
        endSessionForEveryone,
        isOwner,
        formatFileSize,
        processFiles,
        showToast,
        loading
    } = useApp();

    const supabase = createClient();
    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const router = useRouter();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                const { data: subData } = await supabase.from("subscriptions").select("*").eq("user_id", session.user.id).eq("status", "active").single();
                setSubscription(subData);
            }
        };
        loadUser();
    }, []);

    const isPremium = subscription?.plan === "plus";
    const maxFileSize = isPremium ? PLANS.PLUS.features.maxFileSize : PLANS.FREE.features.maxFileSize;

    const handleCreatePairing = async () => {
        if (isPremium) {
            setShowPasswordModal(true);
            return;
        }
        const s = await createPairing();
        if (s?.code) router.push(`/session/${s.code}`);
    };


    const handlePasswordSubmit = async (password) => {
        setShowPasswordModal(false);
        const s = await createPairing({ password });
        if (s?.code) await router.push(`/session/${s.code}`);
        showToast("Session created");
    };

    const handleFileSelection = (selectedFiles) => {
        const oversized = selectedFiles.filter((f) => f.size > maxFileSize);
        if (oversized.length > 0) {
            showToast(`Some files exceed limit. Max: ${(maxFileSize/1024/1024).toFixed(0)}MB`, "error");
            selectedFiles = selectedFiles.filter((f) => f.size <= maxFileSize);
        }
        if (selectedFiles.length > 0) processFiles(selectedFiles);
    };

    // --- DRAG HANDLERS (FIXED) ---
    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelection(Array.from(e.dataTransfer.files));
        }
    };

    const copyLink = () => {
        if (currentSession?.code) {
            // Using the correct join URL format
            const joinUrl = `${window.location.origin}/session/${currentSession.code}`;
            navigator.clipboard.writeText(joinUrl);
            showToast("Link copied to clipboard!");
        }
    };

    const viewState =
        !currentSession ? "idle" :
            !hasPeer ? "waiting" :
                "connected";


    return (
        <div className={`${body.className} min-h-screen flex flex-col`} style={{ background: TOKENS.bg, color: TOKENS.text }}>
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative pt-24 pb-12 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="w-full max-w-2xl relative z-10">
                    <AnimatePresence mode="wait">

                        {/* IDLE STATE */}
                        {viewState === "idle" && (
                            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center">
                                <h1 className={`${heading.className} text-5xl sm:text-7xl font-bold mb-6 tracking-tight`}>Ready to <span style={{ color: TOKENS.lime }}>Send?</span></h1>
                                <p className="text-xl text-gray-400 mb-12">Create a secure P2P session.</p>
                                <div className="relative group inline-block">
                                    <div className="absolute inset-0 bg-[#DFFF00] blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                                    <button onClick={handleCreatePairing} disabled={loading} className="relative px-10 py-5 bg-[#DFFF00] text-black rounded-full font-bold text-lg flex items-center gap-3 transition-transform active:scale-95 disabled:opacity-50">
                                        {loading ? <Loader2 className="animate-spin" /> : <Zap className="fill-black" />}
                                        {loading ? "Creating..." : "Start Session"}
                                    </button>
                                </div>
                                {!isPremium && <div className="mt-12 text-sm text-gray-500">Free limit: 100MB per file. <Link href="/pricing" className="text-[#DFFF00] hover:underline">Upgrade</Link></div>}
                            </motion.div>
                        )}

                        {/* WAITING STATE */}
                        {viewState === "waiting" && (
                            <motion.div key="waiting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#16181D] border border-white/10 rounded-[32px] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DFFF00]/10 border border-[#DFFF00]/20 text-[#DFFF00] text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
                                        <div className="w-2 h-2 bg-[#DFFF00] rounded-full" /> Waiting for Receiver
                                    </div>
                                    <h2 className={`${heading.className} text-3xl font-bold`}>Share this Code</h2>
                                </div>
                                <div onClick={copyLink} className="group relative bg-black/30 border border-white/10 rounded-2xl p-8 mb-8 cursor-pointer hover:border-[#DFFF00]/50 transition-all">
                                    <div className={`${heading.className} text-5xl sm:text-7xl font-bold tracking-widest text-white group-hover:text-[#DFFF00] transition-colors`}>
                                        {currentSession.codeDisplay}
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400 group-hover:text-white"><Copy size={14} /> <span>Click to copy link</span></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-2xl flex items-center justify-center shadow-lg">
                                        {/* Generating Vector QR on client side using URL */}
                                        <QRCodeSVG value={`${window.location.origin}/session/${currentSession.code}`} size={140} />
                                    </div>
                                    <div className="flex flex-col justify-center gap-4 text-left p-6 bg-white/5 rounded-2xl border border-white/5">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Expires In</p>
                                            <div className="flex items-center gap-2 text-xl font-mono text-white"><Clock size={20} className="text-[#DFFF00]" />{formatTime(timeLeft)}</div>
                                        </div>
                                        <button onClick={isOwner ? endSessionForEveryone : leaveRoom} className="mt-2 text-sm text-red-400 hover:text-red-300 flex items-center gap-2"><X size={14} /> {isOwner ? "End Session" : "Leave Session"}</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* CONNECTED STATE */}
                        {viewState === "connected" && (
                            <motion.div key="connected" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-[#DFFF00] rounded-full animate-pulse shadow-[0_0_10px_#DFFF00]" />
                                        <span className="text-sm font-bold uppercase tracking-widest text-white">Connected</span>
                                    </div>
                                    <button onClick={isOwner ? endSessionForEveryone : leaveRoom} className="text-xs text-red-400 hover:text-white">{isOwner ? "End Session" : "Leave Session"}</button>
                                </div>

                                <div
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative rounded-[40px] border-2 border-dashed p-10 sm:p-20 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group overflow-hidden"
                                    style={{ borderColor: isDragging ? TOKENS.lime : "rgba(255,255,255,0.1)", background: isDragging ? "rgba(223,255,0,0.05)" : "rgba(22,24,29,0.5)" }}
                                >
                                    <input type="file" id="fileInput" multiple className="hidden" ref={fileInputRef} onChange={(e) => handleFileSelection(Array.from(e.target.files))} />
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-2xl transition-transform duration-300 ${isDragging ? "scale-110" : "group-hover:scale-110"}`} style={{ background: "#181818", border: `1px solid ${isDragging ? TOKENS.lime : "rgba(255,255,255,0.1)"}` }}>
                                        <Upload className={`w-10 h-10 transition-colors ${isDragging ? "text-[#DFFF00]" : "text-white"}`} />
                                    </div>
                                    <h3 className={`${heading.className} text-3xl font-bold mb-3 text-white`}>{isDragging ? "Release to Drop" : "Drop Files Here"}</h3>
                                    <p className="text-gray-400 text-lg">or click to browse</p>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <AnimatePresence>
                                        {files.map((file) => (
                                            <motion.div key={file.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-xl">
                                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{getFileIcon(file.name)}</div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-sm font-medium text-white truncate">{file.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                            {file.status === "uploading" && <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-[#DFFF00]" style={{ width: `${file.progress}%` }} /></div>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-4">{file.status === "uploading" ? <Loader2 className="w-4 h-4 text-[#DFFF00] animate-spin" /> : <CheckCircle className="w-5 h-5 text-[#DFFF00]" />}</div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {showPasswordModal && <PasswordModal onSubmit={handlePasswordSubmit} onClose={() => setShowPasswordModal(false)} />}
            </main>
        </div>
    );
}