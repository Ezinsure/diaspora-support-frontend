import { isOpen, isPaid, quotationTotal } from "../requests/requestStatus";


// Everything the customers page shows about one customer, from their requests
export const customerSummary = (customer: any, requests: any[]) => {
  const mine = requests
    .filter((r) => r.customerId === customer.id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const byStatus: Record<string, number> = {};
  for (const r of mine) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;

  const open = mine.filter(isOpen).length;

  // Money actually received
  const paid = mine.reduce((sum, r) => sum + (isPaid(r) ? Number(r.payment.amount ?? 0) : 0), 0);

  // Only known when a quotation was made (other prices are agreed outside the system)
  const unpaid = mine.reduce(
    (sum, r) => sum + (r.quotation && isOpen(r) && !isPaid(r) ? quotationTotal(r.quotation.items) : 0),
    0,
  );

  // Requests waiting for us to write a quotation
  const quotesToMake = mine.filter((r) => r.quotationRequested && !r.quotation && isOpen(r)).length;

  return {
    ...customer,
    name: `${customer.firstName} ${customer.lastName}`.trim(),
    requests: mine,
    total: mine.length,
    open,
    byStatus,
    paid,
    unpaid,
    quotesToMake,
    lastRequestAt: mine[0]?.createdAt ?? null,
    lastService: mine[0]?.service ?? null,
  };
};

export const initialsOf = (c: any) =>
  `${c.firstName?.[0] ?? ""}${c.lastName?.[0] ?? ""}`.toUpperCase() || "?";