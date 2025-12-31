import React from "react";

export default function Footer() {
    return (
        <footer className="w-full py-4 bg-slate-950 border-t border-slate-900 flex items-center justify-center text-xs text-slate-500">
            <div className="flex gap-2 items-center">
                <span className="font-semibold text-slate-400">B2 English</span>
                <span className="opacity-40">•</span>
                <span>Learn. Practice. Level Up.</span>
                <span className="opacity-40">•</span>
                <span>© {new Date().getFullYear()}</span>
            </div>
        </footer>
    );
}
