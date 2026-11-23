
import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/app/(marketing)/legal/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
    title: "Terms of service",
    description: `The terms for using ${LEGAL.brand}.`,
};

const sections: LegalSection[] = [
    {
        id: "about",
        title: "About these terms",
        content: (
            <p>
                These terms apply when you use our website or ask {LEGAL.brand}, a service of {LEGAL.company}, to help you with a service.
                By sending a request or paying a quotation, you agree to them. Please also read our <Link href="/privacy">Privacy policy</Link>{" "}
                and <Link href="/refunds">Refund policy</Link>.
            </p>
        ),
    },
    {
        id: "our-service",
        title: "What we do",
        content: (
            <>
                <p>
                    We are a private support service. We help you understand the requirements, prepare and check your documents, submit
                    applications where you authorize us and are allowed to, follow them up and keep you updated.
                </p>
                <p>
                    <strong>We are not a government institution.</strong> Decisions on applications, the documents required, processing times and
                    official fees are set by the institutions themselves. You can always use the official services directly without us.
                </p>
            </>
        ),
    },
    {
        id: "no-guarantee",
        title: "What we cannot promise",
        content: (
            <ul>
                <li>We cannot guarantee that an application will be approved, or by a specific date.</li>
                <li>We do not bypass any requirement, use unofficial shortcuts or obtain preferential treatment.</li>
                <li>Timelines we give are estimates based on experience, not commitments from the institutions.</li>
            </ul>
        ),
    },
    {
        id: "your-part",
        title: "Your responsibilities",
        content: (
            <ul>
                <li>Give us true, complete and up-to-date information and genuine documents.</li>
                <li>Only send information about other people (such as your children) when you are allowed to act for them.</li>
                <li>Sign any authorization or power of attorney needed for us to act for you.</li>
                <li>Reply to our questions in good time; delays on your side can delay your request.</li>
                <li>We may stop working on a request if documents appear to be false or the request is unlawful.</li>
            </ul>
        ),
    },
    {
        id: "fees",
        title: "Fees and payment",
        content: (
            <>
                <p>Before we start, we send you a quotation that shows:</p>
                <ul>
                    <li><strong>Our support fee</strong>, for our work on your request; and</li>
                    <li><strong>Official fees</strong>, charged by the institutions, where we pay them for you.</li>
                </ul>
                <p>
                    Prices are in the currency shown on the quotation (usually USD). You can pay online through IremboPay by card, bank or
                    Mobile Money; Mobile Money payments are charged in RWF at the rate shown when you pay. Work starts once the quotation is
                    paid, unless we agree otherwise. Your receipt is sent by email.
                </p>
            </>
        ),
    },
    {
        id: "cancellations",
        title: "Cancellations and refunds",
        content: (
            <p>
                You can cancel your request at any time. What we can refund depends on how far the work has gone and whether official fees
                were already paid. See our <Link href="/refunds">Refund policy</Link>.
            </p>
        ),
    },
    {
        id: "documents",
        title: "Your documents",
        content: (
            <p>
                You keep ownership of your documents. We use them only for your request and handle them as described in our{" "}
                <Link href="/privacy">Privacy policy</Link>. Original documents we receive or collect for you are returned or delivered as agreed
                in your request.
            </p>
        ),
    },
    {
        id: "liability",
        title: "Our responsibility",
        content: (
            <>
                <p>
                    We handle every request with care and skill. If something goes wrong because of our mistake, we will correct it at no extra
                    cost where possible.
                </p>
                <p>
                    We are not responsible for decisions, delays or errors by institutions, or for problems caused by wrong information or
                    documents you gave us. As far as the law allows, our total responsibility for a request is limited to the support fee you
                    paid for it.
                </p>
            </>
        ),
    },
    {
        id: "website",
        title: "Using the website",
        content: (
            <p>
                Do not misuse the website, try to access other people&apos;s requests, or upload harmful files. The content of the website is
                for general information; the requirements that apply to you are those confirmed for your request.
            </p>
        ),
    },
    {
        id: "law",
        title: "Applicable law and disputes",
        content: (
            <p>
                These terms are governed by the laws of the Republic of Rwanda. If you have a complaint, contact us first at{" "}
                <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> and we will do our best to resolve it. If we cannot agree, the competent
                courts of Kigali will decide.
            </p>
        ),
    },
    {
        id: "changes",
        title: "Changes to these terms",
        content: (
            <p>
                We may update these terms. The version in force when you paid your quotation applies to that request.
            </p>
        ),
    },
];

export default function TermsPage() {
    return (
        <LegalPage
            title="Terms of service"
            intro={<p>The rules for working together: what we do, what we cannot promise, and what we need from you.</p>}
            sections={sections}
        />
    );
}
