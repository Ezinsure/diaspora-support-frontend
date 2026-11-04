export type CommonStatus =
  | "active"
  | "deactivated"
  | "pending"
  | "completed"
  | "in_progress";

export const statusStyles: Record<CommonStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  deactivated: "bg-gray-100 text-gray-600 ring-gray-500/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  in_progress: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

export const defaultStatusStyle =
  "bg-gray-100 text-gray-600 ring-gray-500/20";