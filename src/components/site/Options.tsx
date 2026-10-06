import { CheckCheck, Headset, Laptop, Users } from "lucide-react";

const reasons = [
    "You don't have the time",
    "You're unsure about the process",
    "Professional assistance with document checking and follow-up,",
];

const Options = () => {
    return (
        <section className="bg-title py-10 text-white lg:py-14">
            <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <h2 className="text-3xl font-semibold tracking-[-0.01em] text-white! sm:text-[2.6rem]">
                        You have options
                    </h2>
                    <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
                        Most government services can be applied for directly through official channels.
                        Our service is completely optional.
                    </p>
                    <p className="mt-8 max-w-md border-l-2 border-clay-600 pl-4 text-sm leading-relaxed text-white/65">
                        Government fees, where applicable, are separate. Our fee covers only the private
                        assistance and support we provide.
                    </p>
                </div>

                <ul className="divide-y divide-white/15">
                    <Choice
                        icon={Laptop}
                        title="Do it yourself"
                        text="Apply directly through the official government channels at no additional cost , (you only pay the standard government fees, where applicable)."
                    />
                    <Choice
                        icon={Users}
                        title="Ask family or friends"
                        text="Someone close to you, in Rwanda or abroad, may be able to help you through the process."
                    />
                    <Choice
                        icon={Headset}
                        title="Let us help you"
                        text="Professional support, document checking and follow-up. A good fit if:"
                    >
                        <ul className="mt-4 space-y-2.5">
                            {reasons.map((reason) => (
                                <li key={reason} className="flex items-start gap-3">
                                    <CheckCheck className="h-3 w-3 mt-1.5" strokeWidth={3} />
                                    <span className="leading-relaxed text-white">{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </Choice>
                </ul>
            </div>
        </section>
    );
};

function Choice({
    icon: Icon,
    title,
    text,
    children,
}: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string;
    text: string;
    children?: React.ReactNode;
}) {
    return (
        <li className="grid grid-cols-[auto_1fr] gap-5 py-8 sm:gap-7">
            <Icon className="mt-1 h-14 w-14 text-white/90" strokeWidth={1.6} />
            <div>
                <h3 className="font-sans text-xl font-semibold text-white!">{title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-white/70">{text}</p>
                {children}
            </div>
        </li>
    );
}
export default Options;