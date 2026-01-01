import { Protected } from "@/components/Protected";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function PresentSimplePage() {
    return (
        <Protected>
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-10">
                {/* Header */}
                <div className="space-y-6">
                    <Link href="/tenses">
                        <Button variant="ghost" className="text-slate-400 hover:text-slate-600 gap-2 mb-4">
                            ← Back to Grammar Reference
                        </Button>
                    </Link>

                    <div className="space-y-2">
                        <span className="inline-flex px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase">
                            Present Time
                        </span>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Present Simple
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Grammar Reference
                        </p>
                    </div>
                </div>

                {/* 1. Quick use */}
                <Card className="bg-white border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick use</h2>
                    <ul className="space-y-3 text-slate-700">
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Habits and routines</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>General truths and facts</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Permanent situations</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Timetables and schedules</span>
                        </li>
                    </ul>
                </Card>

                {/* 2. Form */}
                <Card className="bg-white border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Form</h2>

                    <div className="space-y-6">
                        {/* Affirmative */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Affirmative</h3>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="font-mono text-sm text-slate-600 mb-3">
                                    Subject + verb (+ s/es for he/she/it)
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li>I work from home.</li>
                                    <li>She drinks coffee every morning.</li>
                                    <li>They live in the city.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Negative */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Negative</h3>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="font-mono text-sm text-slate-600 mb-3">
                                    Subject + don&apos;t/doesn&apos;t + verb
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li>I don&apos;t eat meat.</li>
                                    <li>He doesn&apos;t watch TV.</li>
                                    <li>We don&apos;t study on weekends.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Question</h3>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="font-mono text-sm text-slate-600 mb-3">
                                    Do/Does + subject + verb?
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li>Do you like pizza?</li>
                                    <li>Does she play tennis?</li>
                                    <li>Do they work here?</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 3. Common markers */}
                <Card className="bg-white border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Common markers</h2>

                    <div className="space-y-6">
                        {/* Adverbs */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Adverbs of frequency</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">always</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">usually</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">often</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">sometimes</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">never</span>
                            </div>
                        </div>

                        {/* Time expressions */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Time expressions</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">every day</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">on Mondays</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">at weekends</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">once a week</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 4. Common mistakes */}
                <Card className="bg-white border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Common mistakes</h2>

                    <div className="space-y-4">
                        {/* Mistake 1 */}
                        <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 font-bold text-lg">✗</span>
                                <div className="flex-1 space-y-2">
                                    <p className="text-slate-700"><span className="line-through">He go</span> to school every day.</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">He goes to school every day.</p>
                                            <p className="text-sm text-slate-600">Add -es for he/she/it</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mistake 2 */}
                        <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 font-bold text-lg">✗</span>
                                <div className="flex-1 space-y-2">
                                    <p className="text-slate-700">She <span className="line-through">don&apos;t</span> like coffee.</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">She doesn&apos;t like coffee.</p>
                                            <p className="text-sm text-slate-600">Use doesn&apos;t with he/she/it</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mistake 3 */}
                        <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 font-bold text-lg">✗</span>
                                <div className="flex-1 space-y-2">
                                    <p className="text-slate-700"><span className="line-through">Does they work</span> here?</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">Do they work here?</p>
                                            <p className="text-sm text-slate-600">Use do with I/you/we/they</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mistake 4 */}
                        <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 font-bold text-lg">✗</span>
                                <div className="flex-1 space-y-2">
                                    <p className="text-slate-700">I <span className="line-through">no understand</span>.</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">I don&apos;t understand.</p>
                                            <p className="text-sm text-slate-600">Use don&apos;t/doesn&apos;t for negatives, not &quot;no&quot;</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 5. Mini practice */}
                <Card className="bg-slate-50/60 border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Mini practice</h2>
                    <p className="text-sm text-slate-600 mb-6">Try these quick exercises. Click to see answers.</p>

                    <div className="space-y-4">
                        {/* MCQ 1 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">1. She ___ tennis every Saturday.</p>
                            <div className="space-y-2 mb-3">
                                <div className="text-slate-700">a) play</div>
                                <div className="text-slate-700">b) plays</div>
                                <div className="text-slate-700">c) playing</div>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: b) plays</p>
                                    <p className="text-slate-600 mt-1">Use &quot;plays&quot; (verb + s) with she/he/it.</p>
                                </div>
                            </details>
                        </div>

                        {/* MCQ 2 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">2. ___ you like chocolate?</p>
                            <div className="space-y-2 mb-3">
                                <div className="text-slate-700">a) Does</div>
                                <div className="text-slate-700">b) Do</div>
                                <div className="text-slate-700">c) Are</div>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: b) Do</p>
                                    <p className="text-slate-600 mt-1">Use &quot;Do&quot; with you/we/they in questions.</p>
                                </div>
                            </details>
                        </div>

                        {/* MCQ 3 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">3. They ___ watch TV in the morning.</p>
                            <div className="space-y-2 mb-3">
                                <div className="text-slate-700">a) doesn&apos;t</div>
                                <div className="text-slate-700">b) don&apos;t</div>
                                <div className="text-slate-700">c) aren&apos;t</div>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: b) don&apos;t</p>
                                    <p className="text-slate-600 mt-1">Use &quot;don&apos;t&quot; with they/we/you for negatives.</p>
                                </div>
                            </details>
                        </div>

                        {/* Input 1 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">4. Complete: My brother ___ (work) in a bank.</p>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: works</p>
                                    <p className="text-slate-600 mt-1">He/she/it takes -s ending.</p>
                                </div>
                            </details>
                        </div>

                        {/* Input 2 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">5. Complete: We ___ (not/have) a car.</p>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: don&apos;t have</p>
                                    <p className="text-slate-600 mt-1">Use &quot;don&apos;t&quot; + base verb for we/you/they negatives.</p>
                                </div>
                            </details>
                        </div>
                    </div>
                </Card>

                {/* 6. Link to apply */}
                <Card className="bg-white border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="space-y-1">
                            <p className="text-slate-900 font-bold">
                                Apply this in practice
                            </p>
                            <p className="text-slate-500 text-sm">
                                Test your understanding with interactive exercises.
                            </p>
                        </div>
                        <Link href="/practice">
                            <Button className="bg-violet-600 hover:bg-violet-700">
                                Go to Practice →
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </Protected>
    );
}
