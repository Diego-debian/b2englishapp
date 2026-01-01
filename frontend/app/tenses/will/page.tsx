import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function WillPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Will" category="Future" />
        </Protected>
    );
}
