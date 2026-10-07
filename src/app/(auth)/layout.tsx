import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <header className="mx-auto w-full max-w-md px-6 pt-10">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image src="/logo.png" alt="" width={40} height={40} />
          <span className="text-lg font-semibold text-title">Diaspora Services</span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
        <div className="rounded-3xl border border-navy-300/50 bg-white p-7 sm:p-9">{children}</div>
        <p className="mt-6 text-center text-sm text-ink/60">
          Need help? <Link href="/contact" className="text-title underline underline-offset-2">Contact us</Link>
        </p>
      </main>
    </div>
  );
}