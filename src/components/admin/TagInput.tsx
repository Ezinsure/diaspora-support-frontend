"use client";

import { useState } from "react";
import { Tag } from "../admin/setting-ui";

export default function TagInput({
    id,
    value,
    onChange,
    max = 8,
}: {
    id: string;
    value: string[];
    onChange: (tags: string[]) => void;
    max?: number;
}) {
    const [draft, setDraft] = useState("");

    const add = () => {
        const tag = draft.trim().replace(/,$/, "");
        if (tag && !value.some((t) => t.toLowerCase() === tag.toLowerCase()) && value.length < max) {
            onChange([...value, tag]);
        }
        setDraft("");
    };

    return (
        <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-ink/30 bg-white px-2 py-1.5  focus-visible:shadow-[inset_0_0_0_0.5px_#042151]">
            {value.map((tag) => (
                <Tag key={tag} onRemove={() => onChange(value.filter((t) => t !== tag))}>{tag}</Tag>
            ))}
            <input
                id={id}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        add();
                    } else if (e.key === "Backspace" && !draft && value.length) {
                        onChange(value.slice(0, -1));
                    }
                }}
                onBlur={add}
                placeholder={value.length ? "" : "Type and press Enter"}
                className="min-w-24 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-ink/40"
            />
        </div>
    );
}