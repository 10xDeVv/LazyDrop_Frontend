// app/page.jsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Zap,
    Shield,
    Clock,
    Users,
    ArrowRight,
    Check,
    Sparkles,
    Upload,
    Download,
    QrCode, CheckCircle,
    File
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Image from "next/image";

// Hero Section - FULLY RESPONSIVE
function Hero() {
    return (
        <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-8 sm:pb-0">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/5 via-transparent to-transparent" />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#00ff88]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 w-full">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Side - Content */}
                    <div className="text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                            <Sparkles size={14} className="text-[#00ff88] sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm text-[#999]">Too lazy for cables? Same.</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-[1.05] sm:leading-tight"
                        >
                            Drop files like you drop
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00dddd]">
                                excuses
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm sm:text-lg lg:text-xl text-[#999] mb-6 sm:mb-8 lg:mb-10"
                        >
                            Drop files between devices instantly. No cables, no apps, no signups.
                            Just pure laziness-enabled technology.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
                        >
                            <Link
                                href="/receive"
                                className="group px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-black bg-[#00ff88] rounded-xl hover:bg-[#00dd77] transition flex items-center justify-center gap-2"
                            >
                                Start Dropping Files
                                <ArrowRight
                                    size={20}
                                    className="group-hover:translate-x-1 transition"
                                />
                            </Link>
                            <Link
                                href="#pricing"
                                className="px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-white border border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 transition text-center"
                            >
                                View Pricing
                            </Link>
                        </motion.div>

                        {/* Trust Badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-row items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#666]"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00ddff] border-2 border-black"
                                    />
                                ))}
                            </div>
                            <span>Trusted by 10,000+ lazy people worldwide</span>
                        </motion.div>
                    </div>

                    {/* Right Side - Visual Element */}
                    {/* Right Side - Code + QR Visual */}
                    {/* Right Side - Code + QR Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative">
                            {/* Main Card Container */}
                            <div className="bg-[#0a0a0a]/50 border border-[#1a1a1a] rounded-3xl p-10 lg:p-12 backdrop-blur-xl max-w-md">
                                {/* Header */}
                                <div className="flex items-center gap-2 mb-10">
                                    <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#666] font-medium">
                                        Connect Instantly
                                    </p>
                                </div>

                                {/* Code Section */}
                                <div className="mb-12">
                                    <p className="text-sm text-[#666] mb-6 tracking-wide">Enter code</p>
                                    <div className="font-mono text-7xl font-bold tracking-[0.1em] text-white leading-none">
                                        123<span className="text-[#2a2a2a] mx-2">-</span>456
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="relative flex items-center my-10">
                                    <div className="flex-1 h-px bg-[#1a1a1a]" />
                                    <span className="px-6 text-sm text-[#666] tracking-wide">
                    or
                </span>
                                    <div className="flex-1 h-px bg-[#1a1a1a]" />
                                </div>

                                {/* QR Section */}
                                <div>
                                    <p className="text-sm text-[#666] mb-6 tracking-wide">Scan QR code</p>

                                    {/* QR Code Container */}
                                    <div className="relative inline-block">
                                        <div className="bg-white p-5 rounded-2xl">
                                            {/* Real QR Code Pattern */}
                                            <svg width="180" height="180" viewBox="0 0 21 21" className="w-44 h-44">
                                                <rect width="21" height="21" fill="white"/>

                                                {/* Generate actual QR-like pattern */}
                                                {(() => {
                                                    const qrData = [
                                                        // Position markers and data pattern
                                                        [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1],
                                                        [1,0,0,0,0,0,1,0,0,1,1,0,1,0,1,0,0,0,0,0,1],
                                                        [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
                                                        [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
                                                        [1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1],
                                                        [1,0,0,0,0,0,1,0,0,0,1,1,1,0,1,0,0,0,0,0,1],
                                                        [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
                                                        [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
                                                        [1,0,1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1,1,0,1],
                                                        [0,1,0,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,0,1,0],
                                                        [1,1,1,0,1,0,1,1,1,0,1,1,0,1,0,0,0,1,1,0,1],
                                                        [0,0,0,1,0,1,0,0,0,1,1,0,1,0,1,1,1,0,0,1,0],
                                                        [1,1,1,0,1,0,1,1,1,0,0,1,0,1,1,0,0,1,1,0,1],
                                                        [0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,1,0,1,1,0],
                                                        [1,1,1,1,1,1,1,0,0,0,0,1,0,0,1,1,0,1,0,1,1],
                                                        [1,0,0,0,0,0,1,0,1,1,1,0,1,1,0,0,1,0,1,0,1],
                                                        [1,0,1,1,1,0,1,0,0,0,0,1,0,0,1,1,1,1,0,1,0],
                                                        [1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,0,0,0,1,1,1],
                                                        [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,1,0,1,0,0,1],
                                                        [1,0,0,0,0,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1,0],
                                                        [1,1,1,1,1,1,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1],
                                                    ];

                                                    return qrData.flatMap((row, y) =>
                                                        row.map((cell, x) =>
                                                            cell ? (
                                                                <rect
                                                                    key={`${x}-${y}`}
                                                                    x={x}
                                                                    y={y}
                                                                    width="1"
                                                                    height="1"
                                                                    fill="black"
                                                                />
                                                            ) : null
                                                        )
                                                    );
                                                })()}
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subtle floating accent - very minimal */}
                            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#00ff88]/3 blur-3xl -z-10" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        {
            icon: <QrCode className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
            title: "Create or Join",
            description: "Generate a code or scan QR to connect devices instantly",
        },
        {
            icon: <Upload className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
            title: "Drop Files",
            description: "Drag & drop or select files. Up to 100MB for free",
        },
        {
            icon: <Download className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
            title: "Done",
            description: "Files transfer instantly. No waiting, no BS",
        },
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-28 xl:py-36 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20">
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">
                        How it works
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-[#999] max-w-2xl mx-auto px-4">
                        Three steps to laziness perfection
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative p-6 sm:p-8 lg:p-10 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:border-[#00ff88]/50 transition group"
                        >
                            <div className="absolute -top-3 sm:-top-4 left-6 sm:left-8 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#00ff88] text-black flex items-center justify-center font-bold text-lg sm:text-xl">
                                {i + 1}
                            </div>
                            <div className="text-[#00ff88] mb-3 sm:mb-4 mt-3 sm:mt-4">{step.icon}</div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-sm sm:text-base text-[#999]">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Features() {
    const features = [
        {
            icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
            title: "Instant Transfer",
            description: "No upload to cloud. Direct P2P connection for max speed",
        },
        {
            icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
            title: "Secure & Private",
            description: "End-to-end encrypted. Files deleted after session expires",
        },
        {
            icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
            title: "No Time Wasted",
            description: "Average session setup: 5 seconds. That's it.",
        },
        {
            icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
            title: "Any Device",
            description: "Phone, tablet, laptop, desktop. They all speak LazyDrop",
        },
    ];

    return (
        <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-28 xl:py-36 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20">
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">
                        Why people love it
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-[#999] max-w-2xl mx-auto px-4">
                        Built for lazy people, by lazy people
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-5 sm:p-6 lg:p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#00ff88]/50 transition"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center mb-3 sm:mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-xs sm:text-sm lg:text-base text-[#999]">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "0",
            description: "Perfect for casual use",
            features: [
                "Instant file sharing",
                "Up to 100MB per file",
                "10 minute sessions",
                "No signup required",
                "Basic support",
            ],
            cta: "Start Free",
            href: "/receive",
            popular: false,
        },
        {
            name: "Plus",
            price: "4.99",
            description: "For power users",
            features: [
                "Everything in Free",
                "Up to 2GB per file",
                "2 hour sessions",
                "Transfer history",
                "Password protection",
                "Priority speeds",
                "Multiple devices",
            ],
            cta: "Upgrade to Plus",
            href: "/signup",
            popular: true,
        },
    ];

    return (
        <section id="pricing" className="py-12 sm:py-16 md:py-20 lg:py-28 xl:py-36 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20">
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">
                        Choose your speed
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-[#999] max-w-2xl mx-auto px-4">
                        Start free, upgrade when you need more
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-6 sm:p-8 lg:p-10 rounded-2xl ${
                                plan.popular
                                    ? "border-2 border-[#00ff88] bg-gradient-to-b from-[#00ff88]/10 to-transparent"
                                    : "border border-white/10 bg-white/5"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full bg-[#00ff88] text-black text-xs sm:text-sm font-semibold">
                                    POPULAR
                                </div>
                            )}

                            <div className="mb-5 sm:mb-6">
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-sm sm:text-base text-[#999] mb-3 sm:mb-4">{plan.description}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl sm:text-5xl lg:text-6xl font-bold">${plan.price}</span>
                                    {plan.price !== "0" && (
                                        <span className="text-sm sm:text-base text-[#666]">/month</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-2.5 sm:gap-3">
                                        <Check size={18} className="text-[#00ff88] shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                                        <span className="text-xs sm:text-sm lg:text-base text-[#ccc]">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`block w-full py-2.5 sm:py-3 lg:py-3.5 text-center rounded-xl text-sm sm:text-base font-semibold transition ${
                                    plan.popular
                                        ? "bg-[#00ff88] text-black hover:bg-[#00dd77]"
                                        : "border border-white/20 text-white hover:bg-white/5"
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// FAQ Section - FULLY RESPONSIVE
function FAQ() {
    const faqs = [
        {
            q: "Do I really need to sign up?",
            a: "Nope! The free tier works instantly with no account. Sign up only if you want history, bigger files, or premium features.",
        },
        {
            q: "How secure is LazyDrop?",
            a: "All transfers are encrypted. Files are automatically deleted when sessions expire. We don't store anything permanently.",
        },
        {
            q: "What's the file size limit?",
            a: "Free users can send up to 100MB per file. Plus users get 2GB per file.",
        },
        {
            q: "Can I cancel Plus anytime?",
            a: "Absolutely! No contracts, no questions asked. Cancel anytime from your account settings.",
        },
    ];

    return (
        <section id="faq" className="py-12 sm:py-16 md:py-20 lg:py-28 xl:py-36 relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20">
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">
                        Questions? We got you
                    </h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-5 sm:p-6 lg:p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">{faq.q}</h3>
                            <p className="text-sm sm:text-base text-[#999]">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Footer - FULLY RESPONSIVE
function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 py-8 sm:py-10 lg:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-6 sm:mb-8">
                    <div>
                        <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-[#999]">
                            <li>
                                <Link href="#features" className="hover:text-white transition">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="hover:text-white transition">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/receive" className="hover:text-white transition">
                                    Receive
                                </Link>
                            </li>
                            <li>
                                <Link href="/send" className="hover:text-white transition">
                                    Send
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-[#999]">
                            <li>
                                <Link href="/about" className="hover:text-white transition">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-white transition">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-[#999]">
                            <li>
                                <Link href="/privacy" className="hover:text-white transition">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white transition">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Social</h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-[#999]">
                            <li>
                                <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition"
                                >
                                Twitter
                            </a>
                        </li>
                        <li>
                            <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition"
                            >
                            GitHub
                        </a>
                    </li>
                </ul>
            </div>
        </div>

    <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="LazyDrop" width={32} height={32} className="w-10 h-10 sm:w-10 sm:h-10" priority />
            <span className="font-semibold text-sm sm:text-base">LazyDrop</span>
        </div>
        <p className="text-xs sm:text-sm text-[#666] text-center sm:text-right">
            © 2025 LazyDrop. Too lazy for cables since 2025.
        </p>
    </div>
</div>
</footer>
);
}

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <Hero />
            <HowItWorks />
            <Features />
            <Pricing />
            <FAQ />
            <Footer />
        </div>
    );
}