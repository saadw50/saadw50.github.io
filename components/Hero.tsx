import { ArrowRight, FileDown, Mail } from "lucide-react";
import Link from "next/link";
import Photo from "@/components/Photo";
import { PERSON, SITE_URL } from "@/lib/site";

export default function Hero() {
  return (
    <header className="hero hero-compact">
      <div className="hero-identity">
        <div className="idrow">
          <Photo name="headshot" className="headshot" alt="Portrait of Shad Ebny Wahid" sizes="(max-width: 480px) 96px, 128px" eager />
          <div className="label">Electrical &amp; Electronic Engineering<br />Jamalpur, Bangladesh</div>
        </div>
        <h1>Shad Ebny<span>Wahid</span></h1>
      </div>
      <div className="hero-summary">
        <p className="lede">I build complete embedded systems—from mixed-signal transducer hardware to vision-guided assistive vehicles—then test, measure and document what they can actually do.</p>
        <p className="meta">
          B.Sc. in EEE, Jamalpur Science and Technology University · Batch EEE04, expected 2028<br />
          Seeking a funded research Master&apos;s (MASc or MRes) in power electronics and embedded hardware.
        </p>
        <p className="print-only print-contact">
          {[PERSON.email, PERSON.phoneDisplay, SITE_URL.replace("https://", ""), "github.com/saadw50", `ORCID ${PERSON.orcidId}`].map((item, i) => (
            <span key={item}>{i > 0 && " · "}<span className="nw">{item}</span></span>
          ))}
        </p>
        <div className="actions">
          <Link className="btn primary" href="/#work">Explore the two systems <ArrowRight size={16} aria-hidden="true" /></Link>
          <a className="btn" href="/cv.pdf" download="Shad-Ebny-Wahid-CV.pdf">
            <FileDown size={16} aria-hidden="true" />Download CV <span className="btn-note">PDF, 50 KB</span>
          </a>
          <a className="btn" href={`mailto:${PERSON.email}`}><Mail size={16} aria-hidden="true" />Email me</a>
          <Link className="btn" href="/projects/">Complete project archive</Link>
        </div>
      </div>
    </header>
  );
}
