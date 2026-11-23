import Link from "next/link";
import Image from "next/image";
import { Mail,  Phone } from "lucide-react";
import { CONTACT, navLinks, services} from "@/lib/site";

const FooterPage = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-title text-white/80">
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex">
              <Image
                src="/logo-removebg.png"
                alt="Diaspora VIP Services Platform"
                width={200}
                height={80}
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/70">
              VIP support with official documents and essential services in Rwanda, so you don&apos;t have to handle the process alone.
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Services</p>
            <ul className="mt-5 space-y-3 text-base text-white/70">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company + contact */}
          <div>
            <nav aria-label="Company">
              <p className="text-sm font-semibold uppercase tracking-wider text-white">Company</p>
              <ul className="mt-5 space-y-3 text-base text-white/70">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-white/70">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 shrink-0" /> {CONTACT.email}
                </a>
              </li>
              {CONTACT.phone && (
                <li>
                  <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                    <Phone className="h-4 w-4 shrink-0" /> {CONTACT.phone}
                  </a>
                </li>
              )}
            </ul>
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

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 py-6 text-base text-white/55 sm:flex-row sm:justify-between">
          <p>© {year} Diaspora VIP Services. All rights reserved.</p>
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
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default FooterPage;