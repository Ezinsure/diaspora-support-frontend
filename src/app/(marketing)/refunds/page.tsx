import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/app/(marketing)/legal/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
    title: "Refund policy",
    description: `When and how ${LEGAL.brand} refunds payments.`,
};

const sections: LegalSection[] = [
    {
        id: "summary",
        title: "In short",
        content: (
            <ul>
                <li><strong>Before we start working:</strong> full refund.</li>
                <li><strong>After we started:</strong> refund of the part of our fee for work not yet done.</li>
                <li><strong>Official fees already paid to an institution:</strong> not refundable by us.</li>
                <li><strong>Our mistake:</strong> we fix it for free, or refund our fee.</li>
            </ul>
        ),
    },
    {
        id: "support-fee",
        title: "Our support fee",
        content: (
            <ul>
                <li>
                    <strong>Cancelled before work starts</strong> (we have not reviewed your documents or contacted any institution): we refund
                    100% of the support fee.
                </li>
                <li>
                    <strong>Cancelled after work started:</strong> we refund the part of the fee for the work not yet done. We tell you the amount
                    and what was done before you confirm. {/* TODO: or set a fixed rule, e.g. 50% */}
                </li>
                <li>
                    <strong>Application already submitted:</strong> the support fee is not refundable, because the main work is done.
                </li>
            </ul>
        ),
    },
    {
        id: "official-fees",
        title: "Official fees",
        content: (
            <p>
                Fees paid to institutions are set and kept by them. Once we have paid an official fee for you, we cannot refund it, even if
                the application is refused. If we have not paid it yet when you cancel, we refund it in full.
            </p>
        ),
    },
    {
        id: "no-refund",
        title: "When no refund is due",
        content: (
            <ul>
                <li>The institution refuses or delays an application for reasons outside our control.</li>
                <li>The information or documents you gave us were wrong, incomplete or not genuine.</li>
                <li>You did not reply to our requests for more than [30 days] and we closed the request. {/* TODO: confirm */}</li>
            </ul>
        ),
    },
    {
        id: "our-mistake",
        title: "If we make a mistake",
        content: (
            <p>
                If a problem is caused by our error, we correct it at no extra cost. If it cannot be corrected, we refund our support fee for
                that request, and any official fee lost because of our error.
            </p>
        ),
    },
    {
        id: "how-to-ask",
        title: "How to ask for a refund",
        content: (
            <>
                <p>
                    Email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> within {LEGAL.refundDays} days of your payment, with your request number
                    (for example REQ-2026-0001) and the reason. You can find your request number on your receipt or on the{" "}
                    <Link href="/track">Track your request</Link> page.
                </p>
                <p>We reply within 3 business days and tell you the amount we will refund.</p>
            </>
        ),
    },
    {
        id: "how-paid",
        title: "How you get your money",
        content: (
            <p>
                Approved refunds are sent within {LEGAL.refundProcessingDays} business days, to the same method you paid with where possible
                (card, bank or Mobile Money). Mobile Money refunds are made in RWF. Transfer charges from banks or payment providers, and
                exchange rate differences, may apply and are outside our control.
            </p>
        ),
    },
];

export default function RefundsPage() {
    return (
        <LegalPage
            title="Refund policy"
            intro={<p>Clear rules on what we refund, when, and how to ask. This policy is part of our <Link href="/terms" className="font-medium text-title underline underline-offset-4">Terms of service</Link>.</p>}
            sections={sections}
        />
    );
}