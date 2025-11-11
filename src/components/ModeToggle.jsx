// components/ModeToggle.jsx
"use client";
import Link from "next/link";
import { Download, Upload } from "lucide-react";

export default function ModeToggle({ currentMode }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            <Link
                href="/receive"
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                    currentMode === "receive"
                        ? "bg-[#00ff88] text-black"
                        : "bg-[#111] border border-[#222] text-[#999] hover:text-white hover:border-[#00ff88]"
                }`}
            >
                <Download size={18} />
                Receive
            </Link>

            <Link
                href="/send"
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                    currentMode === "send"
                        ? "bg-[#00ff88] text-black"
                        : "bg-[#111] border border-[#222] text-[#999] hover:text-white hover:border-[#00ff88]"
                }`}
            >
                <Upload size={18} />
                Send
            </Link>
        </div>
    );
}
