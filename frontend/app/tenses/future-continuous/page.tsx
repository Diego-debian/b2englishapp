import { Protected } from "@/components/Protected";
import { GrammarReferenceTensePage } from "@/components/GrammarReferenceTensePage";

export default function FutureContinuousPage() {
    return (
        <Protected>
            <GrammarReferenceTensePage title="Future Continuous" category="Future" />
        </Protected>
    );
}
