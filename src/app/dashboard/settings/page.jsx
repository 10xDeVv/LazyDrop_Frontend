"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    User,
    Mail,
    Lock,
    CreditCard,
    Bell,
    Shield,
    Trash2,
    Crown,
    CheckCircle,
    Loader2,
    AlertCircle,
} from "lucide-react";

function SettingsNav() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    <Link href="/dashboard" className="flex items-center gap-2 text-[#999] hover:text-white transition">
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </Link>
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🦥</span>
                        <span className="text-lg font-semibold">LazyDrop</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function SettingSection({ icon: Icon, title, description, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
        >
            <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#00ff88] shrink-0">
                    <Icon size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-[#999]">{description}</p>
                </div>
            </div>
            {children}
        </motion.div>
    );
}

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            setUser(session.user);
            setName(session.user.user_metadata?.full_name || "");
            setEmail(session.user.email || "");

            // Load subscription
            const { data: subData } = await supabase
                .from("subscriptions")
                .select("*")
                .eq("user_id", session.user.id)
                .eq("status", "active")
                .single();

            setSubscription(subData);
            setLoading(false);
        };

        checkAuth();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name },
            });

            if (error) throw error;

            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!confirm("Are you sure you want to cancel your Plus subscription?")) {
            return;
        }

        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            // Call your backend to cancel Stripe subscription
            const response = await fetch("/api/cancel-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId: subscription.stripe_subscription_id }),
            });

            if (!response.ok) throw new Error("Failed to cancel subscription");

            setMessage({ type: "success", text: "Subscription cancelled successfully" });
            setSubscription(null);
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = prompt(
            'Are you sure you want to delete your account? This cannot be undone. Type "DELETE" to confirm.'
        );

        if (confirmed !== "DELETE") return;

        setSaving(true);

        try {
            // Call your backend to delete user data
            await fetch("/api/delete-account", {
                method: "POST",
            });

            await supabase.auth.signOut();
            router.push("/");
        } catch (error) {
            setMessage({ type: "error", text: error.message });
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-[#00ff88]" />
            </div>
        );
    }

    const isPremium = subscription?.plan === "plus";

    return (
        <div className="min-h-screen bg-black text-white">
            <SettingsNav />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <h1 className="text-4xl font-bold mb-2">Settings</h1>
                <p className="text-[#999] mb-12">Manage your account and preferences</p>

                {/* Message */}
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                            message.type === "success"
                                ? "bg-[#00ff88]/10 border border-[#00ff88]/50"
                                : "bg-red-500/10 border border-red-500/50"
                        }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle size={20} className="text-[#00ff88] shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                        )}
                        <p className={`text-sm ${message.type === "success" ? "text-[#00ff88]" : "text-red-400"}`}>
                            {message.text}
                        </p>
                    </motion.div>
                )}

                <div className="space-y-6">
                    {/* Profile */}
                    <SettingSection
                        icon={User}
                        title="Profile Information"
                        description="Update your personal details"
                    >
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#00ff88] focus:outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg opacity-50 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-[#666]">
                                    Email cannot be changed
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 bg-[#00ff88] text-black rounded-lg font-medium hover:bg-[#00dd77] transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </form>
                    </SettingSection>

                    {/* Subscription */}
                    <SettingSection
                        icon={isPremium ? Crown : CreditCard}
                        title="Subscription"
                        description={isPremium ? "You're on the Plus plan" : "Upgrade to unlock premium features"}
                    >
                        {isPremium ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/50">
                                    <div className="flex items-center gap-3">
                                        <Crown size={24} className="text-[#00ff88]" />
                                        <div>
                                            <div className="font-semibold">LazyDrop Plus</div>
                                            <div className="text-sm text-[#999]">$4.99/month</div>
                                        </div>
                                    </div>
                                    <div className="text-[#00ff88] font-semibold">Active</div>
                                </div>

                                <button
                                    onClick={handleCancelSubscription}
                                    disabled={saving}
                                    className="text-sm text-red-400 hover:text-red-300 transition disabled:opacity-50"
                                >
                                    Cancel subscription
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/#pricing"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black rounded-lg font-medium hover:bg-[#00dd77] transition"
                            >
                                <Crown size={20} />
                                Upgrade to Plus
                            </Link>
                        )}
                    </SettingSection>

                    {/* Danger Zone */}
                    <SettingSection
                        icon={Trash2}
                        title="Danger Zone"
                        description="Permanently delete your account and all data"
                    >
                        <button
                            onClick={handleDeleteAccount}
                            disabled={saving}
                            className="px-6 py-2.5 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Delete Account
                        </button>
                    </SettingSection>
                </div>
            </div>
        </div>
    );
}