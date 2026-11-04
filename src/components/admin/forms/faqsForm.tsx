"use client";

import { useState } from "react";
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
import { Field } from "@/components/admin/setting-ui";
import { faqSchema, validate, type FieldErrors } from "@/components/shared/FormValidation";
import type { FaqFormValues, FaqItem } from "@/hooks/useFaqs";

const FaqFormDialog = ({
  open,
  onOpenChange,
  faq,
  onSave,
  isSaving = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: FaqItem | null;
  onSave: (data: FaqFormValues) => void;
  isSaving?: boolean;
}) => (
  <AlertDialog open={open} onOpenChange={(o) => !isSaving && onOpenChange(o)}>
    <AlertDialogContent className="sm:max-w-2xl! px-8!">
      {open && <FaqForm key={faq?.id ?? "new"} faq={faq} onCancel={() => onOpenChange(false)} onSave={onSave} isSaving={isSaving} />}
    </AlertDialogContent>
  </AlertDialog>
);

const FieldError = ({ text }: { text?: string }) => (text ? <p className="mt-1 text-xs text-destructive">{text}</p> : null);

export const FaqForm = ({
  faq,
  onCancel,
  onSave,
  isSaving = false,
}: {
  faq: FaqItem | null;
  onCancel: () => void;
  onSave: (data: FaqFormValues) => void;
  isSaving?: boolean;
}) => {
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [isPublished, setIsPublished] = useState(faq?.isPublished ?? true);
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validate(faqSchema, { question, answer, isPublished });
    if (!result.ok) return setErrors(result.errors);
    onSave(result.data);
  };

  return (
    <form onSubmit={submit} noValidate>
      <AlertDialogHeader className="text-left">
        <AlertDialogTitle>{faq ? "Edit question" : "Add question"}</AlertDialogTitle>
        <AlertDialogDescription>Write it the way a customer would ask it.</AlertDialogDescription>
      </AlertDialogHeader>

      <fieldset disabled={isSaving} className="grid gap-4 py-5">
        <Field label="Question" htmlFor="faqQuestion">
          <Input
            id="faqQuestion"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (errors.question) setErrors((x) => ({ ...x, question: "" }));
            }}
            maxLength={160}
          />
          <FieldError text={errors.question} />
        </Field>
        <Field label="Answer" htmlFor="faqAnswer" hint={`${answer.length}/1000 characters`}>
          <Textarea
            id="faqAnswer"
            rows={6}
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (errors.answer) setErrors((x) => ({ ...x, answer: "" }));
            }}
            maxLength={1000}
          />
          <FieldError text={errors.answer} />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-300/50 p-3 hover:bg-navy-50/50">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="mt-0.5 h-4 w-4" />
          <span>
            <span className="block text-sm font-medium text-ink">Show on the website</span>
            <span className="block text-xs text-ink/55">Untick to keep it as a draft.</span>
          </span>
        </label>
      </fieldset>

      <AlertDialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" className="bg-title text-white hover:bg-title/90" disabled={isSaving}>
          {isSaving ? "Saving..." : faq ? "Save changes" : "Add question"}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};

export default FaqFormDialog;