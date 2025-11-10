// components/UpgradeModal.js
"use client";
import { X, Zap, Clock, FolderOpen, History, Lock } from "lucide-react";
import Link from "next/link";

const features = {
    "larger-files": { icon: Zap, title: "2GB Files", desc: "Send massive files" },
    "longer-sessions": { icon: Clock, title: "2 Hour Sessions", desc: "No rush" },
    "folder-upload": { icon: FolderOpen, title: "Send Folders", desc: "Zip & send" },
    "history": { icon: History, title: "File History", desc: "7-day access" },
    "password": { icon: Lock, title: "Password Rooms", desc: "Extra secure" },
};

export default function UpgradeModal({ isOpen, onClose, feature = "larger-files", fileName, fileSize }) {
    if (!isOpen) return null;

    const feat = features[feature];

    const Icon = feat.icon;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-[#111] border border-[#222] rounded-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#00ff88]" />
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-lg transition">
                        <X size={20} />
                    </button>
                </div>

                <h3 className="text-2xl font-medium mb-2">Want {feat.title}?</h3>
                <p className="text-[#999] mb-6">
                    {fileName ? `${fileName} is too big for free tier.` : feat.desc}
                </p>

                {fileSize && (
                    <p className="text-sm text-[#666] mb-4">
                        File size: <span className="text-white">{(fileSize / 1024 / 1024).toFixed(1)} MB</span>
                    </p>
                )}

                <div className="space-y-3">
                    <Link
                        href="/pricing"
                        className="block w-full py-3 bg-[#00ff88] text-black font-medium rounded-lg hover:opacity-90 transition text-center"
                    >
                        Get Plus — $4.99/mo
                    </Link>
                    <button
                        onClick={onClose}
                        className="block w-full py-3 bg-[#111] border border-[#222] text-white rounded-lg hover:bg-[#1a1a1a] transition"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}