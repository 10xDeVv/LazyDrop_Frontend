"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/context/InstantShareContext";
import QRScanner from "@/components/QRScanner";
import { createClient } from "@/lib/supabase";
import { PLANS } from "@/lib/stripe";
import {
    Home,
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
    Settings,
    AlertCircle,
} from "lucide-react";

function Nav() {
    const [user, setUser] = useState(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });
    }, []);

    return (
        <nav className="flex items-center justify-between py-6 sm:py-12 mb-8 sm:mb-16">
            <Link
                href="/"
                className="text-lg font-medium text-white hover:text-[#00ff88] transition"
            >
                LazyDrop
            </Link>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-sm text-[#999] px-4 py-2 hover:text-white transition"
                        >
                            <Settings size={16} />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="text-sm text-[#999] px-4 py-2 hover:text-white transition"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="text-sm font-medium text-black bg-[#00ff88] px-4 py-2 rounded-lg hover:bg-[#00dd77] transition"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-[#999] px-4 py-2 hover:text-white transition"
                >
                    <Home size={16} />
                    <span className="hidden sm:inline">Home</span>
                </Link>
            </div>
        </nav>
    );
}

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

    if (["pdf", "doc", "docx", "txt"].includes(ext))
        return <FileText className="w-4 h-4" />;
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
        return <Image className="w-4 h-4" />;
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext))
        return <Video className="w-4 h-4" />;
    if (["mp3", "wav", "ogg", "flac"].includes(ext))
        return <Music className="w-4 h-4" />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
        return <FileArchive className="w-4 h-4" />;

    return <File className="w-4 h-4" />;
};

// Password Prompt Modal
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-[#222] rounded-xl p-8 w-[92%] max-w-md">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Password Required</h3>
                        <p className="text-sm text-[#999]">This session is password protected</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-2">
                        <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter session password"
                            autoFocus
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#00ff88] focus:outline-none transition"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-[#00ff88] text-black rounded-lg font-medium hover:bg-[#00dd77] transition"
                        >
                            Join Session
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

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
            className="flex gap-2 sm:gap-4 justify-center items-center my-8 sm:my-16 px-4"
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
                    className={`w-10 h-14 sm:w-12 sm:h-16 bg-[#111] border border-[#222] rounded text-white text-lg sm:text-xl font-medium text-center transition outline-none focus:border-[#00ff88] focus:bg-[#1a1a1a] ${
                        values[i] ? "border-[#00ff88] bg-[#1a1a1a]" : ""
                    }`}
                />
            ))}
            <span className="text-[1.25rem] sm:text-[1.5rem] text-[#666] mx-1 sm:mx-2 shrink-0">
        -
      </span>
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
                    className={`w-10 h-14 sm:w-12 sm:h-16 bg-[#111] border border-[#222] rounded text-white text-lg sm:text-xl font-medium text-center transition outline-none focus:border-[#00ff88] focus:bg-[#1a1a1a] ${
                        values[i] ? "border-[#00ff88] bg-[#1a1a1a]" : ""
                    }`}
                />
            ))}
        </div>
    );
}

