"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState, PageHeader } from "@/components/admin/setting-ui";
import FaqFormDialog from "@/components/admin/forms/faqsForm";
import {
  type FaqFormValues,
  type FaqItem,
  useCreateFaq,
  useDeleteFaq,
  useFaqs,
  usePublishFaq,
  useReorderFaqs,
  useUpdateFaq,
} from "@/hooks/useFaqs";
import FaqListSkeleton from "@/components/admin/skeleton/faqSkeleton";

const FaqSettingsPage = () => {
  const { data: faqs = [], isLoading, isError } = useFaqs();
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const publishFaq = usePublishFaq();
  const reorderFaqs = useReorderFaqs();
  const deleteFaq = useDeleteFaq();

  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<FaqItem | null>(null);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const ids = faqs.map((f) => f.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorderFaqs.mutate(ids);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (faq: FaqItem) => {
    setEditing(faq);
    setFormOpen(true);
  };

  const closeForm = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditing(null);
  };

  const save = (values: FaqFormValues) => {
    const onSuccess = () => closeForm(false);
    if (editing) updateFaq.mutate({ id: editing.id, values }, { onSuccess });
    else createFaq.mutate(values, { onSuccess });
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteFaq.mutate(deleting.id, { onSettled: () => setDeleting(null) });
  };

  const published = faqs.filter((f) => f.isPublished).length;

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="Questions shown on the website's FAQ page."
        action={
          <Button onClick={openCreate} className="rounded-md bg-title px-4 text-white hover:bg-title/90">
            <Plus className="h-4 w-4" /> Add Question
          </Button>
        }
      />

      {faqs.length > 0 && (
        <p className="mt-4 text-sm text-ink/60">
          {published} of {faqs.length} shown on the website
          {reorderFaqs.isPending && " · saving order…"}
        </p>
      )}

      {isError ? (
        <div className="mt-6"><EmptyState title="Couldn't load the questions" text="Check your connection and refresh the page." /></div>
      ) : isLoading ? (
        <FaqListSkeleton />
      ) : faqs.length === 0 ? (
        <div className="mt-6"><EmptyState title="No questions yet" text="Add the questions customers ask most often." /></div>
      ) : (
        <ol className="mt-4 divide-y divide-navy-300/40 overflow-hidden rounded-2xl border border-navy-300/50 bg-white">
          {faqs.map((faq, i) => (
            <li key={faq.id}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-title">
                    {i + 1}
                  </span>
                  <h2 className={`flex-1 text-sm lg:text-lg font-medium text-ink ${faq.isPublished ? "" : "opacity-60"}`}>{faq.question}</h2>
                  {!faq.isPublished && (
                    <span className="shrink-0 rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-ink/60 ring-1 ring-navy-300/50">
                      Draft
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-180" />
                </summary>

                <div className="px-4 pb-4 sm:pl-14">
                  <p className="whitespace-pre-line text-base leading-relaxed text-ink/90">{faq.answer}</p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    <Button variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0 || reorderFaqs.isPending} aria-label="Move up">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === faqs.length - 1 || reorderFaqs.isPending} aria-label="Move down">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => publishFaq.mutate({ id: faq.id, isPublished: !faq.isPublished })}
                      disabled={publishFaq.isPending && publishFaq.variables?.id === faq.id}
                      className="text-ink/70 hover:text-title"
                    >
                      {faq.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {faq.isPublished ? "Hide" : "Publish"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(faq)} className="text-ink/70 hover:text-title">
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleting(faq)} className="text-ink/70 hover:text-destructive">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ol>
      )}

      <FaqFormDialog
        open={formOpen}
        onOpenChange={closeForm}
        faq={editing}
        onSave={save}
        isSaving={createFaq.isPending || updateFaq.isPending}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && !deleteFaq.isPending && setDeleting(null)}
        title="Delete this question?"
        description={deleting?.question}
        confirmLabel={deleteFaq.isPending ? "Deleting..." : "Delete question"}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default FaqSettingsPage;