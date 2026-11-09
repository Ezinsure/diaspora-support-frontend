"use client";

import { useState } from "react";
import { Activity, ArrowUpDown, Eye, Filter, Loader2, UserPlus, Users, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialsOf } from "@/components/admin/customer/customerStats";
import { formatMoney } from "@/components/admin/requests/requestStatus";
import FormModal from "@/components/admin/modal/EditModal";
import CustomerRequestsModal from "@/components/admin/modal/customerReqModal";
import RequestForm from "@/components/admin/forms/requestForm";
import SearchInput from "@/components/shared/SearchInput";
import FilterSelect from "@/components/shared/FilterSelect";
import Pagination from "@/components/shared/Pagination";
import { useCustomer, useCustomers, useCustomerStats, useDebouncedValue, type CustomerRow } from "@/hooks/useCustomer";
import { useCreateRequest } from "@/hooks/useAdminRequest";
import { cn } from "../../../../lib/utils";

const ACTIVITY_FILTERS = [
  { value: "all", label: "All customers" },
  { value: "open", label: "With open requests", dot: "bg-blue-500" },
  { value: "to_pay", label: "Waiting for payment", dot: "bg-amber-500" },
  { value: "none", label: "No requests yet", dot: "bg-gray-300" },
];

const SORTS = [
  { value: "recent", label: "Last request (newest)" },
  { value: "most", label: "Most requests" },
  { value: "name", label: "Name (A–Z)" },
];

const shortDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali", day: "numeric", month: "short", year: "numeric" }) : "—";

