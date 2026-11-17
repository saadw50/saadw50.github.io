import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import ProjectPageHeader from "@/components/ProjectPageHeader";
import AssistivePaper from "@/components/sections/AssistivePaper";
import { Footer } from "@/components/sections/Simple";

export const metadata: Metadata = {
  title: "Assistive car & vision platform · Paper 454 · Shad Ebny Wahid",
  description: "Bilingual interactive brief, reported results, subsystem map and evidence limits for ICRPSET 2026 Paper 454.",
  alternates: { canonical: "/projects/assistive-car/" },
};

export default function AssistiveCarPage() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main className="wrap" id="main" tabIndex={-1}>
        <ProjectPageHeader
          eyebrow="Flagship 02 · Assistive vehicle"
          title="Assistive car & vision platform"
          summary="A concise English/Bangla guide to the integrated prototype, the results reported in Paper 454, and the limits of the available validation."
        >
          <Link className="btn primary" href="#paper454">Open the bilingual brief</Link>
          <a className="btn" href="/papers/icrpset-2026-paper-454.pdf" target="_blank" rel="noreferrer">Open paper PDF</a>
          <Link className="btn" href="/projects/ultrasonic-imager/">View transducer project</Link>
        </ProjectPageHeader>

        <AssistivePaper />
      </main>
      <Footer />
    </>
  );
}
