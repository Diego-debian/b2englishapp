"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isFeatureEnabled, FEATURE_FLAGS } from "@/lib/featureFlags";
import { Spinner } from "@/components/Spinner";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isFeatureEnabled(FEATURE_FLAGS.ADMIN_CONTENT)) {
            // Option 1: Redirect to home or 404
            // router.replace("/404"); 
            // Option 2: Just do nothing and let the render return null (or "Disabled")
            // The instructions say: "return notFound() OR a small 'Disabled' page"
            // Since this is a client component layout, we can render a Disabled message.
        }
    }, [mounted, router]);

    if (!mounted) return null;

    if (!isFeatureEnabled(FEATURE_FLAGS.ADMIN_CONTENT)) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="text-4xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Admin Access Disabled
                    </h1>
                    <p className="text-slate-400">
                        The content administration area is currently disabled.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {children}
        </div>
    );
}