const CustomersPage = () => {
  const [search, setSearch] = useState("");
  const [activity, setActivity] = useState("all");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [newFor, setNewFor] = useState<CustomerRow | null>(null);

  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isFetching, isError } = useCustomers({ search: debouncedSearch, activity, sort, page, limit });
  const { data: stats } = useCustomerStats();
  const { data: viewing, isLoading: loadingViewing } = useCustomer(viewingId);
  const createRequest = useCreateRequest();

  const customers = data?.customers ?? [];
  const hasFilters = !!search || activity !== "all";

  // Any filter change goes back to page 1
  const withReset =
    <T,>(setter: (v: T) => void) =>
      (v: T) => {
        setter(v);
        setPage(1);
      };

  const statCards = [
    { label: "Customers", value: stats?.total ?? 0, hint: "Everyone who made a request", icon: Users, box: "bg-primary/10 text-primary" },
    { label: "Active", value: stats?.active ?? 0, hint: "With at least one open request", icon: Activity, box: "bg-blue-100 text-blue-700" },
    { label: "New this month", value: stats?.newThisMonth ?? 0, hint: "First request this month", icon: UserPlus, box: "bg-violet-100 text-violet-700" },
    { label: "Total paid", value: formatMoney(stats?.totalPaid ?? 0), hint: "All payments recorded", icon: Wallet, box: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <div className="min-h-[83vh] space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Customers</h1>
        <p className="text-muted-foreground">People who sent requests, and how their requests are going.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 px-6" title={s.hint}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-lg font-medium text-ink/80">{s.label}</span>
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", s.box)}>
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 truncate text-2xl font-semibold tabular-nums text-title">
              {stats ? (typeof s.value === "number" ? s.value.toLocaleString() : s.value) : <span className="inline-block h-7 w-16 animate-pulse rounded bg-gray-100" />}
            </p>
            <p className="mt-0.5 truncate text-sm text-gray-500">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 md:flex-row md:items-center">
        <SearchInput
          value={search}
          onChange={withReset(setSearch)}
          placeholder="Search name, email, WhatsApp or request reference…"
          label="Search customers"
          loading={isFetching && !isLoading}
        />
        <FilterSelect label="Show" icon={Filter} value={activity} onChange={withReset(setActivity)} options={ACTIVITY_FILTERS} className="md:w-60" />
        <FilterSelect label="Sort" icon={ArrowUpDown} value={sort} onChange={withReset(setSort)} options={SORTS} className="md:w-56" />
        {hasFilters && (
          <Button
            variant="ghost"
            className="gap-1 text-gray-600"
            onClick={() => {
              setSearch("");
              setActivity("all");
              setPage(1);
            }}
          >
            <X className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      {isError ? (
        <EmptyBox title="Couldn't load customers" text="Check your connection and refresh the page." />
      ) : isLoading ? (
        <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-50" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <EmptyBox title={hasFilters ? "No customers found" : "No customers yet"} text={hasFilters ? "Try another search or filter." : "Customers appear here when a request is created."} />
      ) : (
        <>
          <section className={cn("overflow-hidden rounded-2xl border border-gray-200 bg-white min-h-[43vh] transition-opacity", isFetching && "opacity-70")}>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">WhatsApp Number</th>
                    <th className="px-4 py-3 font-medium">Requests</th>
                    <th className="px-4 py-3 text-right font-medium">Paid</th>
                    <th className="px-4 py-3 font-medium text-right">Last request</th>
                    <th className="px-6 py-3 text-right font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <Person customer={c} />
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <WhatsAppLink phone={c.whatsapp} />
                      </td>
                      <td className="px-4 py-3">
                        <RequestMix customer={c} />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className="font-medium text-gray-900">{formatMoney(c.paid)}</span>
                        {c.unpaid > 0 && <p className="text-sm text-amber-700">{formatMoney(c.unpaid)} to pay</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900 text-right">{shortDate(c.lastRequestAt)}</p>
                        {c.country && <p className="truncate text-sm text-gray-500 text-right">{c.country}</p>}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setViewingId(c.id)}>
                          <Eye className="h-4 w-4" /> View requests
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-gray-100 md:hidden">
              {customers.map((c) => (
                <li key={c.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Person customer={c} />
                    <span className="text-xs text-gray-500">{shortDate(c.lastRequestAt)}</span>
                  </div>
                  <RequestMix customer={c} />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Paid</span>
                    <span className="font-medium tabular-nums text-gray-900">
                      {formatMoney(c.paid)}
                      {c.unpaid > 0 && <span className="ml-2 text-xs text-amber-700">+{formatMoney(c.unpaid)} to pay</span>}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full gap-1.5" onClick={() => setViewingId(c.id)}>
                    <Eye className="h-4 w-4" /> View requests ({c.total})
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            total={data?.total ?? 0}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            pageSizes={[10, 25, 50, 100, 500]}
            isFetching={isFetching}
            itemName="customers"
          />
        </>
      )}

      <FormModal open={!!viewingId} onOpenChange={(o: boolean) => !o && setViewingId(null)} size="xl">
        {viewingId &&
          (loadingViewing || !viewing ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading requests…
            </div>
          ) : (
            <CustomerRequestsModal
              key={viewing.id}
              customer={viewing}
              onNewRequest={(c: any) => {
                setViewingId(null);
                setNewFor(c);
              }}
            />
          ))}
      </FormModal>

      {/* New request for this customer: details pre-filled */}
      <FormModal open={!!newFor} onOpenChange={(o: boolean) => !o && !createRequest.isPending && setNewFor(null)}>
        {newFor && (
          <RequestForm
            key={newFor.id}
            prefill={{
              firstName: newFor.firstName,
              lastName: newFor.lastName,
              email: newFor.email,
              whatsapp: newFor.phone,
              location: newFor.country ?? "",
            }}
            onSubmit={(values) => createRequest.mutate(values, { onSuccess: () => setNewFor(null) })}
            onCancel={() => setNewFor(null)}
            isLoading={createRequest.isPending}
          />
        )}
      </FormModal>
    </div>
  );
};

const EmptyBox = ({ title, text }: { title: string; text: string }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
    <Users className="h-10 w-10 text-gray-300" />
    <p className="mt-3 font-medium text-gray-700">{title}</p>
    <p className="text-sm text-gray-500">{text}</p>
  </div>
);

const WhatsAppLink = ({ phone }: { phone: string }) =>
  phone ? (
    <a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-gray-900">
      {phone}
    </a>
  ) : (
    <span>—</span>
  );

const Person = ({ customer }: { customer: CustomerRow }) => (
  <span className="flex min-w-0 items-center gap-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{initialsOf(customer)}</span>
    <span className="min-w-0">
      <span className="block truncate font-medium text-base text-gray-900">{customer.name}</span>
      <span className="block truncate text-sm text-gray-500">{customer.email}</span>
    </span>
  </span>
);

const RequestMix = ({ customer }: { customer: CustomerRow }) => {
  if (!customer.total) return <span className="text-xs text-gray-400">No requests yet</span>;
  const openPct = (customer.open / customer.total) * 100;
  return (
    <div className="min-w-36 space-y-1.5">
      <p className="text-base">
        <span className="font-semibold tabular-nums text-gray-900">{customer.total}</span>{" "}
        <span className="text-gray-500">{customer.total === 1 ? "request" : "requests"}</span>
        {customer.open > 0 && <span className="ml-1.5 text-xs font-medium text-blue-700">{customer.open} open</span>}
      </p>
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-100" title={`${customer.open} open · ${customer.total - customer.open} closed`}>
        <span className="h-full bg-blue-500" style={{ width: `${openPct}%` }} />
        <span className="h-full bg-gray-300" style={{ width: `${100 - openPct}%` }} />
      </div>
    </div>
  );
};
export default CustomersPage;