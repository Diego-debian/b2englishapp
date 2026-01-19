"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isFeatureEnabled, FEATURE_FLAGS } from "@/lib/featureFlags";
import { Button } from "@/components/Button";

export default function SupportPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Feature flag guard
    useEffect(() => {
        if (!mounted) return;
        if (!isFeatureEnabled(FEATURE_FLAGS.SUPPORT)) {
            router.replace("/");
        }
    }, [mounted, router]);

    // Prevent hydration mismatch
    if (!mounted) return null;

    // Feature flag check
    if (!isFeatureEnabled(FEATURE_FLAGS.SUPPORT)) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-2xl shadow-violet-500/30">
                        <span className="text-4xl">💜</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text mb-4">
                        Support B2 English
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        B2 English is a free, open-source project. Your support helps us keep improving and adding new features for English learners worldwide.
                    </p>
                </div>

                {/* Support Options */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {/* One-time Donation */}
                    <div className="glass-strong rounded-2xl p-8 border border-white/10 hover:border-violet-500/30 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">☕</span>
                            <h2 className="text-xl font-bold text-white">Buy us a coffee</h2>
                        </div>
                        <p className="text-slate-400 mb-6">
                            A one-time donation to show your appreciation. Every contribution helps!
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="secondary"
                                className="px-4"
                                onClick={() => alert("PayPal integration coming soon!")}
                            >
                                $5
                            </Button>
                            <Button
                                variant="secondary"
                                className="px-4"
                                onClick={() => alert("PayPal integration coming soon!")}
                            >
                                $10
                            </Button>
                            <Button
                                variant="secondary"
                                className="px-4"
                                onClick={() => alert("PayPal integration coming soon!")}
                            >
                                $25
                            </Button>
                            <Button
                                variant="primary"
                                className="px-4"
                                onClick={() => alert("PayPal integration coming soon!")}
                            >
                                Custom
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            💳 PayPal integration coming soon
                        </p>
                    </div>

                    {/* Monthly Support */}
                    <div className="relative glass-strong rounded-2xl p-8 border border-violet-500/30 hover:border-violet-500/50 transition-all duration-300">
                        <div className="absolute -top-3 right-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            COMING SOON
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">⭐</span>
                            <h2 className="text-xl font-bold text-white">Monthly Supporter</h2>
                        </div>
                        <p className="text-slate-400 mb-6">
                            Become a recurring supporter and get early access to new features and content.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-300 mb-6">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span>
                                Early access to new features
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span>
                                Supporter badge on profile
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span>
                                Priority support
                            </li>
                        </ul>
                        <Button
                            variant="ghost"
                            className="w-full opacity-50 cursor-not-allowed"
                            disabled
                        >
                            Coming Soon
                        </Button>
                    </div>
                </div>

                {/* How Donations Help */}
                <div className="glass-strong rounded-2xl p-8 border border-white/10 mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        How Your Support Helps
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-4xl mb-3">🚀</div>
                            <h3 className="font-bold text-white mb-2">New Features</h3>
                            <p className="text-sm text-slate-400">
                                Fund development of new learning modes and content
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">🌍</div>
                            <h3 className="font-bold text-white mb-2">Free for All</h3>
                            <p className="text-sm text-slate-400">
                                Keep the platform free and accessible worldwide
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">🛠️</div>
                            <h3 className="font-bold text-white mb-2">Infrastructure</h3>
                            <p className="text-sm text-slate-400">
                                Cover hosting, domains, and maintenance costs
                            </p>
                        </div>
                    </div>
                </div>

                {/* Other Ways to Help */}
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-4">
                        Other Ways to Help
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="https://github.com/b2english"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                            ⭐ Star on GitHub
                        </Link>
                        <Link
                            href="https://twitter.com/intent/tweet?text=Check%20out%20B2%20English%20-%20a%20free%20English%20learning%20platform!"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                            📢 Share on Twitter
                        </Link>
                    </div>
                    <p className="text-sm text-slate-500 mt-6">
                        Thank you for being part of the B2 English community! 💜
                    </p>
                </div>
            </div>
        </main>
    );
}
