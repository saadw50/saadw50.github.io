import ScopeInstrument from "@/components/ScopeInstrument";
import { PERSON } from "@/lib/site";

export default function Hero() {
  return (
    <header className="hero">
      <div>
        <div className="idrow">
          <img className="headshot" src="/images/headshot.jpg" alt="Portrait of Shad Ebny Wahid" width={128} height={160} />
          <div className="label">Electrical &amp; Electronic Engineering<br />Jamalpur, Bangladesh</div>
        </div>
        <h1>Shad Ebny<span>Wahid</span></h1>
        <p className="lede">I build mixed-signal embedded instruments, where the analog front end, the power stage and the real-time firmware have to be designed together and proven on the bench.</p>
        <p className="meta">B.Sc. in EEE, Jamalpur Science and Technology University · Batch EEE04, expected 2028<br />Seeking a research-based Master&apos;s in power electronics and embedded hardware.</p>
        <p className="now"><span className="label">Now</span><span>Writing up per-element calibration of my 40 kHz transmit array for IEEE Sensors Letters.</span></p>
        <div className="actions">
          <a className="btn primary" href="/cv.pdf">Download CV</a>
          <a className="btn" href="#research">View research</a>
          <a className="btn" href={PERSON.orcid}>ORCID</a>
          <a className="btn" href={PERSON.github}>GitHub</a>
        </div>
      </div>
      <ScopeInstrument />
    </header>
  );
}
