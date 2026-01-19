import Link from "next/link";
import { fetchContentList } from "@/lib/contentClient";
import { isGlobalContentV1Enabled } from "@/lib/featureFlags";

export default async function LatestContentBlock() {
    if (!isGlobalContentV1Enabled()) {
        return null;
    }

    const allContent = await fetchContentList();
    // Take top 3
    const latestContent = allContent.slice(0, 3);

    if (latestContent.length === 0) {
        return null;
    }

    return (
        <section className="flex items-center justify-center px-4 py-20 bg-slate-50/50">
            <div className="max-w-5xl w-full mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Latest from the Magazine
                        </h2>
                        <p className="text-slate-600 mt-2">
                            Tips, guides, and updates for your learning journey.
                        </p>
                    </div>
                    <Link
                        href="/content/feed"
                        className="hidden sm:inline-flex items-center font-medium text-violet-600 hover:text-violet-700 transition-colors"
                    >
                        View all
                        <span aria-hidden="true" className="ml-1">→</span>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {latestContent.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/content/${item.slug}`}
                            className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-violet-700 transition-colors line-clamp-2 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                {item.publishedAt}
                            </p>
                            <p className="text-slate-600 line-clamp-3 mb-4 flex-grow">
                                {item.excerpt}
                            </p>
                            <div className="flex items-center text-sm font-medium text-violet-600 group-hover:text-violet-700">
                                Read article
                                <span aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href="/content/feed"
                        className="inline-flex items-center font-medium text-violet-600 hover:text-violet-700 transition-colors"
                    >
                        View all
                        <span aria-hidden="true" className="ml-1">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
