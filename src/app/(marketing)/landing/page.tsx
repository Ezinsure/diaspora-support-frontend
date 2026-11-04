import Image from "next/image";
import { ChevronRight, } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_URL } from "@/lib/site";
import HomeImage from '@/assets/images/bgimage.png'
import { cn } from "../../../../lib/utils";

const LandingPage = () => {
    return (
        <section className="overflow-hidden">
            <section className="relative isolate overflow-hidden">
                <Image
                    src={HomeImage}
                    alt=""
                    fill
                    priority
                    placeholder="blur"
                    sizes="100vw"
                    className="-z-20 object-cover object-[70%_center]"
                />
                <div className="mx-auto flex min-h-[620px] max-w-7xl items-center px-5 pb-20 pt-12 sm:px-8 lg:min-h-[680px] lg:pb-14 lg:pt-36 ">
                    <div className=" relative max-w-2xl">
                        <div
                            aria-hidden
                            className="absolute -inset-x-10 -inset-y-12 -z-10 rounded-[3rem] bg-white/80 blur-2xl"
                        />
                        <div className="max-w-xl">
                            <h1 className="text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[3.4rem] lg:text-[3.9rem] text-balance">
                                Essential Services Made Easier for the Diaspora
                            </h1>
                        </div>

                        <div aria-hidden className="mt-2 h-[3px] w-14 rounded-full bg-clay-600" />

                        <p className="max-w-xl  mt-7 text-lg leading-snug text-ink/80">
                            Get professional support with official document applications and
                            essential services back home, with VIP assistance tailored to your needs.
                        </p>
                        <p className="mt-3 text-base leading-snug text-ink">
                            Enjoy personalized VIP assistance, hands-on application support, and
                            regular updates throughout the process.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    buttonVariants({ size: "lg" }),
                                    "h-12 gap-2.5 rounded-lg bg-green-700 px-7 text-base text-white hover:bg-green-800",
                                )}
                            >
                                <WhatsAppIcon className="h-5 w-5" />
                                Chat on WhatsApp 24/7
                            </a>
                            <a
                                href="#services"
                                className={cn(
                                    buttonVariants({ variant: "outline", size: "lg" }),
                                    "h-12 gap-2 rounded-full border-title/30 bg-white/70 px-7 text-base text-title hover:border-title hover:bg-white hover:text-title",
                                )}
                            >
                                View our services
                                <ChevronRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}
export default LandingPage