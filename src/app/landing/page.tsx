import Image from "next/image";
import { ChevronDown, Info } from "lucide-react";
import { buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/src/components/icons/WhatsAppIcon";
import { WHATSAPP_URL } from "@/src/lib/site";
import HomeImage from '@/src/assets/images/bgimage.png'

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
                        <h1 className="text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[3.4rem] lg:text-[3.9rem]">
                            Government Services Made Easier  for <br /> the Diaspora
                        </h1>

                        <div aria-hidden className="mt-2 h-[3px] w-14 rounded-full bg-clay-600" />

                        <p className="max-w-lg  mt-7 text-lg leading-snug text-ink/80">
                            Professional support for your passport, birth certificate, national ID and notification services needs.
                        </p>
                        <p className="mt-3 text-lg leading-snug text-ink">
                            You can do it yourself, or let us help you.
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
                                <ChevronDown className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}
export default LandingPage


{/* Photo */ }
{/* <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-navy-300/30 sm:aspect-[5/4] lg:aspect-[4/5]">
        
            <Image
              src="/images/hero.jpg"
              alt="Woman smiling while reading a message on her phone"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 28rem, 100vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-7 left-4 max-w-[17.5rem] rounded-2xl border border-navy-300/50 bg-white p-4 shadow-[0_16px_40px_-16px_rgba(11,42,99,0.3)] sm:left-8">
            <p className="font-medium text-title">A real person replies</p>
            <p className="mt-1 text-sm leading-snug text-ink/70">
              Message us on WhatsApp and someone from our team will guide you.
            </p>
          </div>
        </div> */}