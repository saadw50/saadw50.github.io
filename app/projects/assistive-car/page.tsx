import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import ProjectPageHeader from "@/components/ProjectPageHeader";
import AssistivePaper from "@/components/sections/AssistivePaper";
import { Footer } from "@/components/sections/Simple";

export const metadata: Metadata = {
  title: "Assistive car & vision platform · Shad Ebny Wahid",
  description: "Bilingual interactive brief, reported results, subsystem map and evidence limits for an integrated assistive vehicle prototype.",
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
          summary="A concise English/Bangla guide to the integrated prototype, its reported results, and the limits of the available validation."
        >
          <Link className="btn primary" href="#assistive-system">Open the bilingual system brief</Link>
          <Link className="btn" href="/projects/ultrasonic-imager/">View transducer project</Link>
        </ProjectPageHeader>

        <AssistivePaper />
      </main>
      <Footer />
    </>
  );
}