function UploadList() {
    const { files, formatFileSize, downloadAllFiles } = useApp();
    if (files.length === 0) return null;

    const uploadedFiles = files.filter((f) => f.status === "uploaded");

    return (
        <div id="uploadList" className="my-8">
            {uploadedFiles.length > 1 && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={downloadAllFiles}
                        className="px-4 sm:px-6 py-3 rounded bg-[#00ff88] text-black font-medium text-sm hover:opacity-90 transition flex items-center gap-2"
                    >
                        <Upload size={16} />
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
                    className="flex items-center justify-between p-4 sm:p-6 bg-[#111] border border-[#222] rounded mb-4 transition hover:bg-[#1a1a1a] hover:border-[#666]"
                >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded bg-[#00ff88] text-black flex items-center justify-center shrink-0">
                            {getFileIcon(file.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium mb-[2px] truncate">
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
                                <span className="text-xs text-[#666] hidden sm:inline">
                  Sending...
                </span>
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

                // Load subscription
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
        // Check if session requires password (you'd need to implement this check)
        // For now, we'll assume password is always required for demo
        // In production, check session metadata from backend

        const success = await joinWithCode(joinCode);
        if (success) {
            // Session joined successfully
        }
    };

    const handlePasswordSubmit = async (password) => {
        setSessionPassword(password);
        setShowPasswordPrompt(false);
        // Verify password with backend and join
        // For now, just join
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

        // Check file sizes
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
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <Nav />

            <div className="min-h-[70vh]" id="send">
                <div className="text-center mb-8">
                    <h1 className="text-[clamp(1.75rem,5vw,3.5rem)] font-normal leading-[1.2] tracking-[-0.01em] mb-4 sm:mb-6">
                        Join session
                    </h1>
                    <p className="text-base sm:text-[1.125rem] text-[#999] leading-[1.6] text-center max-w-[600px] mx-auto mb-8 sm:mb-16 px-4">
                        Enter the code from the receiving device
                    </p>
                </div>

                {/* Premium Upgrade Banner */}
                {!isPremium && !isConnected && (
                    <div className="mb-8 p-4 sm:p-6 rounded-xl border border-[#00ff88]/30 bg-gradient-to-r from-[#00ff88]/10 to-purple-500/10 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <Crown size={24} className="text-[#00ff88] shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">
                                        Need to send bigger files?
                                    </h3>
                                    <p className="text-sm text-[#999]">
                                        Free: up to {formatBytes(maxFileSize)} | Plus: up to 2GB
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/pricing"
                                className="shrink-0 px-6 py-2.5 bg-[#00ff88] text-black rounded-lg font-medium hover:bg-[#00dd77] transition whitespace-nowrap"
                            >
                                Upgrade
                            </Link>
                        </div>
                    </div>
                )}

                {isConnected && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div className="text-sm text-[#666]">
                            Session:{" "}
                            <span className="text-white font-mono">
                {currentSession?.codeDisplay}
              </span>
                            {isPremium && (
                                <span className="ml-3 inline-flex items-center gap-1 text-[#00ff88]">
                  <Crown size={14} />
                  Plus
                </span>
                            )}
                        </div>
                        <button
                            onClick={leaveRoom}
                            className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded bg-[#111] border border-[#222] text-white text-sm font-medium hover:bg-[#1a1a1a] hover:border-red-500 hover:text-red-400 transition"
                        >
                            <X size={16} />
                            Leave Session
                        </button>
                    </div>
                )}

                {!isConnected && (
                    <div className="bg-[#111] border border-[#222] rounded-lg p-6 sm:p-12 text-center transition hover:bg-[#1a1a1a] hover:border-[#666]">
                        <h3 className="text-[clamp(1.25rem,3vw,2rem)] leading-[1.3] font-normal mb-8">
                            Enter Pairing Code
                        </h3>
                        <OTPInputs onChange={setCode} prefill={code} />

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                            <button
                                onClick={join}
                                disabled={!canJoin}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 rounded-[4px] text-black font-medium text-base bg-[#00ff88] border border-[#00ff88] hover:opacity-90 transition disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <CheckCircle size={20} className="mr-2" />
                                Join Session
                            </button>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 rounded-[4px] bg-[#111] border border-[#222] text-white text-base font-medium hover:bg-[#1a1a1a] hover:border-[#666] transition"
                            >
                                <QrCode size={20} className="mr-2" />
                                Scan QR
                            </button>
                        </div>
                    </div>
                )}

                {isConnected && (
                    <div className="bg-[#111] border border-[#222] rounded-lg p-6 sm:p-12 transition hover:bg-[#1a1a1a] hover:border-[#666]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-8 h-8 rounded bg-[rgba(0,255,136,0.1)] text-[#00ff88] flex items-center justify-center">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <h3 className="text-[clamp(1.25rem,3vw,2rem)] leading-[1.3] font-normal">
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
                            className="border border-dashed border-[#222] rounded-lg px-6 sm:px-12 py-12 sm:py-24 text-center cursor-pointer my-8 bg-[#111] hover:border-[#00ff88] hover:bg-[rgba(0,255,136,0.1)] [&.dragover]:border-[#00ff88] [&.dragover]:bg-[rgba(0,255,136,0.1)] transition"
                        >
                            <FolderOpen size={48} className="mx-auto mb-4 text-[#666]" />
                            <div className="text-base font-medium mb-2">
                                Drop files here or click to browse
                            </div>
                            <div className="text-sm text-[#666]">
                                {isPremium ? `Up to 2GB per file` : `Up to ${formatBytes(maxFileSize)} per file`}
                            </div>
                            {isPremium && (
                                <div className="mt-2 inline-flex items-center gap-1 text-xs text-[#00ff88]">
                                    <Crown size={12} />
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
    );
}