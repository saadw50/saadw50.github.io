"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyEmail({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("");
  function onClick() {
    const done = () => {
      setCopied(true);
      setMsg("Email address copied");
      setTimeout(() => { setCopied(false); setMsg(""); }, 1800);
    };
    const fallback = () => setMsg(`Copy failed. The address is ${value}`);
    try { navigator.clipboard.writeText(value).then(done, fallback); } catch { fallback(); }
  }
  return (
    <>
      <button className="btn" id="copy" type="button" onClick={onClick}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {copied ? "Copied" : "Copy email"}
      </button>
      <span className="vh" role="status">{msg}</span>
    </>
  );
}
