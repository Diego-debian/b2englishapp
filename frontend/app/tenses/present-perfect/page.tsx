import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function PresentPerfectPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Present Perfect" category="Present" />
        </Protected>
    );
}
