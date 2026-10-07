// src/components/admin/settings-ui.tsx — small building blocks for settings pages

import { cn } from "../../../lib/utils";


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
        {description && <p className="mt-1 max-w-2xl text-sm text-ink/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Label/description on the left, fields on the right (stacks on mobile) */
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
    <section className="grid gap-5 border-b border-navy-300/40 py-8 first:pt-0 last:border-0 last:pb-0 lg:grid-cols-[15rem_1fr] lg:gap-10">
      <div>
        <h3 className="font-sans text-base font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm leading-relaxed text-ink/60">{description}</p>}
      </div>
      <div className="min-w-0">{children}</div>
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
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
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

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-navy-300/60 px-6 py-12 text-center">
      <p className="font-medium text-title">{title}</p>
      {text && <p className="mt-1 text-sm text-ink/60">{text}</p>}
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