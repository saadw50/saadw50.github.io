"use client";

import { useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string; cap: string };

/* One shared viewer for every <button class="zoom" data-full data-cap> on the page. The native
   <dialog> traps focus, closes on Esc and makes the page behind it inert. */
export default function Lightbox() {
  const dlg = useRef<HTMLDialogElement>(null);
  const last = useRef<HTMLElement | null>(null);
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    const d = dlg.current;
    function onClick(e: MouseEvent) {
      const b = (e.target as Element | null)?.closest?.(".zoom") as HTMLButtonElement | null;
      if (!b || !b.dataset.full || !d) return;
      last.current = b;
      setShot({ src: b.dataset.full, alt: b.querySelector("img")?.alt ?? "", cap: b.dataset.cap ?? "" });
      d.showModal();
    }
    function onClose() {
      setShot(null);
      last.current?.focus();
    }
    document.addEventListener("click", onClick);
    d?.addEventListener("close", onClose);
    return () => {
      document.removeEventListener("click", onClick);
      d?.removeEventListener("close", onClose);
    };
  }, []);

  return (
    <dialog
      ref={dlg}
      className="lightbox"
      aria-label="Enlarged photo"
      onClick={(e) => { if (e.target === e.currentTarget) dlg.current?.close(); }}
    >
      <button type="button" className="lb-close" onClick={() => dlg.current?.close()} autoFocus>Close</button>
      {shot && <img src={shot.src} alt={shot.alt} />}
      <p>{shot?.cap}</p>
    </dialog>
  );
}
