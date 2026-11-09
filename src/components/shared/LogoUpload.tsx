"use client";

import { useRef, useState } from "react";
import { ImageUp, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOGO_ACCEPT, LOGO_MAX_MB, checkLogo } from "@/lib/files";
import { cn } from "@/lib/utils";
import { useRemoveLogo, useUploadLogo } from "@/hooks/useCompany";
import ConfirmDialog from "./ConfirmDialog";

const LogoUpload = ({
  logoUrl,
  name,
  disabled = false,
}: {
  logoUrl?: string | null;
  name?: string;
  disabled?: boolean;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const upload = useUploadLogo();
  const remove = useRemoveLogo();
  const busy = upload.isPending || remove.isPending;
  const shown = preview ?? logoUrl ?? null;

  const send = (file?: File | null) => {
    const problem = checkLogo(file);
    setError(problem);
    if (problem || !file) return;

    const local = URL.createObjectURL(file);
    setPreview(local);
    upload.mutate(file, {
      onSettled: () => {
        setPreview(null);
        URL.revokeObjectURL(local);
      },
    });
  };

  return (
    <>
      <div className="space-y-2">
        <input
          ref={fileRef}
          type="file"
          accept={LOGO_ACCEPT}
          className="hidden"
          onChange={(e) => {
            send(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={disabled || busy}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled && !busy) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (!disabled && !busy) send(e.dataTransfer.files?.[0]);
            }}
            title="Click or drop an image"
            className={cn(
              "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-gray-50 transition-colors",
              dragging
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300",
              shown && "border-solid bg-white",
              (disabled || busy) && "cursor-not-allowed",
            )}
          >
            {shown ? (
              <img
                src={shown}
                alt={name ? `${name} logo` : "Logo"}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <ImageUp className="h-6 w-6 text-gray-400" />
            )}

            {upload.isPending && (
              <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-xs font-semibold text-gray-700">
                {upload.progress}%
              </span>
            )}
          </button>

          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={disabled || busy}
                onClick={() => fileRef.current?.click()}
              >
                {upload.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {upload.isPending
                  ? `Uploading ${upload.progress}%`
                  : logoUrl
                    ? "Change logo"
                    : "Upload logo"}
              </Button>

              {logoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={disabled || busy}
                  onClick={() => setConfirmRemove(true)}
                >
                  {remove.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP or SVG, up to {LOGO_MAX_MB} MB. A square image
              looks best.
            </p>
          </div>
        </div>

        {upload.isPending && (
          <div
            className="h-1.5 max-w-xs overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={upload.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${upload.progress}%` }}
            />
          </div>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <ConfirmDialog
        open={confirmRemove}
        onOpenChange={(open) =>
          !open && !remove.isPending && setConfirmRemove(false)
        }
        title="Remove logo?"
        description={
          <>
            The{" "}
            <span className="font-medium text-ink">{name || "company"}</span>{" "}
            logo will be removed from the website and emails. The company name
            will show instead.
          </>
        }
        confirmLabel={remove.isPending ? "Removing..." : "Remove logo"}
        onConfirm={() =>
          remove.mutate(undefined, { onSuccess: () => setConfirmRemove(false) })
        }
      />
    </>
  );
};
export default LogoUpload;
