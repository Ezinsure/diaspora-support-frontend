import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, navLinks, services, SUPPORT, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/src/lib/site";
import { WhatsAppIcon } from "@/src/components/icons/WhatsAppIcon";

const FooterPage = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-title text-white/80">
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <p className="text-lg font-semibold text-white">Diaspora Services</p>
            <p className="mt-1 text-sm text-white/60">Support. Guide. Get It Done.</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Optional, professional help for Rwandans abroad who want support with selected
              government-service processes.
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <p className="text-sm font-semibold text-white">Services</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-white">{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm">
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
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
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
            {SUPPORT.hours && <p className="mt-4 text-sm text-white/60">{SUPPORT.hours}</p>}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-14 rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-7">
          <p className="text-sm font-semibold text-white">Please note</p>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            This website is operated by a private service provider and is not a Government of Rwanda
            website. Our services are optional and our fees cover professional assistance, guidance and
            follow-up. Customers may apply directly through the appropriate official government channels
            without using our service. Government fees, where applicable, are separate from our assistance
            fees. Government decisions and processing times remain under the responsibility of the
            relevant institution.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/55 sm:flex-row sm:justify-between">
          <p>© {year} Diaspora Services. All rights reserved.</p>
          <p>Independent private company · Kigali, Rwanda</p>
        </div>
      </div>
    </footer>
  );
}
export default FooterPage;