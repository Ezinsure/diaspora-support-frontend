import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, navLinks, services, SUPPORT, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const FooterPage = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-title text-white/80">
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-removebg.png"
                alt="Diaspora VIP Services Platform"
                width={200}
                height={80}
                className="h-24 w-auto object-contain"
                priority
              />
            </Link>
            <p className="mt-5 max-w-xs text-base leading-relaxed">
              Vip service for Rwandans abroad who want support with selected
              service processes.
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <p className="text-base font-semibold text-white">Services</p>
            <ul className="mt-4 space-y-2.5 text-base">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-white">{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <p className="text-base font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-2.5 text-base">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
              <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of service</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="text-base font-semibold text-white">Contact</p>
            <ul className="mt-4 space-y-3 text-base">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white">
                  <WhatsAppIcon className="h-4 w-4 shrink-0" /> {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2.5 hover:text-white">
                  <Mail className="h-4 w-4 shrink-0" /> {CONTACT.email}
                </a>
              </li>
              {CONTACT.phone && (
                <li>
                  <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 hover:text-white">
                    <Phone className="h-4 w-4 shrink-0" /> {CONTACT.phone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{CONTACT.address ?? CONTACT.city}</span>
              </li>
            </ul>
            {SUPPORT.hours && <p className="mt-4 text-base text-white/60">{SUPPORT.hours}</p>}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-14 rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-7">
          <p className="text-base font-semibold text-white">Please note</p>
          <p className="mt-2 text-base leading-relaxed text-white/75">
            This website is operated by a private service provider. Our services are optional and our fees cover professional assistance, guidance and
            follow-up. Customers may apply directly through the appropriate official channels
            without using our service. Standard service fees, where applicable, are separate from our assistance
            fees. Official decisions and processing times remain under the responsibility of the
            relevant institution.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/55 sm:flex-row sm:justify-between">
          <p>© {year} Diaspora Services. All rights reserved.</p>
          <p>
            Managed by{" "}
            <a
              href="https://solektra.rw"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium cursor-pointer transition-colors hover:underline"
            >
              SOLEKTRA
            </a>
            {" "}· Kigali, Rwanda
          </p>
        </div>
      </div>
    </footer>
  );
}
export default FooterPage;