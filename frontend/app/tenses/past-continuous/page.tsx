import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function PastContinuousPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Past Continuous" category="Past" />
        </Protected>
    );
}
