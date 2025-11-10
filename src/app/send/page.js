// app/send/page.js
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/context/InstantShareContext";
import { useUser } from "@/context/UserContext";
import UpgradeModal from "@/components/UpgradeModal";
import QRScanner from "@/components/QRScanner";
import { Home, QrCode, Upload, FolderOpen, X, AlertCircle } from "lucide-react";

export default function SendPage() {
    const { user } = useUser();
    const { currentSession, isConnected, joinWithCode, processFiles, showToast, leaveRoom, bus, timeLeft, formatTime } = useApp();
    const [code, setCode] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [upgradeModal, setUpgradeModal] = useState(null);

    useEffect(() => {
        const off = bus.on("upgrade-required", setUpgradeModal);
        return off;
    }, [bus]);

    const canJoin = code.replace(/\D/g, "").length === 6;

    const onScanResult = async (text) => {
        const match = text.match(/code=(\d{6})/i);
        const scanned = match ? match[1] : "";
        if (scanned.length !== 6) return showToast("Invalid QR", "error");
        setCode(scanned);
        setModalOpen(false);
        await joinWithCode(scanned);
    };

    const join = async () => {
        const six = code.replace(/\D/g, "").slice(0, 6);
        await joinWithCode(six);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("dragover");
        handleFiles(Array.from(e.dataTransfer.files));
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("dragover");
    };

    const onFileSelect = (e) => {
        handleFiles(Array.from(e.target.files));
    };

    const handleFiles = (files) => {
        if (!isConnected) return showToast("Join a session first", "error");

        const MAX_FREE = 100 * 1024 * 1024;
        const oversized = files.filter(f => f.size > (user?.isPlus ? 2 * 1024**3 : MAX_FREE));

        if (oversized.length > 0 && !user?.isPlus) {
            bus.emit("upgrade-required", {
                title: "Files too big",
                body: `${oversized[0].name} is ${(oversized[0].size / 1024**2).toFixed(1)}MB. Free allows 100MB.`,
                cta: "Upgrade to 2GB →"
            });
            files = files.filter(f => f.size <= MAX_FREE);
        }

        if (files.length === 0) return;
        processFiles(files);
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            {/* Nav */}
            <nav className="flex items-center justify-between py-6 sm:py-10">
                <Link href="/" className="text-2xl font-bold text-white hover:text-[#00ff88] transition">
                    LazyDrop
                </Link>
                <Link href="/" className="flex items-center gap-2 text-sm text-[#999] hover:text-white transition">
                    <Home size={16} /> <span className="hidden sm:inline">Home</span>
                </Link>
            </nav>

            {/* Session Warning */}
            {isConnected && timeLeft < 120 && !user?.isPlus && (
                <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/50 rounded-lg flex items-center gap-2 text-orange-400 text-sm">
                    <AlertCircle size={16} />
                    Session ends in {formatTime(timeLeft)}. <Link href="/pricing" className="underline">Plus gets 2 hours</Link>
                </div>
            )}

            {/* Join Form */}
            {!isConnected && (
                <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center">
                    <h1 className="text-3xl font-normal mb-2">Send Files</h1>
                    <p className="text-[#999] mb-8">Enter the 6-digit code from the receiver</p>

                    <div className="flex gap-2 justify-center mb-6 max-w-xs mx-auto">
                        {[...Array(6)].map((_, i) => (
                            <input
                                key={i}
                                type="tel"
                                maxLength={1}
                                value={code[i] || ""}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                                    setCode(prev => {
                                        const arr = prev.split("");
                                        arr[i] = val;
                                        if (val && i < 5) document.querySelectorAll("input")[i + 1]?.focus();
                                        return arr.join("").slice(0, 6);
                                    });
                                }}
                                className="w-12 h-14 bg-[#111] border border-[#222] rounded text-xl text-center text-white focus:border-[#00ff88] focus:outline-none"
                            />
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={join}
                            disabled={!canJoin}
                            className="px-8 py-3 bg-[#00ff88] text-black font-medium rounded-lg disabled:opacity-50 hover:opacity-90 transition"
                        >
                            Join Session
                        </button>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="px-8 py-3 bg-[#111] border border-[#222] text-white rounded-lg hover:bg-[#1a1a1a] transition flex items-center justify-center gap-2"
                        >
                            <QrCode size={18} /> Scan QR
                        </button>
                    </div>
                </div>
            )}

            {/* Upload Zone */}
            {isConnected && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-[#666]">Session: <span className="text-white font-mono">{currentSession?.codeDisplay}</span></div>
                        <button onClick={leaveRoom} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
                            <X size={16} /> Leave
                        </button>
                    </div>

                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
                        onClick={() => document.getElementById("fileInput")?.click()}
                        className="relative border-2 border-dashed border-[#222] rounded-xl p-16 text-center cursor-pointer hover:border-[#00ff88] hover:bg-[#00ff88]/5 transition-all dragover:border-[#00ff88] dragover:bg-[#00ff88]/10"
                    >
                        <FolderOpen size={56} className="mx-auto mb-4 text-[#666]" />
                        <p className="text-lg font-medium">Drop files here or click to browse</p>
                        <p className="text-sm text-[#666] mt-1">
                            Up to <strong>{user?.isPlus ? "2GB" : "100MB"}</strong> per file
                            {!user?.isPlus && <span className="text-[#00ff88] ml-1">→ Plus</span>}
                        </p>
                        <input type="file" multiple id="fileInput" className="hidden" onChange={onFileSelect} />
                    </div>

                    {/* Folder Upload (Plus only) */}
                    {!user?.isPlus && (
                        <p className="text-center text-xs text-[#666] mt-4">
                            Want to send folders? <Link href="/pricing" className="text-[#00ff88] underline">Go Plus</Link>
                        </p>
                    )}
                </>
            )}

            {modalOpen && <QRScanner onResult={onScanResult} onClose={() => setModalOpen(false)} />}
            <UpgradeModal isOpen={!!upgradeModal} onClose={() => setUpgradeModal(null)} {...upgradeModal} />
        </div>
    );
}