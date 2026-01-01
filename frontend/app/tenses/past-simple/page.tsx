import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function PastSimplePage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Past Simple" category="Past" />
        </Protected>
    );
}
