import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function PresentPerfectContinuousPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Present Perfect Continuous" category="Present" />
        </Protected>
    );
}
