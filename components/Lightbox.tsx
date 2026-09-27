"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string; cap: string };

/* One shared viewer for every <button class="zoom" data-full data-cap> on the page. */
export default function Lightbox() {
  const [shot, setShot] = useState<Shot | null>(null);
  const last = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setShot(null);
    last.current?.focus();
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const b = (e.target as Element | null)?.closest?.(".zoom") as HTMLButtonElement | null;
      if (!b || !b.dataset.full) return;
      last.current = b;
      setShot({ src: b.dataset.full, alt: b.querySelector("img")?.alt ?? "", cap: b.dataset.cap ?? "" });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!shot) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shot, close]);

  return (
    <div
      className="lightbox"
      hidden={!shot}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged image"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <button type="button" ref={closeBtn} onClick={close}>Close</button>
      {shot && <img src={shot.src} alt={shot.alt} />}
      <p>{shot?.cap}</p>
    </div>
  );
}
