"use client";

import { useState } from "react";
import AssistiveScanner from "@/components/AssistiveScanner";
import {
  Languages,
  MapPinned,
  Navigation,
  ShieldCheck,
  WalletCards,
  Wrench,
} from "lucide-react";

type Language = "en" | "bn";

const COPY = {
  en: {
    languageLabel: "Brief language",
    eyebrow: "Integrated assistive vehicle · bilingual system brief",
    title: "A unified assistive platform for visually impaired individuals",
    lead: "An autonomous prototype that combines lane navigation, Bangladeshi currency recognition, GPS/GSM tracking and safety features in one assistive vehicle platform.",
    publicationAccess: "Publication access",
    maintenanceMessage: "Under maintenance — the research document is not publicly available.",
    scannerTitle: "Assistive vehicle scanner",
    scannerDescription: "Illustrative scanner view of the autonomous vehicle, lane, stop-sign detection and GPS link.",
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
    languageNote: "English is the default. This switch changes the public project brief. Research-document access is under maintenance.",
  },
  bn: {
    languageLabel: "ব্রিফের ভাষা",
    eyebrow: "সমন্বিত সহায়ক যানবাহন · দ্বিভাষিক সিস্টেম ব্রিফ",
    title: "দৃষ্টিপ্রতিবন্ধী ব্যক্তিদের জন্য একটি সমন্বিত সহায়ক প্ল্যাটফর্ম",
    lead: "একটি স্বয়ংক্রিয় প্রোটোটাইপ, যেখানে লেন নেভিগেশন, বাংলাদেশি মুদ্রা শনাক্তকরণ, GPS/GSM ট্র্যাকিং এবং নিরাপত্তা বৈশিষ্ট্য একই সহায়ক যানবাহন প্ল্যাটফর্মে যুক্ত করা হয়েছে।",
    publicationAccess: "প্রকাশনা অ্যাক্সেস",
    maintenanceMessage: "রক্ষণাবেক্ষণ চলছে — গবেষণা নথিটি জনসাধারণের জন্য উন্মুক্ত নয়।",
    scannerTitle: "সহায়ক যানবাহনের স্ক্যানার",
    scannerDescription: "স্বয়ংক্রিয় গাড়ি, লেন, স্টপ-সাইন শনাক্তকরণ এবং GPS সংযোগের একটি ব্যাখ্যামূলক স্ক্যানার দৃশ্য।",
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
    languageNote: "ডিফল্ট ভাষা ইংরেজি। এই সুইচটি পাবলিক প্রজেক্ট ব্রিফের ভাষা বদলায়। গবেষণা নথির অ্যাক্সেস রক্ষণাবেক্ষণাধীন।",
  },
} as const;

const subsystemIcons = [Navigation, WalletCards, MapPinned, ShieldCheck] as const;

export default function AssistivePaper() {
  const [language, setLanguage] = useState<Language>("en");
  const [showMaintenance, setShowMaintenance] = useState(false);
  const copy = COPY[language];

  return (
    <section id="assistive-system" className="paper-showcase" aria-labelledby="assistive-system-title">
      <div className="paper-console">
        <div className="paper-toolbar">
          <span className="paper-lock"><i aria-hidden="true" /> ASSISTIVE VEHICLE / SYSTEM ONLINE</span>
          <div className="paper-language" role="group" aria-label={copy.languageLabel}>
            <span><Languages aria-hidden="true" size={15} /> {copy.languageLabel}</span>
            <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" aria-pressed={language === "bn"} onClick={() => setLanguage("bn")}>বাংলা</button>
          </div>
        </div>

        <div className="paper-grid">
          <AssistiveScanner
            title={copy.scannerTitle}
            description={copy.scannerDescription}
            note={copy.scannerNote}
          />

          <article className="paper-copy" lang={language} aria-live="polite">
            <span className="paper-eyebrow">{copy.eyebrow}</span>
            <h2 id="assistive-system-title">{copy.title}</h2>
            <p className="paper-lead">{copy.lead}</p>
            <div className="paper-actions">
              <button
                type="button"
                className="btn primary"
                aria-expanded={showMaintenance}
                aria-controls="publication-maintenance-message"
                onClick={() => setShowMaintenance(true)}
              >
                <Wrench aria-hidden="true" size={17} /> {copy.publicationAccess}
              </button>
              {showMaintenance && (
                <p className="maintenance-message" id="publication-maintenance-message" role="status">
                  {copy.maintenanceMessage}
                </p>
              )}
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
