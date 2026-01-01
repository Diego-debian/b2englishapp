import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function GoingToPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Going to" category="Future" />
        </Protected>
    );
}
