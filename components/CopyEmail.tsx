"use client";

import { useState } from "react";

export default function CopyEmail({ targetId }: { targetId: string }) {
  const [label, setLabel] = useState("Copy email");
  function onClick() {
    const el = document.getElementById(targetId);
    if (!el) return;
    const text = el.textContent ?? "";
    const done = () => { setLabel("Copied"); setTimeout(() => setLabel("Copy email"), 1600); };
    const select = () => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
      setLabel("Selected, press Ctrl+C");
    };
    try { navigator.clipboard.writeText(text).then(done, select); } catch { select(); }
  }
  return (
    <button className="btn" id="copy" type="button" onClick={onClick}>{label}</button>
  );
}
