import { FileDown, Mail } from "lucide-react";
import Photo from "@/components/Photo";
import ScopeInstrument from "@/components/ScopeInstrument";
import { PERSON, SITE_URL } from "@/lib/site";

export default function Hero() {
  return (
    <header className="hero">
      <div>
        <div className="idrow">
          <Photo name="headshot" className="headshot" alt="Portrait of Shad Ebny Wahid" sizes="(max-width: 480px) 96px, 128px" eager />
          <div className="label">Electrical &amp; Electronic Engineering<br />Jamalpur, Bangladesh</div>
        </div>
        <h1>Shad Ebny<span>Wahid</span></h1>
        <p className="lede">I build mixed-signal embedded instruments: MOSFET-switched transmit stages, analog receive front ends and real-time firmware, designed together and tested on the bench.</p>
        <p className="meta">
          B.Sc. in EEE, Jamalpur Science and Technology University · Batch EEE04, expected 2028<br />
          Seeking a funded research Master&apos;s (MASc or MRes) in power electronics and embedded hardware.
        </p>
        <p className="print-only print-contact">
          {[PERSON.email, PERSON.phoneDisplay, SITE_URL.replace("https://", ""), "github.com/saadw50", `ORCID ${PERSON.orcidId}`].map((item, i) => (
            <span key={item}>{i > 0 && " · "}<span className="nw">{item}</span></span>
          ))}
        </p>
        <p className="now"><span className="label">Now</span><span>Writing up per-element calibration of my 40 kHz transmit array for IEEE Sensors Letters.</span></p>
        <div className="actions">
          <a className="btn primary" href="/cv.pdf" download="Shad-Ebny-Wahid-CV.pdf">
            <FileDown size={16} aria-hidden="true" />Download CV <span className="btn-note">PDF, 85 KB</span>
          </a>
          <a className="btn" href={`mailto:${PERSON.email}`}><Mail size={16} aria-hidden="true" />Email me</a>
          <a className="btn" href="#research">View research</a>
          <a className="btn" href={PERSON.orcid}>ORCID</a>
        </div>
      </div>
      <ScopeInstrument />
    </header>
  );
}
