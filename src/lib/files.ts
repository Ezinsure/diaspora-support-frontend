export const DOC_MAX_MB = 20;
export const DOC_MAX_FILES = 20;
export const DOC_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const DOC_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx";

export const LOGO_MAX_MB = 2;
export const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
export const LOGO_ACCEPT = ".png,.jpg,.jpeg,.webp,.svg";

export const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(/\.0$/, "")} MB`;
};

export type FileKind = "pdf" | "image" | "word" | "other";

export const fileKind = (mimeType?: string | null, name?: string | null): FileKind => {
  const m = String(mimeType ?? "");
  const n = String(name ?? "").toLowerCase();
  if (m === "application/pdf" || n.endsWith(".pdf")) return "pdf";
  if (m.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/.test(n)) return "image";
  if (m.includes("word") || /\.docx?$/.test(n)) return "word";
  return "other";
};

// Returns an error sentence, or null when all files are fine
export const checkDocuments = (files: File[]) => {
  if (!files.length) return "Choose at least one file";
  if (files.length > DOC_MAX_FILES) return `Upload at most ${DOC_MAX_FILES} files at once`;
  const wrong = files.find((f) => f.type && !DOC_TYPES.includes(f.type));
  if (wrong) return `"${wrong.name}" is not allowed. Use PDF, JPG, PNG, WEBP or Word.`;
  const big = files.find((f) => f.size > DOC_MAX_MB * 1024 * 1024);
  if (big) return `"${big.name}" is larger than ${DOC_MAX_MB} MB`;
  return null;
};

export const checkLogo = (file?: File | null) => {
  if (!file) return "Choose an image";
  if (!LOGO_TYPES.includes(file.type)) return "Use a PNG, JPG, WEBP or SVG image";
  if (file.size > LOGO_MAX_MB * 1024 * 1024) return `The logo must be ${LOGO_MAX_MB} MB or less`;
  return null;
};