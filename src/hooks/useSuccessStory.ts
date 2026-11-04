"use client";

import { useState } from "react";

// UI only for now: stories live in memory (lost on refresh).
// When the API exists, replace this file with react-query hooks that keep the SAME names
// (stories, create, update, togglePublish, move, remove) and the page keeps working.

export interface SuccessStory {
  id: string;
  customerName: string;
  country: string;
  service: string;
  title: string;
  story: string;
  rating: number | null; // 1-5, optional
  storyDate: string; // YYYY-MM-DD, optional ("")
  photoUrl: string; // optional ("")
  consent: true; // the customer agreed to be shown on the website
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type SuccessStoryFormValues = Omit<SuccessStory, "id" | "sortOrder" | "createdAt" | "updatedAt">;

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));

export const useSuccessStories = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);

  const sorted = [...stories].sort((a, b) => a.sortOrder - b.sortOrder);

  const create = (values: SuccessStoryFormValues) => {
    const now = new Date().toISOString();
    setStories((list) => [
      ...list,
      { ...values, id: newId(), sortOrder: list.length, createdAt: now, updatedAt: now },
    ]);
  };

  const update = (id: string, values: Partial<SuccessStoryFormValues>) =>
    setStories((list) => list.map((s) => (s.id === id ? { ...s, ...values, updatedAt: new Date().toISOString() } : s)));

  const togglePublish = (id: string) =>
    setStories((list) => list.map((s) => (s.id === id ? { ...s, isPublished: !s.isPublished, updatedAt: new Date().toISOString() } : s)));

  // Move one step up (-1) or down (+1)
  const move = (id: string, direction: -1 | 1) =>
    setStories((list) => {
      const ordered = [...list].sort((a, b) => a.sortOrder - b.sortOrder);
      const i = ordered.findIndex((s) => s.id === id);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= ordered.length) return list;
      [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
      return ordered.map((s, index) => ({ ...s, sortOrder: index }));
    });

  const remove = (id: string) =>
    setStories((list) => list.filter((s) => s.id !== id).sort((a, b) => a.sortOrder - b.sortOrder).map((s, i) => ({ ...s, sortOrder: i })));

  return { stories: sorted, isLoading: false, create, update, togglePublish, move, remove };
};