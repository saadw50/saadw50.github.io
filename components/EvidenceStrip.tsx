import Photo from "@/components/Photo";
import StackupMini from "@/components/figures/StackupMini";
import { DELAY_FIT, PITCH_MM, TX1_RUN } from "@/lib/acoustics";

/* Three cards right under the hero: something built, something measured, something designed.
   Every number comes from lib/acoustics.ts or the facts in the brief. */
export default function EvidenceStrip() {
  return (
    <div className="evidence">
      <h2 className="vh">Selected work</h2>
      <a className="ev" href="#fig2">
        <span className="ev-media"><Photo name="thumb_array" alt="" sizes="(max-width: 860px) 112px, 340px" /></span>
        <span className="ev-k">Built</span>
        <b>8 TX / 1 RX ultrasonic imager</b>
        <span className="ev-t">A 40 kHz array at {PITCH_MM} mm pitch: a MOSFET-driven transmit board and a separate TL072 receive board on a star ground.</span>
        <span className="ev-go">Research →</span>
      </a>
      <a className="ev" href="#fig3">
        <span className="ev-media plot-thumb"><Photo name="thumb_delay" alt="" sizes="(max-width: 860px) 112px, 340px" /></span>
        <span className="ev-k">Measured</span>
        <b>Firing delays within {DELAY_FIT.rmseNs} ns of the true-time-delay schedule</b>
        <span className="ev-t">Slope {DELAY_FIT.slope}, R² = {DELAY_FIT.r2}. TX1 read a known {TX1_RUN.targetCm} cm as {TX1_RUN.meanCm.toFixed(2)} cm, SD {TX1_RUN.sdCm} cm.</span>
        <span className="ev-go">Measured results →</span>
      </a>
      <a className="ev" href="#boards">
        <span className="ev-media diagram"><StackupMini decorative /></span>
        <span className="ev-k">Designed</span>
        <b>4-layer wearable board, 46 × 36 mm</b>
        <span className="ev-t">86 parts, DRC clean. Paid PCB design for a stroke-risk research project.</span>
        <span className="ev-go">PCB design →</span>
      </a>
    </div>
  );
}
