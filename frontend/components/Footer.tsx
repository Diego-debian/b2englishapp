import React from "react";
import Link from "next/link";
import { isSupportEnabled } from "@/lib/featureFlags";

export default function Footer() {
    const showSupport = isSupportEnabled();

    return (
        <footer className="w-full py-4 bg-slate-950 border-t border-slate-900 flex items-center justify-center text-xs text-slate-500">
            <div className="flex gap-2 items-center flex-wrap justify-center">
                <span className="font-semibold text-slate-400">B2 English</span>
                <span className="opacity-40">•</span>
                <span>Learn. Practice. Level Up.</span>
                <span className="opacity-40">•</span>
                <span>© {new Date().getFullYear()}</span>
                {showSupport && (
                    <>
                        <span className="opacity-40">•</span>
                        <Link
                            href="/support"
                            className="text-pink-400 hover:text-pink-300 transition-colors font-medium"
                        >
                            💜 Support Us
                        </Link>
                    </>
                )}
            </div>
        </footer>
    );
}
