// app/send/page.jsx
"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/context/InstantShareContext";
import QRScanner from "@/components/QRScanner";
import { createClient } from "@/lib/supabase";
import { PLANS } from "@/lib/stripe";
import {
    QrCode,
    FileText,
    Image,
    Video,
    Music,
    FileArchive,
    File,
    Upload,
    FolderOpen,
    CheckCircle,
    Loader2,
    X,
    Crown,
    Lock,
    AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";

function parseJoinUrl(text) {
    try {
        const url = new URL(text);
        return {
            code: (url.searchParams.get("code") || "").replace(/\D/g, ""),
            secret: url.searchParams.get("secret") || undefined,
        };
    } catch {
        const code = (text.match(/code=(\d{6})/i)?.[1] || "").replace(/\D/g, "");
        const secret = text.match(/secret=([A-Za-z0-9_-]+)/i)?.[1];
        return { code, secret };
    }
}

const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    const iconSize = "w-3.5 h-3.5 sm:w-4 sm:h-4";

    if (["pdf", "doc", "docx", "txt"].includes(ext))
        return <FileText className={iconSize} />;
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
        return <Image className={iconSize} />;
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext))
        return <Video className={iconSize} />;
    if (["mp3", "wav", "ogg", "flac"].includes(ext))
        return <Music className={iconSize} />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
        return <FileArchive className={iconSize} />;

    return <File className={iconSize} />;
};

