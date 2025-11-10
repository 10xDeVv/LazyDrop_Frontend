"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useApp } from "@/context/InstantShareContext";
import { createClient } from "@/lib/supabase";
import { PLANS } from "@/lib/stripe";
import {
    Home,
    Copy,
    CheckCircle,
    Clock,
    FileText,
    Image,
    Video,
    Music,
    FileArchive,
    File,
    Download,
    X,
    Loader2,
    Crown,
    Lock,
    Settings,
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
            <Link href="/" className="text-lg font-medium text-white hover:text-[#00ff88] transition">
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

function QRImage({ data }) {
    if (!data) return <div className="text-sm text-[#666]">QR unavailable — use code</div>;
    return <img src={data} alt="QR code" className="block w-[200px] h-[200px]" />;
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

// Password Modal Component
function PasswordModal({ onSubmit, onClose }) {
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password) {
            onSubmit(password);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-[#222] rounded-xl p-8 w-[92%] max-w-md">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Set Session Password</h3>
                        <p className="text-sm text-[#999]">Protect your session with a password</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            minLength={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#00ff88] focus:outline-none transition"
                        />
                        <p className="mt-1 text-xs text-[#666]">
                            Minimum 4 characters. Sender will need this to join.
                        </p>
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
                            Set Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ReceivePage() {
    const {
        currentSession,
        createPairing,
        timeLeft,
        formatTime,
        autoDownload,
        toggleAutoDownload,
        isConnected,
        files,
        formatFileSize,
        downloadFile,
        downloadAllFiles,
        leaveRoom,
        showToast,
        bus,
    } = useApp();

    const supabase = createClient();
    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
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

    useEffect(() => {
        const off = bus.on("phoneJoined", () => {});
        return off;
    }, [bus]);

    const receivedFiles = files.filter(
        (f) => f.status === "uploaded" || f.status === "downloaded"
    );

    const copyCodeToClipboard = () => {
        if (currentSession?.codeDisplay) {
            navigator.clipboard.writeText(currentSession.codeDisplay);
            showToast("Code copied to clipboard!");
        }
    };

    const isPremium = subscription?.plan === "plus";
    const maxFileSize = isPremium
        ? PLANS.PLUS.features.maxFileSize
        : PLANS.FREE.features.maxFileSize;
    const sessionDuration = isPremium
        ? PLANS.PLUS.features.sessionDuration
        : PLANS.FREE.features.sessionDuration;

    const handleCreatePairing = async () => {
        if (isPremium && !sessionPassword) {
            // Show password modal for premium users
            setShowPasswordModal(true);
        } else {
            await createPairing();
        }
    };

    const handlePasswordSubmit = async (password) => {
        setSessionPassword(password);
        setShowPasswordModal(false);
        await createPairing();
        showToast("Password protection enabled");
    };

    const formatBytes = (bytes) => {
        if (bytes >= 1024 * 1024 * 1024) {
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <Nav />

            <div className="min-h-[70vh]" id="receive">
                <div className="text-center">
                    <h1 className="text-[clamp(1.75rem,5vw,3.5rem)] font-normal leading-[1.2] tracking-[-0.01em] mb-4 sm:mb-6">
                        Ready to receive
                    </h1>

                    <p className="text-base sm:text-[1.125rem] text-[#999] leading-[1.6] text-center max-w-[600px] mx-auto mb-8 sm:mb-16 px-4">
                        Share the code or QR with the sending device
                    </p>
                </div>

                {/* Premium Upgrade Banner */}
                {!isPremium && !currentSession && (
                    <div className="mb-8 p-4 sm:p-6 rounded-xl border border-[#00ff88]/30 bg-gradient-to-r from-[#00ff88]/10 to-purple-500/10 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <Crown size={24} className="text-[#00ff88] shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">
                                        Want bigger files & longer sessions?
                                    </h3>
                                    <p className="text-sm text-[#999]">
                                        Upgrade to Plus: 2GB files, 2hr sessions, password protection
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

                {/* Leave button when session active */}
                {currentSession && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div className="text-sm text-[#666]">
                            Session: <span className="text-white font-mono">{currentSession?.codeDisplay}</span>
                            {sessionPassword && (
                                <span className="ml-3 inline-flex items-center gap-1 text-[#00ff88]">
                  <Lock size={14} />
                  Protected
                </span>
                            )}
                        </div>
                        <button
                            onClick={leaveRoom}
                            className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded bg-[#111] border border-[#222] text-white text-sm font-medium hover:bg-[#1a1a1a] hover:border-red-500 hover:text-red-400 transition"
                        >
                            <X size={16} />
                            End Session
                        </button>
                    </div>
                )}

                {!currentSession && (
                    <div className="bg-[#111] border border-[#222] rounded-lg p-6 sm:p-12 text-center transition hover:bg-[#1a1a1a] hover:border-[#666]">
                        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
                            <div className="w-8 h-8 rounded bg-[rgba(255,215,0,0.1)] text-[#ffd700] flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3 className="text-[clamp(1.25rem,3vw,2rem)] leading-[1.3] font-normal mb-2 sm:mb-4">
                                    Create Pairing Session
                                </h3>
                                <p className="text-sm sm:text-base text-[#999] leading-[1.6]">
                                    {isPremium ? (
                                        <>
                                            Plus Plan: Up to {formatBytes(maxFileSize)} per file,{" "}
                                            {sessionDuration / 60} minute sessions
                                        </>
                                    ) : (
                                        <>
                                            Free: Up to {formatBytes(maxFileSize)} per file,{" "}
                                            {sessionDuration / 60} minute sessions
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleCreatePairing}
                            className="inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 rounded-[4px] text-black font-medium text-base bg-[#00ff88] border border-[#00ff88] hover:opacity-90 transition whitespace-nowrap"
                        >
                            <CheckCircle size={20} className="mr-2" />
                            Create Pairing
                        </button>

                        {isPremium && (
                            <p className="mt-4 text-sm text-[#00ff88] flex items-center justify-center gap-2">
                                <Crown size={16} />
                                Premium features enabled
                            </p>
                        )}
                    </div>
                )}

                {currentSession && !isConnected && (
                    <div className="bg-[#111] border border-[#222] rounded-lg p-6 sm:p-12 text-center transition hover:bg-[#1a1a1a] hover:border-[#666]">
                        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
                            <div className="w-8 h-8 rounded bg-[rgba(0,255,136,0.1)] text-[#00ff88] flex items-center justify-center">
                                <CheckCircle size={20} />
                            </div>
                            <h3 className="text-[clamp(1.25rem,3vw,2rem)] leading-[1.3] font-normal">
                                Session Active
                            </h3>
                        </div>

                        <div className="text-center my-8 sm:my-16">
                            <div className="inline-block p-6 sm:p-8 bg-white rounded-lg my-6 sm:my-8 border border-[#222]">
                                <QRImage data={currentSession.qrCodeData} />
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                                <div
                                    id="codeDisplay"
                                    className="font-mono text-[1.5rem] sm:text-[2rem] font-semibold tracking-[0.1em] text-white mt-4 sm:mt-8 mb-2 sm:mb-4"
                                >
                                    {currentSession.codeDisplay}
                                </div>
                                <button
                                    onClick={copyCodeToClipboard}
                                    className="p-2 rounded bg-[#111] border border-[#222] hover:bg-[#1a1a1a] transition"
                                    title="Copy code"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>

                            {sessionPassword && (
                                <div className="mt-4 p-3 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30">
                                    <div className="flex items-center justify-center gap-2 text-sm text-[#00ff88]">
                                        <Lock size={16} />
                                        Password: <span className="font-mono font-semibold">{sessionPassword}</span>
                                    </div>
                                </div>
                            )}

                            <div className="text-sm text-[#666] flex items-center justify-center gap-2 mt-4">
                                <Clock size={16} />
                                Expires in <span id="timeLeft">{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 sm:gap-6 my-8 sm:my-12">
                            <label htmlFor="autoDownload" className="text-sm text-[#999]">
                                Auto-download files
                            </label>
                            <div
                                role="switch"
                                aria-checked={autoDownload}
                                tabIndex={0}
                                onClick={toggleAutoDownload}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggleAutoDownload();
                                    }
                                }}
                                className={`relative w-12 h-6 border rounded-[12px] cursor-pointer transition ${
                                    autoDownload
                                        ? "bg-[#00ff88] border-[#00ff88]"
                                        : "bg-[#111] border-[#222]"
                                }`}
                            >
                                <div
                                    className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full transition ${
                                        autoDownload ? "translate-x-6 bg-black" : "translate-x-0 bg-white"
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {isConnected && (
                    <div id="connectedState">
                        <div className="bg-[#111] border border-[#222] rounded-lg p-6 sm:p-8 transition hover:bg-[#1a1a1a] hover:border-[#666]">
                            <div className="flex items-center gap-4 sm:gap-6 mb-8">
                                <div className="w-8 h-8 rounded bg-[rgba(0,255,136,0.1)] text-[#00ff88] flex items-center justify-center shrink-0">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-[clamp(1.25rem,3vw,2rem)] leading-[1.3] font-normal">
                                        Connected
                                    </h3>
                                    <p className="text-sm sm:text-base text-[#999] leading-[1.6]">
                                        Devices are paired and ready for file transfer
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-[#222] rounded-lg p-6 sm:p-8 mt-8 transition hover:bg-[#1a1a1a] hover:border-[#666]">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <h3 className="text-xl sm:text-2xl font-normal">Inbox</h3>
                                {receivedFiles.length > 1 && (
                                    <button
                                        onClick={downloadAllFiles}
                                        className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded bg-[#00ff88] text-black font-medium text-sm hover:opacity-90 transition"
                                    >
                                        <Download size={16} />
                                        <span className="hidden sm:inline">
                      Download All ({receivedFiles.length})
                    </span>
                                        <span className="sm:hidden">All ({receivedFiles.length})</span>
                                    </button>
                                )}
                            </div>

                            <div id="inboxList" className="my-8 sm:my-12">
                                {receivedFiles.length === 0 ? (
                                    <div className="text-center text-[#666] py-10 flex flex-col items-center gap-3">
                                        <Loader2 size={32} className="animate-spin" />
                                        <p>Waiting for files...</p>
                                    </div>
                                ) : (
                                    receivedFiles.map((file) => (
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
                                                    <p className="text-xs text-[#666]">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                {file.status === "uploaded" ? (
                                                    <button
                                                        onClick={() => downloadFile(file.id)}
                                                        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded bg-[#111] border border-[#222] text-white text-sm font-medium hover:bg-[#1a1a1a] hover:border-[#666] transition"
                                                    >
                                                        <Download size={16} className="sm:mr-2" />
                                                        <span className="hidden sm:inline">Download</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-[#666] flex items-center gap-1">
                            <CheckCircle size={14} />
                            <span className="hidden sm:inline">Downloaded</span>
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <PasswordModal
                    onSubmit={handlePasswordSubmit}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </div>
    );
}