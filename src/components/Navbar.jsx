// components/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Zap, Download } from "lucide-react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    const isLanding = pathname === "/";
    const isSession = pathname.includes("/session");

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => setIsMobileOpen(false), [pathname]);

    const navLinks = [
        { name: "How it works", href: "/#how-it-works" },
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/#pricing" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-[#0E0F12]/80 backdrop-blur-xl border-b border-white/5 py-4"
                        : "bg-transparent py-6"
                }`}
            >
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group z-50 relative">
                        <div className="w-8 h-8 bg-[#DFFF00] rounded-lg flex items-center justify-center text-black font-bold text-xl group-hover:rotate-12 transition-transform">
                            <Zap size={18} fill="black" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-[#DFFF00] transition-colors font-heading">
                            Lazydrop
                        </span>
                    </Link>

                    {/* Center Links - Landing Only */}
                    <div className="hidden md:flex items-center gap-8">
                        {isLanding && navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DFFF00] transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    {!isSession && (
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/receive"
                                className="text-sm font-bold text-white hover:text-[#DFFF00] transition-colors flex items-center gap-2"
                            >
                                <Download size={16} />
                                Join a session
                            </Link>

                            <Link
                                href="/send"
                                className="px-6 py-2.5 bg-[#DFFF00] text-black rounded-full font-bold text-sm hover:bg-[#ccee00] hover:shadow-[0_0_20px_rgba(223,255,0,0.3)] transition-all flex items-center gap-2"
                            >
                                Start a Drop
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-white z-50 relative p-2"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-[#0E0F12] pt-32 px-6 md:hidden flex flex-col"
                    >
                        {/* Mobile Menu Content (Same logic) */}
                        <div className="flex flex-col gap-8">
                            {isLanding ? navLinks.map((link, i) => (
                                <Link key={link.name} href={link.href} className="text-3xl font-bold text-white" onClick={() => setIsMobileOpen(false)}>{link.name}</Link>
                            )) : <Link href="/" className="text-3xl font-bold text-white">Home</Link>}

                            <div className="h-px bg-white/10 my-4" />

                            <Link href="/receive" className="text-xl font-bold text-gray-400" onClick={() => setIsMobileOpen(false)}>Join a session</Link>
                            <Link href="/send" className="py-4 bg-[#DFFF00] text-black rounded-xl font-bold text-center text-lg" onClick={() => setIsMobileOpen(false)}>Start a Drop</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}