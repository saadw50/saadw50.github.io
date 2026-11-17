"use client";

import { ArrowUpRight, Languages } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AssistiveScanner from "@/components/AssistiveScanner";

type Language = "en" | "bn";

const COPY = {
  en: {
    label: "Flagship 02 · Assistive vehicle",
    title: "Assistive car & vision platform",
    lead: "A unified prototype combining lane navigation, stop-sign and obstacle detection, Bangladeshi currency recognition, GPS/GSM tracking and safety features.",
    scannerTitle: "Assistive vehicle scanner",
    scannerDescription: "Illustrative scanner view of the autonomous vehicle, lane, stop-sign detection and GPS link.",
    scannerNote: "Illustrative system map — not a live sensor feed",
    details: "Open system details",
    languageLabel: "Preview language",
    stats: [
      { value: "85%", label: "custom-track navigation" },
      { value: "0.995", label: "currency mAP@50" },
      { value: "98%", label: "SMS delivery" },
    ],
  },
  bn: {
    label: "ফ্ল্যাগশিপ ০২ · সহায়ক যানবাহন",
    title: "সহায়ক গাড়ি ও ভিশন প্ল্যাটফর্ম",
    lead: "লেন নেভিগেশন, স্টপ-সাইন ও প্রতিবন্ধক শনাক্তকরণ, বাংলাদেশি মুদ্রা চেনা, GPS/GSM ট্র্যাকিং এবং নিরাপত্তা বৈশিষ্ট্য নিয়ে তৈরি একটি সমন্বিত প্রোটোটাইপ।",
    scannerTitle: "সহায়ক যানবাহনের স্ক্যানার",
    scannerDescription: "স্বয়ংক্রিয় গাড়ি, লেন, স্টপ-সাইন শনাক্তকরণ এবং GPS সংযোগের একটি ব্যাখ্যামূলক স্ক্যানার দৃশ্য।",
    scannerNote: "ব্যাখ্যামূলক সিস্টেম ম্যাপ — এটি লাইভ সেন্সর ফিড নয়",
    details: "সিস্টেমের বিস্তারিত দেখুন",
    languageLabel: "প্রিভিউ ভাষা",
    stats: [
      { value: "৮৫%", label: "কাস্টম-ট্র্যাক নেভিগেশন" },
      { value: "০.৯৯৫", label: "মুদ্রা mAP@50" },
      { value: "৯৮%", label: "SMS পৌঁছানো" },
    ],
  },
} as const;

export default function AssistiveProjectPreview() {
  const [language, setLanguage] = useState<Language>("en");
  const copy = COPY[language];

  return (
    <article className="flagship-row flagship-reverse flagship-car">
      <div className="flagship-visual">
        <AssistiveScanner
          title={copy.scannerTitle}
          description={copy.scannerDescription}
          note={copy.scannerNote}
          className="paper-scanner-preview"
        />
      </div>
      <div className="flagship-copy" lang={language} aria-live="polite">
        <div className="flagship-kicker-row">
          <span className="flagship-kicker">{copy.label}</span>
          <div className="flagship-language" role="group" aria-label={copy.languageLabel}>
            <Languages aria-hidden="true" size={15} />
            <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" aria-pressed={language === "bn"} onClick={() => setLanguage("bn")}>বাংলা</button>
          </div>
        </div>
        <h3>{copy.title}</h3>
        <p>{copy.lead}</p>
        <dl className="flagship-stats">
          {copy.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <Link className="flagship-link" href="/projects/assistive-car/">
          {copy.details} <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}
