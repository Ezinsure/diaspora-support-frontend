import { cn } from "../../../lib/utils";
import { Search } from "lucide-react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-sans text-xl font-semibold">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-base text-ink/70">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 border-b border-navy-300/40 py-8 first:pt-0 last:border-0 last:pb-0 lg:grid-cols-[15rem_1fr] lg:gap-30">
      <div>
        <h3 className="font-sans text-lg font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm leading-relaxed text-ink/60">{description}</p>}
      </div>
      <div className="min-w-0 ">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={htmlFor} className="text-base font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink/50">{hint}</p>}
    </div>
  );
}

export function Tag({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-title ring-1 ring-inset ring-navy-300/50">
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${children}`}
          className="-mr-1 rounded-full px-1 text-title/60 hover:text-title"
        >
          ×
        </button>
      )}
    </span>
  );
}

export function EmptyState({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  return (
    <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-navy-50/50 to-white px-6 py-12 text-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-navy-100/40 blur-3xl" />
      <div className="relative mb-5 flex size-16 items-center justify-center rounded-2xl border-[.5px] border-navy-200/60 bg-white">
        <Search className="size-8 text-title" strokeWidth={1.7} />
      </div>
      <div className="relative max-w-sm space-y-2">
        <h3 className="text-base font-semibold tracking-tight text-title sm:text-lg">
          {title}
        </h3>
        {text && (
          <p className="text-sm leading-6 text-ink/60">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

export const selectClass =
  "h-9 w-full rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

/** Same output on server and browser (fixed locale and time zone) */
export function formatDate(iso: string | null, withTime = false) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "Africa/Kigali",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}