// Password Prompt Modal - RESPONSIVE
function PasswordPromptModal({ onSubmit, onClose }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length < 4) {
            setError("Password must be at least 4 characters");
            return;
        }
        onSubmit(password);
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111] border border-[#222] rounded-xl p-6 sm:p-8 w-full max-w-md">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
                        <Lock size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold">Password Required</h3>
                        <p className="text-xs sm:text-sm text-[#999]">This session is password protected</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-2.5 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-2">
                        <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5 sm:w-4 sm:h-4" />
                        <p className="text-xs sm:text-sm text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter session password"
                            autoFocus
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg focus:border-[#00ff88] focus:outline-none transition"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-white/20 rounded-lg hover:bg-white/5 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#00ff88] text-black rounded-lg font-medium hover:bg-[#00dd77] transition"
                        >
                            Join Session
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// OTP Inputs - RESPONSIVE
function OTPInputs({ onChange, prefill = "" }) {
    const inputsRef = useRef([]);
    const [values, setValues] = useState(["", "", "", "", "", ""]);

    useEffect(() => {
        onChange(values.join(""));
    }, [values, onChange]);

    useEffect(() => {
        const digits = prefill.replace(/\D/g, "").slice(0, 6).split("");
        if (digits.length === 6) setValues(digits);
    }, [prefill]);

    const setAt = (i, val) => {
        const clean = val.replace(/\D/g, "").slice(0, 1);
        setValues((prev) => prev.map((v, idx) => (idx === i ? clean : v)));
        if (clean) {
            const nextIndex = Math.min(i + 1, 5);
            inputsRef.current[nextIndex]?.focus();
        }
    };

    const onKeyDown = (e, i) => {
        if (e.key === "Backspace" && !values[i]) {
            const prevIndex = Math.max(0, i - 1);
            inputsRef.current[prevIndex]?.focus();
        }
    };

    return (
        <div
            id="otpContainer"
            className="flex gap-2 sm:gap-3 lg:gap-4 justify-center items-center my-6 sm:my-10 lg:my-16 px-4"
        >
            {[0, 1, 2].map((i) => (
                <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={values[i]}
                    onChange={(e) => setAt(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className={`w-9 h-12 sm:w-11 sm:h-14 lg:w-12 lg:h-16 bg-[#111] border border-[#222] rounded text-white text-base sm:text-lg lg:text-xl font-medium text-center transition outline-none focus:border-[#00ff88] focus:bg-[#1a1a1a] ${
                        values[i] ? "border-[#00ff88] bg-[#1a1a1a]" : ""
                    }`}
                />
            ))}
            <span className="text-lg sm:text-xl lg:text-2xl text-[#666] mx-1 sm:mx-2 shrink-0">-</span>
            {[3, 4, 5].map((i) => (
                <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={values[i]}
                    onChange={(e) => setAt(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className={`w-9 h-12 sm:w-11 sm:h-14 lg:w-12 lg:h-16 bg-[#111] border border-[#222] rounded text-white text-base sm:text-lg lg:text-xl font-medium text-center transition outline-none focus:border-[#00ff88] focus:bg-[#1a1a1a] ${
                        values[i] ? "border-[#00ff88] bg-[#1a1a1a]" : ""
                    }`}
                />
            ))}
        </div>
    );
}

// Upload List - RESPONSIVE
function UploadList() {
    const { files, formatFileSize, downloadAllFiles } = useApp();
    if (files.length === 0) return null;

    const uploadedFiles = files.filter((f) => f.status === "uploaded");

    return (
        <div id="uploadList" className="my-6 sm:my-8">
            {uploadedFiles.length > 1 && (
                <div className="flex justify-end mb-3 sm:mb-4">
                    <button
                        onClick={downloadAllFiles}
                        className="px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded bg-[#00ff88] text-black font-medium text-xs sm:text-sm hover:opacity-90 transition flex items-center gap-2"
                    >
                        <Upload size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">
                            Download All ({uploadedFiles.length})
                        </span>
                        <span className="sm:hidden">All ({uploadedFiles.length})</span>
                    </button>
                </div>
            )}
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex items-center justify-between p-3 sm:p-4 lg:p-6 bg-[#111] border border-[#222] rounded mb-3 sm:mb-4 transition hover:bg-[#1a1a1a] hover:border-[#666]"
                >
                    <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#00ff88] text-black flex items-center justify-center shrink-0">
                            {getFileIcon(file.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-medium mb-0.5 truncate">
                                {file.name}
                            </h4>
                            <p className="text-xs text-[#666]">{formatFileSize(file.size)}</p>
                            {file.status === "uploading" && (
                                <div className="w-full h-[2px] bg-[#222] rounded mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-[#00ff88] rounded transition-[width] duration-300 ease-linear"
                                        style={{ width: `${file.progress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                        {file.status === "uploading" ? (
                            <>
                                <Loader2 className="w-3 h-3 text-[#ffd700] animate-spin" />
                                <span className="text-xs text-[#666] hidden sm:inline">Sending...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-3 h-3 text-[#00ff88]" />
                                <span className="text-xs text-[#666] hidden sm:inline">
                                    {file.status === "uploaded" ? "Sent" : "Downloaded"}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function SendPage() {
    const {
        currentSession,
        isConnected,
        joinWithCode,
        processFiles,
        showToast,
        leaveRoom,
    } = useApp();

    const supabase = createClient();
    const [code, setCode] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [sessionPassword, setSessionPassword] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);

                const { data: subData } = await supabase
                    .from("subscriptions")
                    .select("*")
                    .eq("user_id", session.user.id)
                    .eq("status", "active")
                    .single();

                setSubscription(subData);
            }
        };

        loadUser();
    }, []);

    const canJoin = useMemo(() => code.replace(/\D/g, "").length === 6, [code]);

    const onScanResult = async (text) => {
        const { code: scanned } = parseJoinUrl(text);
        if (!scanned || scanned.length !== 6) {
            showToast("Invalid QR", "error");
            return;
        }
        setCode(scanned);
        setModalOpen(false);
        await handleJoin(scanned);
    };

    const join = async () => {
        const six = code.replace(/\D/g, "").slice(0, 6);
        await handleJoin(six);
    };

    const handleJoin = async (joinCode) => {
        const success = await joinWithCode(joinCode);
        if (success) {
            // Session joined successfully
        }
    };

    const handlePasswordSubmit = async (password) => {
        setSessionPassword(password);
        setShowPasswordPrompt(false);
        const six = code.replace(/\D/g, "").slice(0, 6);
        await joinWithCode(six);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("dragover");
        const files = Array.from(e.dataTransfer.files);
        handleFileSelection(files);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("dragover");
    };

    const onFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFileSelection(files);
    };

    const handleFileSelection = (selectedFiles) => {
        const isPremium = subscription?.plan === "plus";
        const maxFileSize = isPremium
            ? PLANS.PLUS.features.maxFileSize
            : PLANS.FREE.features.maxFileSize;

        const oversizedFiles = selectedFiles.filter((f) => f.size > maxFileSize);

        if (oversizedFiles.length > 0) {
            const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
            showToast(
                `Some files exceed ${maxSizeMB}MB limit. ${
                    !isPremium ? "Upgrade to Plus for 2GB files!" : ""
                }`,
                "error"
            );

            if (!isPremium) {
                setTimeout(() => {
                    if (confirm("Upgrade to Plus to send files up to 2GB?")) {
                        window.location.href = "/pricing";
                    }
                }, 1000);
            }

            selectedFiles = selectedFiles.filter((f) => f.size <= maxFileSize);
        }

        if (selectedFiles.length > 0) {
            processFiles(selectedFiles);
        }
    };

    const isPremium = subscription?.plan === "plus";
    const maxFileSize = isPremium
        ? PLANS.PLUS.features.maxFileSize
        : PLANS.FREE.features.maxFileSize;

    const formatBytes = (bytes) => {
        if (bytes >= 1024 * 1024 * 1024) {
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 sm:pt-24 lg:pt-28">
                <div className="min-h-[70vh]" id="send">
                    <div className="text-center mb-6 sm:mb-10 lg:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.15] tracking-tight mb-3 sm:mb-4 lg:mb-6">
                            Join session
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-[#999] leading-relaxed max-w-[600px] mx-auto px-4">
                            Enter the code from the receiving device
                        </p>
                    </div>

                    {/* Premium Upgrade Banner - RESPONSIVE */}
                    {!isPremium && !isConnected && (
                        <div className="mb-6 sm:mb-8 p-4 sm:p-5 lg:p-6 rounded-xl border border-[#00ff88]/30 bg-gradient-to-r from-[#00ff88]/10 to-purple-500/10 backdrop-blur-sm">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                <div className="flex items-start gap-2.5 sm:gap-3">
                                    <Crown size={20} className="text-[#00ff88] shrink-0 sm:w-6 sm:h-6" />
                                    <div>
                                        <h3 className="text-sm sm:text-base font-semibold mb-1">
                                            Need to send bigger files?
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#999]">
                                            Free: up to {formatBytes(maxFileSize)} | Plus: up to 2GB
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/pricing"
                                    className="shrink-0 w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-[#00ff88] text-black text-sm sm:text-base rounded-lg font-medium hover:bg-[#00dd77] transition text-center whitespace-nowrap"
                                >
                                    Upgrade
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Session Info - RESPONSIVE */}
                    {isConnected && (
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="text-xs sm:text-sm text-[#666]">
                                Session:{" "}
                                <span className="text-white font-mono text-sm sm:text-base">
                                    {currentSession?.codeDisplay}
                                </span>
                                {isPremium && (
                                    <span className="ml-2 sm:ml-3 inline-flex items-center gap-1 text-[#00ff88]">
                                        <Crown size={12} className="sm:w-3.5 sm:h-3.5" />
                                        Plus
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={leaveRoom}
                                className="flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded bg-[#111] border border-[#222] text-white text-xs sm:text-sm font-medium hover:bg-[#1a1a1a] hover:border-red-500 hover:text-red-400 transition"
                            >
                                <X size={14} className="sm:w-4 sm:h-4" />
                                Leave Session
                            </button>
                        </div>
                    )}

                    {/* Join Form - RESPONSIVE */}
                    {!isConnected && (
                        <div className="bg-[#111] border border-[#222] rounded-lg p-5 sm:p-8 lg:p-12 text-center transition hover:bg-[#1a1a1a] hover:border-[#666]">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl leading-tight font-normal mb-6 sm:mb-8">
                                Enter Pairing Code
                            </h3>
                            <OTPInputs onChange={setCode} prefill={code} />

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6">
                                <button
                                    onClick={join}
                                    disabled={!canJoin}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 rounded text-sm sm:text-base lg:text-lg text-black font-medium bg-[#00ff88] border border-[#00ff88] hover:opacity-90 transition disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    <CheckCircle size={18} className="mr-2 sm:w-5 sm:h-5" />
                                    Join Session
                                </button>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 rounded bg-[#111] border border-[#222] text-white text-sm sm:text-base lg:text-lg font-medium hover:bg-[#1a1a1a] hover:border-[#666] transition"
                                >
                                    <QrCode size={18} className="mr-2 sm:w-5 sm:h-5" />
                                    Scan QR
                                </button>
                            </div>
                        </div>
                    )}

                    {/* File Upload Area - RESPONSIVE */}
                    {isConnected && (
                        <div className="bg-[#111] border border-[#222] rounded-lg p-5 sm:p-8 lg:p-12 transition hover:bg-[#1a1a1a] hover:border-[#666]">
                            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[rgba(0,255,136,0.1)] text-[#00ff88] flex items-center justify-center">
                                    <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl leading-tight font-normal">
                                        Connected - Ready to Send
                                    </h3>
                                </div>
                            </div>

                            <div
                                role="button"
                                tabIndex={0}
                                aria-label="Click to select files or drag and drop"
                                onClick={() => document.getElementById("fileInput")?.click()}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                className="border border-dashed border-[#222] rounded-lg px-5 sm:px-8 lg:px-12 py-10 sm:py-16 lg:py-24 text-center cursor-pointer my-6 sm:my-8 bg-[#111] hover:border-[#00ff88] hover:bg-[rgba(0,255,136,0.1)] [&.dragover]:border-[#00ff88] [&.dragover]:bg-[rgba(0,255,136,0.1)] transition"
                            >
                                <FolderOpen size={40} className="mx-auto mb-3 sm:mb-4 text-[#666] sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
                                <div className="text-sm sm:text-base lg:text-lg font-medium mb-2">
                                    Drop files here or click to browse
                                </div>
                                <div className="text-xs sm:text-sm lg:text-base text-[#666]">
                                    {isPremium ? `Up to 2GB per file` : `Up to ${formatBytes(maxFileSize)} per file`}
                                </div>
                                {isPremium && (
                                    <div className="mt-2 inline-flex items-center gap-1 text-xs sm:text-sm text-[#00ff88]">
                                        <Crown size={12} className="sm:w-3.5 sm:h-3.5" />
                                        Plus features enabled
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                id="fileInput"
                                multiple
                                className="hidden"
                                onChange={onFileSelect}
                            />

                            <UploadList />
                        </div>
                    )}
                </div>

                {modalOpen && (
                    <QRScanner onResult={onScanResult} onClose={() => setModalOpen(false)} />
                )}

                {showPasswordPrompt && (
                    <PasswordPromptModal
                        onSubmit={handlePasswordSubmit}
                        onClose={() => setShowPasswordPrompt(false)}
                    />
                )}
            </div>
        </div>
    );
}