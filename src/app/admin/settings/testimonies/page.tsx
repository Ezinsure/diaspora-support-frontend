"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, MapPin, Pencil, Plus, Quote, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState, PageHeader, Tag } from "@/components/admin/setting-ui";
import SuccessStoryFormDialog from "@/components/admin/forms/testimonyForm";
import { useSuccessStories, type SuccessStory, type SuccessStoryFormValues } from "@/hooks/useSuccessStory";
import { cn } from "../../../../../lib/utils";

const initials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase() || "?";

const formatStoryDate = (d: string) =>
    d ? new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";

const SuccessStoriesPage = () => {
    const { stories, create, update, togglePublish, move, remove } = useSuccessStories();
    const [editing, setEditing] = useState<SuccessStory | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleting, setDeleting] = useState<SuccessStory | null>(null);
    const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

    const published = stories.filter((s) => s.isPublished).length;
    const visible = stories.filter((s) => (filter === "all" ? true : filter === "published" ? s.isPublished : !s.isPublished));

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (s: SuccessStory) => {
        setEditing(s);
        setFormOpen(true);
    };

    const save = (values: SuccessStoryFormValues) => {
        if (editing) {
            update(editing.id, values);
            toast.success("Story updated");
        } else {
            create(values);
            toast.success("Story added");
        }
        setFormOpen(false);
        setEditing(null);
    };

    return (
        <div>
            <PageHeader
                title="Success stories"
                description="Real customer experiences shown on the website, in this order."
                action={
                    <Button onClick={openCreate} className="rounded-md bg-title px-4 text-white hover:bg-title/90">
                        <Plus className="h-4 w-4" /> Add Story
                    </Button>
                }
            />

            {/* Tabs */}
            {stories.length > 0 && (
                <div className="mt-6 inline-flex rounded-xl border border-navy-300/50 bg-white p-1" role="tablist">
                    {[
                        { key: "all", label: `All (${stories.length})` },
                        { key: "published", label: `On website (${published})` },
                        { key: "draft", label: `Drafts (${stories.length - published})` },
                    ].map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            role="tab"
                            aria-selected={filter === t.key}
                            onClick={() => setFilter(t.key as typeof filter)}
                            className={cn(
                                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                                filter === t.key ? "bg-title text-white" : "text-ink/60 hover:bg-navy-50 hover:text-ink",
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            )}

            {stories.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No success stories yet" text="Add a story when a customer is happy and agrees to share their experience." />
                </div>
            ) : visible.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title={filter === "draft" ? "No drafts" : "Nothing on the website yet"} text="Switch tabs to see the other stories." />
                </div>
            ) : (
                <ol className="mt-4 grid gap-4 lg:grid-cols-2">
                    {visible.map((s) => {
                        const index = stories.findIndex((x) => x.id === s.id);
                        return (
                            <li
                                key={s.id}
                                className={cn(
                                    "flex flex-col rounded-2xl border border-navy-300/50 bg-white p-5 transition-shadow hover:shadow-sm",
                                    !s.isPublished && "border-dashed",
                                )}
                            >
                                {/* Person */}
                                <div className="flex items-start gap-3">
                                    {s.photoUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={s.photoUrl} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-navy-300/60" />
                                    ) : (
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold text-title ring-1 ring-navy-300/60">
                                            {initials(s.customerName)}
                                        </span>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-ink">{s.customerName}</p>
                                        <p className="flex flex-wrap items-center gap-x-2 text-xs text-ink/55">
                                            {s.country && (
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {s.country}
                                                </span>
                                            )}
                                            {s.storyDate && <span>{formatStoryDate(s.storyDate)}</span>}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                                            s.isPublished ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" : "bg-navy-50 text-ink/60 ring-navy-300/50",
                                        )}
                                    >
                                        {s.isPublished ? "On website" : "Draft"}
                                    </span>
                                </div>

                                {/* Story */}
                                <div className="mt-4 flex-1">
                                    <p className="font-medium text-title">{s.title}</p>
                                    <div className="relative mt-2 pl-6">
                                        <Quote className="absolute left-0 top-0.5 h-4 w-4 text-ink/20" />
                                        <p className="line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-ink/70">{s.story}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    {s.service && <Tag>{s.service}</Tag>}
                                    {s.rating && (
                                        <span className="inline-flex items-center gap-0.5" aria-label={`${s.rating} out of 5`}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={i < (s.rating ?? 0) ? "h-3.5 w-3.5 fill-amber-400 text-amber-400" : "h-3.5 w-3.5 text-ink/20"} />
                                            ))}
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-4 flex flex-wrap gap-1 border-t border-navy-300/40 pt-3">
                                    <Button variant="ghost" size="sm" onClick={() => move(s.id, -1)} disabled={index <= 0} aria-label="Move up">
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => move(s.id, 1)} disabled={index >= stories.length - 1} aria-label="Move down">
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            togglePublish(s.id);
                                            toast.success(s.isPublished ? "Moved to drafts" : "Shown on the website");
                                        }}
                                        className="text-ink/70 hover:text-title"
                                    >
                                        {s.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        {s.isPublished ? "Hide" : "Publish"}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(s)} className="text-ink/70 hover:text-title">
                                        <Pencil className="h-4 w-4" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setDeleting(s)} className="ml-auto text-ink/70 hover:text-destructive">
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}

            <SuccessStoryFormDialog
                open={formOpen}
                onOpenChange={(o) => {
                    setFormOpen(o);
                    if (!o) setEditing(null);
                }}
                story={editing}
                onSave={save}
            />

            <ConfirmDialog
                open={!!deleting}
                onOpenChange={(open) => !open && setDeleting(null)}
                title="Delete this story?"
                description={<><span className="font-medium text-ink">{deleting?.customerName}</span>’s story will be removed from the website.</>}
                confirmLabel="Delete story"
                onConfirm={() => {
                    if (deleting) remove(deleting.id);
                    setDeleting(null);
                    toast.success("Story deleted");
                }}
            />
        </div>
    );
};

export default SuccessStoriesPage;