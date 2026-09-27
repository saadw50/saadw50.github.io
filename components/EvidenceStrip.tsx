import Photo from "@/components/Photo";
import StackupMini from "@/components/figures/StackupMini";
import { OFFSET_US, TARGET_ANGLE_DEG, TARGET_MEAS_CM, TARGET_TRUE_CM, signed } from "@/lib/acoustics";

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
        <span className="ev-t">A 40 kHz array with a MOSFET-driven transmit board and a separate TL072 receive board on a star ground.</span>
        <span className="ev-go">Research →</span>
      </a>
      <a className="ev" href="#bench-notes">
        <span className="ev-media"><Photo name="thumb_scan" alt="" sizes="(max-width: 860px) 112px, 340px" /></span>
        <span className="ev-k">Measured</span>
        <b>Target at {TARGET_TRUE_CM} cm imaged at {TARGET_MEAS_CM} cm, {signed(TARGET_ANGLE_DEG)}°</b>
        <span className="ev-t">A systematic {Math.round(OFFSET_US)} µs time-of-flight offset. Per-channel analysis found TX1 the most accurate.</span>
        <span className="ev-go">Bench notes →</span>
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
