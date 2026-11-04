"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import HttpRequest from "@/lib/admin/httpRequest";
import LogoImg from "../../../public/logo.png";


const useBrand = () =>
  useQuery({
    queryKey: ["company-profile", "public"],
    queryFn: async () => (await HttpRequest.get("/company-profile")).data,
    staleTime: 30 * 60_000,
    retry: false,
  });


const GREETINGS = [
  { word: "Muraho", lang: "Kinyarwanda" },
  { word: "Hello", lang: "English" },
  { word: "Bonjour", lang: "Français" },
  { word: "Habari", lang: "Kiswahili" },
  { word: "Hallo", lang: "Deutsch · Nederlands" },
  { word: "Hola", lang: "Español" },
  { word: "Olá", lang: "Português" },
  { word: "Ciao", lang: "Italiano" },
];

const CITIES = [
  { city: "Kigali", tz: "Africa/Kigali" },
  { city: "Brussels", tz: "Europe/Brussels" },
  { city: "Paris", tz: "Europe/Paris" },
  { city: "London", tz: "Europe/London" },
  { city: "Toronto", tz: "America/Toronto" },
  { city: "New York", tz: "America/New_York" },
  { city: "Dallas", tz: "America/Chicago" },
  { city: "Nairobi", tz: "Africa/Nairobi" },
  { city: "Dubai", tz: "Asia/Dubai" },
];

const useRotatingIndex = (length: number, ms = 2600) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % length), ms);
    return () => clearInterval(t);
  }, [length, ms]);
  return i;
};


const useNow = () => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
};

const Greeting = ({ size = "lg" }: { size?: "lg" | "sm" }) => {
  const i = useRotatingIndex(GREETINGS.length);
  const g = GREETINGS[i];
  return (
    <div aria-live="polite" className="relative">
      <span key={g.word} className={`as-greet block font-semibold tracking-tight ${size === "lg" ? "text-6xl xl:text-7xl" : "text-3xl"}`}>
        <span className="bg-gradient-to-r from-title via-[#3B5BB5] to-[#2E9C86] bg-clip-text text-transparent">{g.word}</span>
        <span className="text-[#2E9C86]">.</span>
      </span>
      <span key={`${g.word}-lang`} className="as-lang mt-2 block text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
        {g.lang}
      </span>
    </div>
  );
};

// Logo with soft rings and a small "orbit" dot
const LogoOrbit = ({ logoUrl, size = 120 }: { logoUrl?: string | null; size?: number }) => (
  <div className="relative flex items-center justify-center" style={{ width: size * 1.9, height: size * 1.9 }}>
    <span className="as-pulse absolute inset-[18%] rounded-full border border-title/15" />
    <span className="as-pulse absolute inset-[18%] rounded-full border border-title/15 [animation-delay:1.6s]" />
    <span className="absolute inset-[6%] rounded-full border border-dashed border-title/15" />
    <span className="as-orbit absolute inset-[6%]">
      <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2E9C86] shadow-[0_0_14px_3px_rgba(46,156,134,0.45)]" />
    </span>
    <div className="as-logo relative flex items-center justify-center rounded-3xl border border-white bg-white p-4 shadow-xl shadow-navy-900/10" style={{ width: size, height: size }}>
      {logoUrl ? (
        <img src={logoUrl} alt="" className="h-full w-full object-contain" />
      ) : (
        <Image src={LogoImg} alt="" className="h-full w-full object-contain" priority />
      )}
    </div>
  </div>
);

const CityClocks = () => {
  const now = useNow();
  const time = (tz: string) => (now ? now.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }) : "--:--");
  const row = CITIES.map((c) => (
    <span key={c.city} className="flex shrink-0 items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1.5 text-xs text-ink/60 shadow-sm backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-[#2E9C86]" />
      {c.city}
      <span className="font-semibold tabular-nums text-title">{time(c.tz)}</span>
    </span>
  ));
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="as-marquee flex w-max gap-2">
        {row}
        {row}
      </div>
    </div>
  );
};

