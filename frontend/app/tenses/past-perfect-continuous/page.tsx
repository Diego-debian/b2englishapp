import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function PastPerfectContinuousPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Past Perfect Continuous" category="Past" />
        </Protected>
    );
}
