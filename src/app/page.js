// app/page.tsx
"use client";
import Link from "next/link";
import { ChevronRight, Zap, Clock, Shield, History, Folder, Users, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
            {/* Nav */}
            <nav className="flex items-center justify-between py-6 sm:py-10">
                <Link href="/" className="text-2xl font-bold text-white hover:text-[#00ff88] transition">
                    LazyDrop
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/receive" className="text-sm text-[#999] hover:text-white transition hidden sm:block">
                        Receive
                    </Link>
                    <Link href="/send" className="text-sm text-[#999] hover:text-white transition hidden sm:block">
                        Send
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-sm font-medium px-4 py-2 bg-[#111] border border-[#222] rounded-lg hover:bg-[#1a1a1a] hover:border-[#00ff88] hover:text-[#00ff88] transition"
                    >
                        Plus
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="text-center py-16 sm:py-24">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#00ff88] mb-6">
                    <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></span>
                    Too lazy for cables? Same.
                </div>

                <h1 className="text-[clamp(3rem,10vw,7rem)] font-normal leading-[0.9] tracking-[-0.03em] mb-6">
                    Drop files like you
                    <br />
                    <span className="text-metal inline-block group-hover:animate-[metal-sheen_2s_ease-in-out_infinite]">
            drop excuses
          </span>
                </h1>

                <p className="text-lg text-[#999] max-w-2xl mx-auto mb-12">
                    No apps. No signups. No cables. Just open, drop, done.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/receive"
                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-[#e5e5e5] transition"
                    >
                        Start Receiving <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </Link>
                    <Link
                        href="/send"
                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-[#111] border border-[#222] text-white font-medium rounded-lg hover:bg-[#1a1a1a] hover:border-[#00ff88] transition"
                    >
                        Start Sending <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 border-t border-[#222]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Zap, title: "Instant", desc: "Room created in <1s. No login." },
                        { icon: Shield, title: "Secure", desc: "End-to-end. No logs. Expires in 10 min." },
                        { icon: Clock, title: "Lazy", desc: "Just visit → drop → done." },
                    ].map((f, i) => (
                        <div key={i} className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                                <f.icon className="w-6 h-6 text-[#00ff88]" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">{f.title}</h3>
                            <p className="text-[#999] text-sm" dangerouslySetInnerHTML={{ __html: f.desc }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Freemium CTA */}
            <section className="py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl font-normal mb-6">
                        Free forever. <span className="text-[#00ff88]">Plus</span> for power users.
                    </h2>
                    <p className="text-[#999] mb-12 max-w-2xl mx-auto">
                        Keep it simple with 100MB + 10 min sessions. Unlock 2GB, history, folders, and more with Plus.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 hover:border-[#666] transition">
                            <h3 className="text-2xl font-medium mb-2">Free</h3>
                            <p className="text-[#999] mb-6">Perfect for quick drops</p>
                            <ul className="space-y-3 text-left text-sm">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00ff88]" /> 100MB per file</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00ff88]" /> 10 min sessions</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00ff88]" /> No signup</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00ff88]" /> Instant sharing</li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/receive" className="block w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-[#e5e5e5] transition">
                                    Start Free
                                </Link>
                            </div>
                        </div>

                        {/* Plus Tier */}
                        <div className="bg-gradient-to-br from-[#00ff88]/5 to-transparent border border-[#00ff88]/50 rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-[#00ff88] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                                POPULAR
                            </div>
                            <h3 className="text-2xl font-medium mb-2">Plus</h3>
                            <p className="text-[#999] mb-6">For heavy lifters</p>
                            <ul className="space-y-3 text-left text-sm">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00ff88]" /> 2GB per file</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00ff88]" /> 2 hour sessions</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00ff88]" /> File history (7 days)</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00ff88]" /> Folder upload</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00ff88]" /> Password rooms</li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/pricing" className="block w-full py-3 bg-[#00ff88] text-black font-medium rounded-lg hover:opacity-90 transition">
                                    Get Plus — $4.99/mo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-[#222] text-center text-[#666] text-sm">
                <p>Made by a CS student who hates cables. <span className="text-[#00ff88]">♥</span></p>
            </footer>
        </div>
    );
}

function Check({ className }) {
    return <span className={className}>✓</span>;
}