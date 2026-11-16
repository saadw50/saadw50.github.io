"use client";

import { useState } from "react";
import {
  BookOpen,
  Download,
  Languages,
  MapPinned,
  Navigation,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

type Language = "en" | "bn";

const COPY = {
  en: {
    languageLabel: "Paper language",
    eyebrow: "Paper 454 · Accepted at ICRPSET 2026",
    title: "A unified assistive platform for visually impaired individuals",
    lead: "An autonomous prototype that combines lane navigation, Bangladeshi currency recognition, GPS/GSM tracking and safety features in one assistive vehicle platform.",
    openPdf: "Read the paper",
    downloadPdf: "Download PDF",
    scannerTitle: "Assistive vehicle scanner",
    scannerDescription: "Illustrative scanner view of the paper's autonomous vehicle, lane, stop-sign detection and GPS link.",
    scannerNote: "Illustrative system map — not a live sensor feed",
    metricsLabel: "Reported results",
    metrics: [
      { value: "85%", label: "Navigation success", note: "17 of 20 custom-track trials" },
      { value: "0.965", label: "YOLOv8 mAP@50", note: "Stop-sign and obstacle mean" },
      { value: "0.995", label: "YOLOv11 mAP@50", note: "Six-denomination currency mean" },
      { value: "98%", label: "SMS transmission", note: "49 of 50 test messages" },
    ],
    systemsLabel: "Four integrated subsystems",
    systems: [
      {
        title: "Autonomous navigation",
        text: "Pixel-sum lane following runs alongside YOLOv8 stop-sign and obstacle detection. The prototype completed 17 of 20 trials on its customised track.",
      },
      {
        title: "Digital wallet",
        text: "YOLOv11 recognises six Bangladeshi banknote denominations. Table VII reports mean precision 0.996 and mean recall 0.999.",
      },
      {
        title: "Location tracking",
        text: "GPS and GSM share coordinates by SMS and through Traccar. The reported 98% result is SMS-delivery success, not GPS-position accuracy.",
      },
      {
        title: "Safety features",
        text: "The integrated prototype includes an automatic door lock, fire alert and anti-theft alarm alongside the mobility functions.",
      },
    ],
    limitsLabel: "Evidence boundary",
    limits: "The study used one customised track, 20 navigation trials, small custom image datasets and GPS with indoor satellite limitations. It demonstrates subsystem integration, not road-ready safety or validated GPS accuracy.",
    languageNote: "English is the default. This switch changes the research brief only; the original manuscript remains in English.",
  },
  bn: {
    languageLabel: "পেপারের ভাষা",
    eyebrow: "পেপার ৪৫৪ · ICRPSET ২০২৬-এ গৃহীত",
    title: "দৃষ্টিপ্রতিবন্ধী ব্যক্তিদের জন্য একটি সমন্বিত সহায়ক প্ল্যাটফর্ম",
    lead: "একটি স্বয়ংক্রিয় প্রোটোটাইপ, যেখানে লেন নেভিগেশন, বাংলাদেশি মুদ্রা শনাক্তকরণ, GPS/GSM ট্র্যাকিং এবং নিরাপত্তা বৈশিষ্ট্য একই সহায়ক যানবাহন প্ল্যাটফর্মে যুক্ত করা হয়েছে।",
    openPdf: "পেপার পড়ুন",
    downloadPdf: "PDF ডাউনলোড",
    scannerTitle: "সহায়ক যানবাহনের স্ক্যানার",
    scannerDescription: "পেপারের স্বয়ংক্রিয় গাড়ি, লেন, স্টপ-সাইন শনাক্তকরণ এবং GPS সংযোগের একটি ব্যাখ্যামূলক স্ক্যানার দৃশ্য।",
    scannerNote: "ব্যাখ্যামূলক সিস্টেম ম্যাপ — এটি লাইভ সেন্সর ফিড নয়",
    metricsLabel: "প্রতিবেদিত ফলাফল",
    metrics: [
      { value: "85%", label: "নেভিগেশন সাফল্য", note: "কাস্টম ট্র্যাকে ২০টির মধ্যে ১৭টি পরীক্ষা" },
      { value: "0.965", label: "YOLOv8 mAP@50", note: "স্টপ-সাইন ও প্রতিবন্ধক শ্রেণির গড়" },
      { value: "0.995", label: "YOLOv11 mAP@50", note: "ছয় ধরনের মুদ্রা শ্রেণির গড়" },
      { value: "98%", label: "SMS প্রেরণ", note: "৫০টি পরীক্ষামূলক বার্তার মধ্যে ৪৯টি" },
    ],
    systemsLabel: "চারটি সমন্বিত সাবসিস্টেম",
    systems: [
      {
        title: "স্বয়ংক্রিয় নেভিগেশন",
        text: "পিক্সেল-সমষ্টিভিত্তিক লেন অনুসরণের সঙ্গে YOLOv8 স্টপ-সাইন ও প্রতিবন্ধক শনাক্ত করে। প্রোটোটাইপটি কাস্টম ট্র্যাকে ২০টির মধ্যে ১৭টি পরীক্ষা সম্পন্ন করেছে।",
      },
      {
        title: "ডিজিটাল ওয়ালেট",
        text: "YOLOv11 বাংলাদেশের ছয় ধরনের ব্যাংকনোট শনাক্ত করে। টেবিল VII-এ গড় precision 0.996 এবং গড় recall 0.999 প্রতিবেদন করা হয়েছে।",
      },
      {
        title: "অবস্থান ট্র্যাকিং",
        text: "GPS ও GSM ব্যবহার করে SMS এবং Traccar-এর মাধ্যমে স্থানাঙ্ক পাঠানো হয়। প্রতিবেদিত ৯৮% ফলাফলটি SMS পৌঁছানোর সাফল্য; এটি GPS অবস্থান-নির্ভুলতা নয়।",
      },
      {
        title: "নিরাপত্তা বৈশিষ্ট্য",
        text: "সমন্বিত প্রোটোটাইপে চলাচল-সহায়তার পাশাপাশি স্বয়ংক্রিয় দরজা লক, অগ্নি সতর্কতা এবং চুরি-প্রতিরোধী অ্যালার্ম রয়েছে।",
      },
    ],
    limitsLabel: "প্রমাণের সীমা",
    limits: "গবেষণায় একটি কাস্টম ট্র্যাক, ২০টি নেভিগেশন পরীক্ষা, ছোট কাস্টম ইমেজ ডেটাসেট এবং ঘরের ভেতরে স্যাটেলাইট-সংযোগ সীমিত এমন GPS ব্যবহার করা হয়েছে। এটি সাবসিস্টেম সমন্বয় দেখায়; সড়ক-প্রস্তুত নিরাপত্তা বা যাচাইকৃত GPS নির্ভুলতা প্রতিষ্ঠা করে না।",
    languageNote: "ডিফল্ট ভাষা ইংরেজি। এই সুইচটি শুধু গবেষণা-সংক্ষিপ্তসার বদলায়; মূল পাণ্ডুলিপি ইংরেজিতেই থাকবে।",
  },
} as const;

const subsystemIcons = [Navigation, WalletCards, MapPinned, ShieldCheck] as const;

export default function AssistivePaper() {
  const [language, setLanguage] = useState<Language>("en");
  const copy = COPY[language];

  return (
    <section id="paper454" className="paper-showcase" aria-labelledby="paper454-title">
      <div className="paper-console">
        <div className="paper-toolbar">
          <span className="paper-lock"><i aria-hidden="true" /> PAPER 454 / SYSTEM ONLINE</span>
          <div className="paper-language" role="group" aria-label={copy.languageLabel}>
            <span><Languages aria-hidden="true" size={15} /> {copy.languageLabel}</span>
            <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" aria-pressed={language === "bn"} onClick={() => setLanguage("bn")}>বাংলা</button>
          </div>
        </div>

        <div className="paper-grid">
          <div className="paper-scanner">
            <svg viewBox="0 0 680 430" role="img" aria-labelledby="paper-scanner-title paper-scanner-desc">
              <title id="paper-scanner-title">{copy.scannerTitle}</title>
              <desc id="paper-scanner-desc">{copy.scannerDescription}</desc>
              <defs>
                <linearGradient id="paper-road" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#13242d" />
                  <stop offset="1" stopColor="#081117" />
                </linearGradient>
                <radialGradient id="paper-radar" cx="50%" cy="100%" r="80%">
                  <stop offset="0" stopColor="#38d5c8" stopOpacity=".2" />
                  <stop offset="1" stopColor="#38d5c8" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="680" height="430" rx="12" className="paper-scan-bg" />
              <g className="paper-grid-lines" aria-hidden="true">
                <path d="M0 78H680M0 148H680M0 218H680M0 288H680M0 358H680" />
                <path d="M90 0V430M180 0V430M270 0V430M360 0V430M450 0V430M540 0V430M630 0V430" />
              </g>

              <path d="M242 92H438L624 430H56Z" fill="url(#paper-road)" className="paper-road" />
              <path d="M340 92L340 430M287 92L194 430M393 92L486 430" className="paper-lanes" />
              <path d="M340 380L214 126A286 286 0 0 1 466 126Z" fill="url(#paper-radar)" className="paper-radar-area" />
              <g className="paper-radar-rings" aria-hidden="true">
                <path d="M272 314A76 76 0 0 1 408 314" />
                <path d="M227 237A130 130 0 0 1 453 237" />
                <path d="M181 159A182 182 0 0 1 499 159" />
              </g>
              <path d="M340 380L218 138" className="paper-sweep" aria-hidden="true" />

              <g className="paper-target paper-stop">
                <path d="M454 128l14-6 14 6 6 14-6 14-14 6-14-6-6-14z" />
                <text x="468" y="146" textAnchor="middle">STOP</text>
                <rect x="441" y="113" width="54" height="59" rx="5" />
                <text x="468" y="104" textAnchor="middle">YOLOv8</text>
              </g>
              <g className="paper-target paper-obstacle">
                <rect x="203" y="210" width="66" height="46" rx="5" />
                <text x="236" y="203" textAnchor="middle">OBSTACLE</text>
              </g>
              <g className="paper-gps">
                <circle cx="90" cy="72" r="20" />
                <path d="M90 59v26M77 72h26" />
                <text x="122" y="68">GPS LOCK</text>
                <text x="122" y="84">GSM LINK</text>
              </g>

              <g className="paper-vehicle">
                <rect x="296" y="316" width="88" height="58" rx="12" />
                <path d="M311 316l12-24h34l12 24" />
                <circle cx="311" cy="375" r="9" />
                <circle cx="369" cy="375" r="9" />
                <circle cx="340" cy="331" r="7" />
                <path d="M340 324v-17" />
                <path d="M325 340h30" />
              </g>

              <g className="paper-scan-labels">
                <text x="24" y="404">LANE: LOCKED</text>
                <text x="531" y="404">MODE: ASSIST</text>
              </g>
            </svg>

            <div className="paper-readout" aria-hidden="true">
              <span><small>NAV</small><b>PIXEL SUM</b></span>
              <span><small>VISION</small><b>YOLOv8</b></span>
              <span><small>WALLET</small><b>YOLOv11</b></span>
              <span><small>LINK</small><b>GPS / GSM</b></span>
            </div>
            <p>{copy.scannerNote}</p>
          </div>

          <article className="paper-copy" lang={language} aria-live="polite">
            <span className="paper-eyebrow">{copy.eyebrow}</span>
            <h2 id="paper454-title">{copy.title}</h2>
            <p className="paper-lead">{copy.lead}</p>
            <div className="paper-actions">
              <a className="btn primary" href="/papers/icrpset-2026-paper-454.pdf" target="_blank" rel="noreferrer">
                <BookOpen aria-hidden="true" size={17} /> {copy.openPdf}
              </a>
              <a className="btn" href="/papers/icrpset-2026-paper-454.pdf" download>
                <Download aria-hidden="true" size={17} /> {copy.downloadPdf}
              </a>
            </div>

            <h3 className="paper-minihead">{copy.metricsLabel}</h3>
            <dl className="paper-metrics">
              {copy.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                  <small>{metric.note}</small>
                </div>
              ))}
            </dl>
          </article>
        </div>

        <div className="paper-detail" lang={language}>
          <h3>{copy.systemsLabel}</h3>
          <div className="paper-systems">
            {copy.systems.map((system, index) => {
              const Icon = subsystemIcons[index];
              return (
                <article key={system.title}>
                  <Icon aria-hidden="true" size={20} />
                  <h4>{system.title}</h4>
                  <p>{system.text}</p>
                </article>
              );
            })}
          </div>
          <aside className="paper-limit">
            <b>{copy.limitsLabel}</b>
            <p>{copy.limits}</p>
          </aside>
          <p className="paper-language-note">{copy.languageNote}</p>
        </div>
      </div>
    </section>
  );
}
