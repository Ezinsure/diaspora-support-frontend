import { FALLBACK_PRICE, PRICING, formatMoney } from "@/lib/site";
import type { PublicFee } from "@/services/publicFeeService";

const API = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/v1"
).replace(/\/+$/, "");

const res = await fetch(`${API}/service-fees/public/${PRICING.supportFeeId}`, {
  next: { tags: ["support-fee"] },
});

export const getSupportFee = async (): Promise<{
  fee: PublicFee | null;
  price: string;
}> => {
  const fallback = { fee: null, price: FALLBACK_PRICE };
  if (!PRICING.supportFeeId) return fallback;

  try {
    const res = await fetch(
      `${API}/service-fees/public/${PRICING.supportFeeId}`,
      {
        next: {
          revalidate: PRICING.revalidateSeconds,
        },
      },
    );
    if (!res.ok) return fallback;

    const data = await res.json();
    const fee: PublicFee = { ...data, amount: Number(data.amount) };
    return { fee, price: formatMoney(fee.amount, fee.currency) };
  } catch {
    return fallback;
  }
};
