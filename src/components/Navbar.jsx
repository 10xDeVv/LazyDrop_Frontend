"use client";

import {useState, useEffect, useRef, memo, useMemo} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu, X, ArrowRight, Zap, LayoutDashboard,
    User, LogOut, Link as LinkIcon, LogIn, XCircle, ChevronDown, Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useApp } from "@/context/InstantShareContext";

function NavbarComponent() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(null);

    const pathname = usePathname();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);

    const profileRef = useRef(null);
    const isActive = (href) => {
        if (href.startsWith("/#")) return pathname === "/";
        return pathname === href;
    };


    // Safe Context Usage
    // We only need leaveRoom. Using a selector pattern would be better performance-wise,
    // but React.memo on the component helps enough here.
    const appContext = useApp();
    const leaveRoom = appContext?.leaveRoom;
    const showToast = appContext?.showToast;

    // --- 1. DETERMINE MODE ---
    const isLanding = pathname === "/";
    const isSession = pathname?.startsWith("/session");
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

    // --- 2. AUTH & SCROLL LOGIC ---
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkAuth();

        const handleScroll = () => setIsScrolled(window.scrollY > 20);

        // Only attach scroll listener if NOT in session (session usually fixed height)
        if (!isSession) window.addEventListener("scroll", handleScroll);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            if (!isSession) window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
            subscription.unsubscribe();
        };
    }, [isSession]);

    // Close menus on route change
    useEffect(() => {
        setIsMobileOpen(false);
        setIsProfileOpen(false);
    }, [pathname]);

    // --- 3. ACTIONS ---
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            if (showToast) showToast("Invite link copied!");
            else alert("Link copied!");
        }
    };

    const handleLaunchApp = () => {
        router.push("/dashboard");
    };

    const handleExitSession = async () => {
        // if (isSession && leaveRoom) {
        //     await leaveRoom();
        // }
        router.push("/dashboard");
    };

    // --- 4. NAVIGATION CONFIG ---
    const logoLink = "/";

    const landingLinks = [
        { name: "How it works", href: "/#how-it-works" },
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/#pricing" },
    ];

    const appLinks = [
        { name: "Drop", href: "/drop" },
        { name: "Receive", href: "/receive" },
        { name: "Pricing", href: "/pricing" },
    ];

    const middleLinks = isSession ? [] : (isLanding ? landingLinks : appLinks);

    // --- SUB-COMPONENT: PROFILE DROPDOWN ---
    // Defined inside to access state/handlers, but structurally simple
    const renderProfileDropdown = () => (
        <div className="relative z-50" ref={profileRef}>
            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border transition-colors ${isSession ? "border-white/10 bg-[#16181D] hover:bg-white/5" : "border-white/10 hover:bg-white/5"}`}
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DFFF00] to-orange-400 flex items-center justify-center text-black font-bold text-xs uppercase">
                    {user?.email?.charAt(0) || "U"}
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-[#16181D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-[100]"
                    >
                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Signed in as</p>
                            <p className="text-sm text-white truncate font-medium">{user.email}</p>
                        </div>

                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                            <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Settings size={16} /> Account
                        </Link>

                        <div className="h-px bg-white/5 my-2" />

                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled || isMobileOpen || isSession
                        ? "bg-[#0E0F12]/90 backdrop-blur-xl border-b border-white/5 py-4"
                        : "bg-transparent py-6"
                }`}
            >
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                    {/* A. LOGO */}
                    <Link href={logoLink} className="flex items-center gap-2 group z-50 relative">
                        <div className="w-8 h-8 bg-[#DFFF00] rounded-lg flex items-center justify-center text-black font-bold text-xl group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(223,255,0,0.3)]">
                            <Zap size={18} fill="black" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-[#DFFF00] transition-colors">
                            LazyDrop
                        </span>
                    </Link>

                    {/* B. MIDDLE LINKS (Hidden in Session) */}
                    <div className="hidden md:flex items-center gap-8">
                        {middleLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors relative group ${isActive(link.href) ? "text-[#DFFF00]" : "text-gray-400 hover:text-white"}`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#DFFF00] transition-all ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"}`} />
                            </Link>
                        ))}
                    </div>

                    {/* C. RIGHT ACTIONS */}
                    <div className="hidden md:flex items-center gap-4">

                        {/* 1. SESSION MODE */}
                        {isSession ? (
                            <>
                                {user && renderProfileDropdown()}
                                <button
                                    onClick={handleCopyLink}
                                    className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-bold text-sm hover:bg-white/10 transition flex items-center gap-2"
                                >
                                    <LinkIcon size={16} /> Copy
                                </button>

                                <button
                                    onClick={handleExitSession}
                                    className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all flex items-center gap-2"
                                >
                                    <XCircle size={16} /> Exit
                                </button>
                            </>
                        ) : (
                            /* 2. APP / LANDING MODE */
                            <>
                                {isLanding ? (
                                    /* LANDING SPECIFIC */
                                    user ? (
                                        <button
                                            onClick={handleLaunchApp}
                                            className="px-5 py-2.5 bg-[#DFFF00] text-black rounded-full font-bold text-sm hover:bg-[#ccee00] shadow-lg transition-all flex items-center gap-2"
                                        >
                                            Launch App <ArrowRight size={16} />
                                        </button>
                                    ) : (
                                        <>
                                            <Link href="/login" className="text-sm font-bold text-white hover:text-[#DFFF00] transition-colors">
                                                Log In
                                            </Link>
                                            <Link href="/signup" className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-all flex items-center gap-2">
                                                Get Started
                                            </Link>
                                        </>
                                    )
                                ) : (
                                    /* APP SPECIFIC (Auth & Guest) */
                                    user ? (
                                        renderProfileDropdown()
                                    ) : (
                                        <>
                                            {!isAuthPage && (
                                                <Link href="/login" className="text-sm font-bold text-white hover:text-[#DFFF00] transition-colors">
                                                    Log In
                                                </Link>
                                            )}
                                            <Link href="/signup" className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-all flex items-center gap-2">
                                                Get Started
                                            </Link>
                                        </>
                                    )
                                )}
                            </>
                        )}
                    </div>

                    {/* D. MOBILE TOGGLE */}
                    <button
                        className="md:hidden text-white z-50 p-2"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* E. MOBILE MENU */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-[#0E0F12] pt-28 px-6 md:hidden flex flex-col h-screen"
                    >
                        <div className="flex flex-col gap-6">

                            {/* Session Links Mobile */}
                            {isSession ? (
                                <>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Session</div>
                                    <Link href="/dashboard" className="text-2xl font-bold text-white" onClick={() => setIsMobileOpen(false)}>
                                        Dashboard
                                    </Link>
                                    {user && (
                                        <Link href="/account" className="text-2xl font-bold text-white" onClick={() => setIsMobileOpen(false)}>
                                            Account
                                        </Link>
                                    )}
                                    <button onClick={handleExitSession} className="py-4 bg-red-500/20 text-red-300 rounded-xl font-bold text-center text-lg flex items-center justify-center gap-2">
                                        <XCircle size={18} /> Exit Session
                                    </button>
                                </>
                            ) : (
                                /* Standard Links Mobile */
                                <>
                                    {middleLinks.map((link) => (
                                        <Link key={link.name} href={link.href} className="text-3xl font-bold text-white" onClick={() => setIsMobileOpen(false)}>
                                            {link.name}
                                        </Link>
                                    ))}

                                    <div className="h-px bg-white/10 my-4" />

                                    {user ? (
                                        <>
                                            <Link href="/dashboard" className="text-xl font-medium text-gray-300 flex items-center gap-3" onClick={() => setIsMobileOpen(false)}>
                                                <LayoutDashboard size={20} /> Dashboard
                                            </Link>
                                            <Link href="/account" className="text-xl font-medium text-gray-300 flex items-center gap-3" onClick={() => setIsMobileOpen(false)}>
                                                <User size={20} /> Account
                                            </Link>
                                            <button onClick={handleLogout} className="text-xl font-medium text-red-400 flex items-center gap-3 mt-4">
                                                <LogOut size={20} /> Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className="text-xl font-bold text-white flex items-center gap-3"><LogIn size={20}/> Log In</Link>
                                            <Link href="/signup" className="py-4 bg-[#DFFF00] text-black rounded-xl font-bold text-center text-lg mt-4">
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Wrap in memo to prevent re-renders from context updates
export const Navbar = memo(NavbarComponent);
export default Navbar;