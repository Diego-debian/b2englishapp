import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function PresentContinuousPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Present Continuous" category="Present" />
        </Protected>
    );
}
