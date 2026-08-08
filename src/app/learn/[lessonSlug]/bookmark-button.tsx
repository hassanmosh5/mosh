"use client";

import { useState } from "react";

export function BookmarkButton({
  lessonId,
  bookmarked: initialBookmarked,
}: {
  lessonId: string;
  bookmarked: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setBookmarked(data.bookmarked);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="flex items-center gap-1 text-xs font-medium underline disabled:opacity-50"
    >
      {bookmarked ? "★ Bookmarked" : "☆ Bookmark this lesson"}
    </button>
  );
}
