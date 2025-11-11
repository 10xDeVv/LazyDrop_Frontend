"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X as CloseIcon, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import Image from "next/image";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image src="/icon.png" alt="LazyDrop" width={32} height={32} className="w-10 h-10 sm:w-10 sm:h-10" priority />
                        <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-[#00ff88] transition">
                            LazyDrop
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Product Links Group */}
                        <div className="flex items-center gap-6 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10">
                            <Link
                                href="/receive"
                                className="text-sm text-[#999] hover:text-white transition"
                            >
                                Receive
                            </Link>
                            <div className="w-px h-4 bg-white/20" />
                            <Link
                                href="/send"
                                className="text-sm text-[#999] hover:text-white transition"
                            >
                                Send
                            </Link>
                        </div>

                        {/* Info Links */}
                        <Link
                            href="/#features"
                            className="text-sm text-[#999] hover:text-white transition"
                        >
                            Features
                        </Link>
                        <Link
                            href="/#pricing"
                            className="text-sm text-[#999] hover:text-white transition"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/#faq"
                            className="text-sm text-[#999] hover:text-white transition"
                        >
                            FAQ
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:text-[#00ff88] transition"
                            >
                                <Settings size={16} />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm text-white hover:text-[#00ff88] transition"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-6 py-2.5 text-sm font-medium text-black bg-[#00ff88] rounded-lg hover:bg-[#00dd77] transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white"
                    >
                        {mobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl"
                >
                    <div className="px-4 py-6 space-y-4">
                        {/* Product Links */}
                        <div className="pb-4 border-b border-white/10">
                            <p className="text-xs text-[#666] uppercase tracking-wider mb-3">Product</p>
                            <Link
                                href="/receive"
                                className="block py-2 text-[#999] hover:text-white transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Receive
                            </Link>
                            <Link
                                href="/send"
                                className="block py-2 text-[#999] hover:text-white transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Send
                            </Link>
                        </div>

                        {/* Info Links */}
                        <Link
                            href="/#features"
                            className="block text-[#999] hover:text-white transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="/#pricing"
                            className="block text-[#999] hover:text-white transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/#faq"
                            className="block text-[#999] hover:text-white transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            FAQ
                        </Link>

                        {/* Auth Buttons */}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className="block w-full px-4 py-2.5 text-center text-white border border-white/20 rounded-lg hover:border-white/40 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block w-full px-4 py-2.5 text-center text-white border border-white/20 rounded-lg hover:border-white/40 transition"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="block w-full px-4 py-2.5 text-center text-black bg-[#00ff88] rounded-lg font-medium hover:bg-[#00dd77] transition"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}