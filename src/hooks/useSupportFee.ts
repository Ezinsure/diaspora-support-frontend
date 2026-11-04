"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicFeeService } from "@/services/publicFeeService";
import { FALLBACK_PRICE, PRICING, formatMoney } from "@/lib/site";

export const useSupportFee = () => {
  const id = PRICING.supportFeeId;
  const query = useQuery({
    queryKey: ["public-fees", "one", id],
    queryFn: () =>
      PublicFeeService.getOne(id).then((r) => ({
        ...r.data,
        amount: Number(r.data.amount),
      })),
    enabled: !!id,
    staleTime: 1 * 60_000,
    retry: false,
  });

  const fee = query.data ?? null;
  return {
    ...query,
    fee,
    price: fee ? formatMoney(fee.amount, fee.currency) : FALLBACK_PRICE,
  };
};
