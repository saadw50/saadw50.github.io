import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import AssistiveProjectPreview from "@/components/AssistiveProjectPreview";
import ScopeInstrument from "@/components/ScopeInstrument";
import { DELAY_FIT, SWEEP_DEG } from "@/lib/acoustics";

export default function FlagshipProjects() {
  return (
    <section id="work" className="home-flagships" aria-labelledby="work-h">
      <div className="flagship-heading">
        <span className="label">Selected systems</span>
        <div>
          <h2 id="work-h">Two projects, built end to end</h2>
          <p>Start with the live visual. Open a project only when you want the measurements, architecture, paper and evidence limits.</p>
        </div>
      </div>

      <article className="flagship-row flagship-ultrasonic">
        <div className="flagship-visual"><ScopeInstrument compact /></div>
        <div className="flagship-copy">
          <span className="flagship-kicker">Flagship 01 · Transducer array</span>
          <h3>40 kHz ultrasonic imager</h3>
          <p>An air-coupled 2D imaging system built from the MOSFET-switched transmit stage and analog receive front end through real-time beam steering, capture and reconstruction.</p>
          <dl className="flagship-stats">
            <div><dt>split-board array</dt><dd>8 TX / 1 RX</dd></div>
            <div><dt>measured timing RMSE</dt><dd>{DELAY_FIT.rmseNs} ns</dd></div>
            <div><dt>real scan sector</dt><dd>±{SWEEP_DEG}°</dd></div>
          </dl>
          <Link className="flagship-link" href="/projects/ultrasonic-imager/">
            Explore transducer &amp; imager <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </article>

      <AssistiveProjectPreview />

      <div className="archive-callout">
        <span className="label">Beyond the flagships</span>
        <p>PCB work, paid design experience, magnetics, solar tracking, awards, tools and leadership are organised in the complete project archive.</p>
        <Link className="btn" href="/projects/">Browse all projects <ArrowUpRight aria-hidden="true" size={16} /></Link>
      </div>
    </section>
  );
}
