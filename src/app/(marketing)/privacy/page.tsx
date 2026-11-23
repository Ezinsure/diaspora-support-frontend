import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/app/(marketing)/legal/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
    title: "Privacy policy",
    description: `How ${LEGAL.brand} collects, uses and protects your personal data.`,
};

const sections: LegalSection[] = [
    {
        id: "who-we-are",
        title: "Who we are",
        content: (
            <>
                <p>
                    {LEGAL.brand} is a service of {LEGAL.company} ({LEGAL.registration}), {LEGAL.address}. We are the data controller for the
                    personal data described here.
                </p>
                <p>
                    We process personal data in line with Law No. 058/2021 of 13/10/2021 relating to the protection of personal data and
                    privacy in Rwanda.
                </p>
            </>
        ),
    },
    {
        id: "what-we-collect",
        title: "What we collect",
        content: (
            <>
                <p>We only collect what we need to handle your request:</p>
                <ul>
                    <li><strong>Contact details:</strong> your name, email address, phone or WhatsApp number and country of residence.</li>
                    <li><strong>Request details:</strong> the service you need, the information the institution asks for (for example your address in Rwanda, date of birth or ID number) and your messages with our team.</li>
                    <li><strong>Documents:</strong> the files you upload or send us, such as copies of IDs, certificates or forms.</li>
                    <li><strong>Payment details:</strong> the amount paid, the payment method and the payment reference. Card and Mobile Money payments are processed by IremboPay; we never see or store your card number or PIN.</li>
                    <li><strong>Technical data:</strong> basic information your browser sends when you use the website (such as IP address and browser type), used for security.</li>
                </ul>
                <p>
                    If you send a request for someone else, such as your child or a family member, you confirm that you are allowed to share
                    their information with us for that purpose.
                </p>
            </>
        ),
    },
    {
        id: "how-we-use-it",
        title: "How we use your data",
        content: (
            <ul>
                <li>To review your request, prepare your quotation and handle the service you asked for.</li>
                <li>To submit applications and follow them up with the relevant institutions, where you have asked us to.</li>
                <li>To send you updates, receipts and messages about your request by email or WhatsApp.</li>
                <li>To take payments and keep accounting records required by law.</li>
                <li>To keep our website and systems secure and prevent fraud.</li>
            </ul>
        ),
    },
    {
        id: "legal-basis",
        title: "Why we are allowed to use it",
        content: (
            <ul>
                <li><strong>To provide the service you asked for</strong> (performing our agreement with you).</li>
                <li><strong>Your consent</strong>, which you give when you send a request. You can withdraw it at any time; this does not affect work already done.</li>
                <li><strong>Legal obligations</strong>, for example keeping tax and accounting records.</li>
                <li><strong>Legitimate interests</strong>, such as keeping our systems secure.</li>
            </ul>
        ),
    },
    {
        id: "sharing",
        title: "Who we share it with",
        content: (
            <>
                <p>We never sell your personal data. We only share it when needed for your request:</p>
                <ul>
                    <li><strong>Government institutions and public services</strong> handling your application.</li>
                    <li><strong>IremboPay</strong>, to process your payment.</li>
                    <li><strong>Service providers</strong> who help us run the service, such as our hosting and email providers, under confidentiality obligations.</li>
                    <li><strong>Authorities</strong>, when the law requires it.</li>
                </ul>
                <p>
                    If you contact us on WhatsApp, your messages are also handled by WhatsApp (Meta) under its own privacy policy. Please avoid
                    sending identity documents by WhatsApp; use the secure upload on our <Link href="/track">Track your request</Link> page instead.
                </p>
            </>
        ),
    },
    {
        id: "storage",
        title: "Where your data is stored",
        content: (
            <p>
                Your requests and documents are stored on servers located in Rwanda. Your documents are private: only our authorized team can
                open them, and they are never published.
            </p>
        ),
    },
    {
        id: "retention",
        title: "How long we keep it",
        content: (
            <ul>
                <li>Request details and documents: for as long as your request is open, then for [12 months] in case you need help with the same matter. {/* TODO: confirm */}</li>
                <li>Payment and accounting records: for the period required by Rwandan tax law.</li>
                <li>You can ask us to delete your documents earlier, once your request is completed.</li>
            </ul>
        ),
    },
    {
        id: "security",
        title: "How we protect it",
        content: (
            <p>
                We use encrypted connections (HTTPS), access controls so only authorized staff can see your files, private storage for
                documents and regular reviews of who has access. No system is perfectly secure, but if a breach affecting your data happens,
                we will inform you and the authorities as the law requires.
            </p>
        ),
    },
    {
        id: "your-rights",
        title: "Your rights",
        content: (
            <>
                <p>Under Rwandan law you have the right to:</p>
                <ul>
                    <li>be informed about how your data is used, and get a copy of it;</li>
                    <li>have wrong or incomplete data corrected;</li>
                    <li>have your data deleted when we no longer need it;</li>
                    <li>object to, or ask us to limit, how we use it;</li>
                    <li>withdraw your consent at any time.</li>
                </ul>
                <p>
                    To use these rights, email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> with your request number. We reply within 30
                    days. You can also complain to the National Cyber Security Authority (NCSA), which supervises personal data protection in
                    Rwanda.
                </p>
            </>
        ),
    },
    {
        id: "cookies",
        title: "Cookies and browser storage",
        content: (
            <p>
                We only use what the website needs to work: for example, to keep our team signed in, and to remember for 30 minutes that you
                verified your email on the Track page. We do not use advertising cookies. {/* TODO: update if you add analytics */}
            </p>
        ),
    },
    {
        id: "changes",
        title: "Changes to this policy",
        content: (
            <p>
                We may update this policy when our service or the law changes. The date at the top shows the latest version. If a change
                affects how we use your data in an important way, we will tell you before it applies to your request.
            </p>
        ),
    },
];

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy policy"
            intro={<p>Your documents are personal. This page explains, in plain words, what data we collect, why, who sees it and how you stay in control of it.</p>}
            sections={sections}
        />
    );
}