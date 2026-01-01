import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function PastPerfectPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Past Perfect" category="Past" />
        </Protected>
    );
}
