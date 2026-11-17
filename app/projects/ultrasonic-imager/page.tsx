import type { Metadata } from "next";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";
import Nav from "@/components/Nav";
import ProjectPageHeader from "@/components/ProjectPageHeader";
import ScopeInstrument from "@/components/ScopeInstrument";
import Research from "@/components/sections/Research";
import { Footer } from "@/components/sections/Simple";

export const metadata: Metadata = {
  title: "40 kHz ultrasonic transducer array & 2D imager · Shad Ebny Wahid",
  description: "Hardware, measurements, beamforming, imaging results and evidence boundaries for an 8-TX, 1-RX air-coupled ultrasonic imager.",
  alternates: { canonical: "/projects/ultrasonic-imager/" },
};

export default function UltrasonicImagerPage() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main className="wrap" id="main" tabIndex={-1}>
        <ProjectPageHeader
          eyebrow="Flagship 01 · Transducer array"
          title="40 kHz transducer array & 2D imager"
          summary="The complete technical record: split-board mixed-signal hardware, true-time-delay steering, measured timing, real scans, reconstruction settings, limitations and bench findings."
        >
          <Link className="btn primary" href="#research">Read the technical record</Link>
          <Link className="btn" href="/projects/assistive-car/">Next: assistive car</Link>
        </ProjectPageHeader>

        <section className="project-live" aria-labelledby="live-scan-h">
          <div className="project-live-head">
            <span className="label">Interactive orientation</span>
            <div>
              <h2 id="live-scan-h">See the scan loop before the measurements</h2>
              <p>This browser instrument is explicitly simulated. The detailed record below separates it from the real hardware, measured plots and captured images.</p>
            </div>
          </div>
          <ScopeInstrument />
        </section>

        <Research />
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
