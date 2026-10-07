// src/app/admin/settings/faq/page.tsx  →  /admin/settings/faq
"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState, Field, PageHeader } from "@/components/admin/setting-ui";
import { FaqItem, mockFaqs } from "@/lib/mock/settings";


export default function FaqSettingsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(mockFaqs); // TODO: load from API
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<FaqItem | null>(null);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    setFaqs(next); // TODO: save order to API
  };

  const save = (data: Omit<FaqItem, "id">) => {
    if (editing) {
      setFaqs((list) => list.map((f) => (f.id === editing.id ? { ...f, ...data } : f)));
      toast.success("Question updated");
    } else {
      setFaqs((list) => [...list, { ...data, id: crypto.randomUUID() }]);
      toast.success("Question added");
    }
    setFormOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="Questions shown on the website's FAQ page, in this order."
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="rounded-full bg-title px-4 text-white hover:bg-title/90">
            <Plus className="h-4 w-4" /> Add question
          </Button>
        }
      />

      {faqs.length === 0 ? (
        <div className="mt-6"><EmptyState title="No questions yet" text="Add the questions customers ask most often." /></div>
      ) : (
        <ol className="mt-6 divide-y divide-navy-300/40 overflow-hidden rounded-2xl border border-navy-300/50 bg-white">
          {faqs.map((faq, i) => (
            <li key={faq.id}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-title">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-medium text-ink">{faq.question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-180" />
                </summary>

                <div className="px-4 pb-4 sm:pl-14">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-ink/70">{faq.answer}</p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    <Button variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === faqs.length - 1} aria-label="Move down">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(faq); setFormOpen(true); }} className="text-ink/70 hover:text-title">
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

      <AlertDialog open={formOpen} onOpenChange={setFormOpen}>
        <AlertDialogContent className="sm:max-w-lg">
          {formOpen && <FaqForm key={editing?.id ?? "new"} faq={editing} onCancel={() => setFormOpen(false)} onSave={save} />}
        </AlertDialogContent>
      </AlertDialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this question?"
        description={deleting?.question}
        confirmLabel="Delete question"
        onConfirm={() => {
          setFaqs((list) => list.filter((f) => f.id !== deleting?.id)); // TODO: API call
          toast.success("Question deleted");
        }}
      />
    </div>
  );
}

function FaqForm({
  faq,
  onCancel,
  onSave,
}: {
  faq: FaqItem | null;
  onCancel: () => void;
  onSave: (data: Omit<FaqItem, "id">) => void;
}) {
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ question: question.trim(), answer: answer.trim() });
      }}
    >
      <AlertDialogHeader className="text-left">
        <AlertDialogTitle>{faq ? "Edit question" : "Add question"}</AlertDialogTitle>
        <AlertDialogDescription>Write it the way a customer would ask it.</AlertDialogDescription>
      </AlertDialogHeader>

      <div className="grid gap-4 py-5">
        <Field label="Question" htmlFor="faqQuestion">
          <Input id="faqQuestion" value={question} onChange={(e) => setQuestion(e.target.value)} required maxLength={160} />
        </Field>
        <Field label="Answer" htmlFor="faqAnswer" hint={`${answer.length}/1000 characters`}>
          <Textarea id="faqAnswer" rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} required maxLength={1000} />
        </Field>
      </div>

      <AlertDialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-title text-white hover:bg-title/90">{faq ? "Save changes" : "Add question"}</Button>
      </AlertDialogFooter>
    </form>
  );
}