const AuthShell = ({ title, description, children }: { title: string; description?: React.ReactNode; children: React.ReactNode }) => {
  const { data: company } = useBrand();
  const name = company?.name || "Diaspora Support";

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#EEF1FA] text-ink">
      <style>{KEYFRAMES}</style>

      <span className="as-blob pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#D9E5FE] blur-3xl" />
      <span className="as-blob pointer-events-none absolute -right-32 top-1/4 h-[26rem] w-[26rem] rounded-full bg-[#E4DCF6] blur-3xl [animation-delay:-6s]" />
      <span className="as-blob pointer-events-none absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#DDF3EE] blur-3xl [animation-delay:-12s]" />
      <span className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#0f2a4a_1px,transparent_1px),linear-gradient(90deg,#0f2a4a_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />


      <header className="relative flex items-center gap-2 px-6 pt-6 text-sm font-medium text-ink/70 sm:px-10">
        <span className="h-2 w-2 rounded-full bg-[#2E9C86] shadow-[0_0_8px_2px_rgba(46,156,134,0.45)]" />
        {name}
      </header>


      <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:gap-14 lg:px-10">
        {/* Greeting */}
        <div className="as-rise flex flex-col items-center text-center lg:w-[26rem] lg:shrink-0 lg:items-start lg:text-left">
          <div className="hidden lg:block">
            <LogoOrbit logoUrl={company?.logoUrl} size={104} />
          </div>
          <div className="lg:hidden">
            <LogoOrbit logoUrl={company?.logoUrl} size={64} />
          </div>
          <div className="mt-2 lg:mt-8">
            <div className="hidden lg:block">
              <Greeting />
            </div>
            <div className="lg:hidden">
              <Greeting size="sm" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/80 lg:mt-6 lg:text-base">
              Good to see you again. Sign in to continue to your workspace.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="as-card w-full max-w-2xl shrink-0">
          <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-xl shadow-navy-900/10 backdrop-blur-xl sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-title sm:text-3xl">{title}</h1>
            {description && <p className="mt-1.5 text-sm text-ink/60">{description}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </section>
      <footer className="relative space-y-4 px-4 pb-6 sm:px-10">
        <div className="hidden sm:block">
          <CityClocks />
        </div>
        <p className="text-center text-xs text-ink/40">
          © {new Date().getFullYear()} {name}
        </p>
      </footer>
    </main>
  );
};


const KEYFRAMES = `
@keyframes as-greet { 0% { opacity: 0; transform: translateY(18px); filter: blur(8px) } 100% { opacity: 1; transform: none; filter: none } }
@keyframes as-lang  { 0% { opacity: 0; letter-spacing: .5em } 100% { opacity: 1 } }
@keyframes as-logo-in { 0% { opacity: 0; transform: scale(.6) rotate(-8deg); filter: blur(10px) } 60% { transform: scale(1.04) rotate(1deg) } 100% { opacity: 1; transform: none; filter: none } }
@keyframes as-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes as-orbit { to { transform: rotate(360deg) } }
@keyframes as-pulse { 0% { transform: scale(.85); opacity: .9 } 100% { transform: scale(1.6); opacity: 0 } }
@keyframes as-blob  { 0%,100% { transform: translate(0,0) scale(1) } 33% { transform: translate(40px,-30px) scale(1.1) } 66% { transform: translate(-30px,20px) scale(.95) } }
@keyframes as-marquee { to { transform: translateX(-50%) } }
@keyframes as-rise  { 0% { opacity: 0; transform: translateY(14px) } 100% { opacity: 1; transform: none } }

.as-greet   { animation: as-greet .7s cubic-bezier(.2,.8,.2,1) both }
.as-lang    { animation: as-lang .9s ease-out both }
.as-logo    { animation: as-logo-in 1s cubic-bezier(.2,.8,.2,1) both, as-float 6s ease-in-out 1s infinite }
.as-orbit   { animation: as-orbit 14s linear infinite }
.as-pulse   { animation: as-pulse 3.2s ease-out infinite }
.as-blob    { animation: as-blob 18s ease-in-out infinite }
.as-marquee { animation: as-marquee 40s linear infinite }
.as-marquee:hover { animation-play-state: paused }
.as-rise    { animation: as-rise .8s .2s cubic-bezier(.2,.8,.2,1) both }
.as-card    { animation: as-rise .7s .1s cubic-bezier(.2,.8,.2,1) both }

@media (prefers-reduced-motion: reduce) {
  .as-greet, .as-lang, .as-logo, .as-orbit, .as-pulse, .as-blob, .as-marquee, .as-rise, .as-card { animation: none !important }
}
`;
export default AuthShell;