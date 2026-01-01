import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function FuturePerfectPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Future Perfect" category="Future" />
        </Protected>
    );
}
