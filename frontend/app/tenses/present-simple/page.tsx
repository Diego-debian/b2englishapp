import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function PresentSimplePage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Present Simple" category="Present" />
        </Protected>
    );
}
