"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    Zap,
    Shield,
    Clock,
    Users,
    ArrowRight,
    Check,
    Star,
    Menu,
    X as CloseIcon,
    Sparkles,
    Upload,
    Download,
    QrCode,
} from "lucide-react";

// Modern Navbar Component
function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">🦥</span>
                        <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-[#00ff88] transition">
              LazyDrop
            </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="#features"
                            className="text-sm text-[#999] hover:text-white transition"
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-sm text-[#999] hover:text-white transition"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#faq"
                            className="text-sm text-[#999] hover:text-white transition"
                        >
                            FAQ
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
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
                        <Link
                            href="#features"
                            className="block text-[#999] hover:text-white transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="block text-[#999] hover:text-white transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#faq"
                            className="block text-[#999] hover:text-white transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            FAQ
                        </Link>
                        <div className="pt-4 border-t border-white/10 space-y-3">
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
                        </div>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}

// Hero Section
function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/5 via-transparent to-transparent" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                    <Sparkles size={16} className="text-[#00ff88]" />
                    <span className="text-sm text-[#999]">Too lazy for cables? Same.</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                >
                    File sharing for the
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00ddff]">
            lazy generation
          </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg sm:text-xl text-[#999] max-w-2xl mx-auto mb-12"
                >
                    Drop files between devices instantly. No cables, no apps, no signups.
                    Just pure laziness-enabled technology.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/receive"
                        className="group w-full sm:w-auto px-8 py-4 text-lg font-semibold text-black bg-[#00ff88] rounded-xl hover:bg-[#00dd77] transition flex items-center justify-center gap-2"
                    >
                        Start Dropping Files
                        <ArrowRight
                            size={20}
                            className="group-hover:translate-x-1 transition"
                        />
                    </Link>
                    <Link
                        href="#pricing"
                        className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white border border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 transition"
                    >
                        View Pricing
                    </Link>
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex items-center justify-center gap-2 text-sm text-[#666]"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00ddff] border-2 border-black"
                            />
                        ))}
                    </div>
                    <span>Trusted by 10,000+ lazy people worldwide</span>
                </motion.div>
            </div>
        </section>
    );
}

// How It Works Section
function HowItWorks() {
    const steps = [
        {
            icon: <QrCode className="w-8 h-8" />,
            title: "Create or Join",
            description: "Generate a code or scan QR to connect devices instantly",
        },
        {
            icon: <Upload className="w-8 h-8" />,
            title: "Drop Files",
            description: "Drag & drop or select files. Up to 100MB for free",
        },
        {
            icon: <Download className="w-8 h-8" />,
            title: "Done",
            description: "Files transfer instantly. No waiting, no BS",
        },
    ];

    return (
        <section className="py-20 sm:py-32 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        How it works
                    </h2>
                    <p className="text-lg text-[#999] max-w-2xl mx-auto">
                        Three steps to laziness perfection
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:border-[#00ff88]/50 transition group"
                        >
                            <div className="absolute -top-4 left-8 w-12 h-12 rounded-xl bg-[#00ff88] text-black flex items-center justify-center font-bold text-xl">
                                {i + 1}
                            </div>
                            <div className="text-[#00ff88] mb-4 mt-4">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-[#999]">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Features Section
function Features() {
    const features = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Instant Transfer",
            description: "No upload to cloud. Direct P2P connection for max speed",
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure & Private",
            description: "End-to-end encrypted. Files deleted after session expires",
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "No Time Wasted",
            description: "Average session setup: 5 seconds. That's it.",
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Any Device",
            description: "Phone, tablet, laptop, desktop. They all speak LazyDrop",
        },
    ];

    return (
        <section id="features" className="py-20 sm:py-32 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Why people love it
                    </h2>
                    <p className="text-lg text-[#999] max-w-2xl mx-auto">
                        Built for lazy people, by lazy people
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#00ff88]/50 transition"
                        >
                            <div className="w-12 h-12 rounded-lg bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-[#999]">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Pricing Section
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
        <section id="pricing" className="py-20 sm:py-32 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Choose your speed
                    </h2>
                    <p className="text-lg text-[#999] max-w-2xl mx-auto">
                        Start free, upgrade when you need more
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-8 rounded-2xl ${
                                plan.popular
                                    ? "border-2 border-[#00ff88] bg-gradient-to-b from-[#00ff88]/10 to-transparent"
                                    : "border border-white/10 bg-white/5"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00ff88] text-black text-sm font-semibold">
                                    POPULAR
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-[#999] mb-4">{plan.description}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold">${plan.price}</span>
                                    {plan.price !== "0" && (
                                        <span className="text-[#666]">/month</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <Check size={20} className="text-[#00ff88] shrink-0 mt-0.5" />
                                        <span className="text-sm text-[#ccc]">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`block w-full py-3 text-center rounded-xl font-semibold transition ${
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

// FAQ Section
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
        <section id="faq" className="py-20 sm:py-32 relative">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Questions? We got you
                    </h2>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                            <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                            <p className="text-[#999]">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Footer
function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-[#999]">
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
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-[#999]">
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
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-[#999]">
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
                        <h4 className="font-semibold mb-4">Social</h4>
                        <ul className="space-y-2 text-sm text-[#999]">
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

    <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
            <span className="text-2xl">🦥</span>
            <span className="font-semibold">LazyDrop</span>
        </div>
        <p className="text-sm text-[#666]">
            © 2025 LazyDrop. Too lazy for cables since 2025.
        </p>
    </div>
</div>
</footer>
);
}

// Main Page Component
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