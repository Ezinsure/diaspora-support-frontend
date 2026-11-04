import {
  statusStyles,
  defaultStatusStyle,
  type CommonStatus,
} from "@/lib/statusStyle";
import { cn } from "../../../lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase() as CommonStatus;

  const label = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium capitalize ring-1 ring-inset",
        statusStyles[normalizedStatus] ?? defaultStatusStyle,
        className,
      )}
    >
      {label}
    </span>
  );
};
export default StatusBadge;
