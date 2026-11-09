"use client";

import { FilePlus2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { canEdit, formatMoney, isPaid } from "./requestStatus";


const QuotationButton = ({
    request,
    onMake,
    onView,
    className,
}: {
    request: any;
    onMake?: (r: any) => void;
    onView?: (r: any) => void;
    className?: string;
}) => {
    const q = request.quotation;
    const editable = canEdit(request) && !isPaid(request) && !(Number(request.amountPaid ?? 0) > 0);

    if (q)
        return (
            <Button type="button" variant="outline" size="lg" className={cn("gap-1.5", className)} onClick={() => onView?.(request)}>
                <FileText className="h-4 w-4" />
                Quotation · {formatMoney(Number(q.total ?? 0), q.currency)}
            </Button>
        );

    if (!editable || !onMake) return null;

    return (
        <Button type="button" size="lg" className={cn("gap-1.5", className)} onClick={() => onMake(request)}>
            <FilePlus2 className="h-4 w-4" /> Make quotation
        </Button>
    );
};
export default QuotationButton;
