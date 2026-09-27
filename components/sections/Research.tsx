import BeamExplorer from "@/components/BeamExplorer";
import Photo from "@/components/Photo";
import PingTiming from "@/components/figures/PingTiming";
import SignalChain from "@/components/figures/SignalChain";
import SignalChainVertical from "@/components/figures/SignalChainVertical";
import {
  ANGLES, APERTURES, AXIAL_RES_CM, BIN_MM, BIN_US, BINS, BLANK_US, BLIND_CM, BURST_CYCLES, BURST_US, C_AIR, DYN_RANGE_DB, F_TX, FLOOR_DB,
  LAMBDA_MM, MAX_RANGE_M, OFFSET_BINS, OFFSET_CM, OFFSET_US, RECORDS, RUN_CM, RUN_SAMPLES, SETTLE_MS, SETTLE_RANGE_M, STEP_DEG, SWEEP_DEG,
  TARGET_ANGLE_DEG, TARGET_MEAS_CM, TARGET_TRUE_CM, THRESH_LSB, WINDOW_MS, signed,
} from "@/lib/acoustics";

/* Table 1: every "Gives" value is computed in lib/acoustics.ts, where the arithmetic is written out.
   u() joins a number to its unit with a no-break space so a unit never wraps onto its own line. */
const u = (v: string | number, unit: string) => `${v} ${unit}`;
const TABLE_1: [string, string, string][] = [
  ["Carrier, sound speed", `${u(F_TX / 1000, "kHz")}, ${u(C_AIR, "m/s")}`, `λ = c/f = ${u(LAMBDA_MM.toFixed(2), "mm")}`],
  ["Burst", `${BURST_CYCLES} cycles = ${u(BURST_US, "µs")}`, `axial resolution ≈ ${u(AXIAL_RES_CM.toFixed(1), "cm")}`],
  ["Sweep", `−${SWEEP_DEG}° to +${SWEEP_DEG}°, ${STEP_DEG}° steps`, `${ANGLES} angles × ${APERTURES.length} apertures = ${u(RECORDS, "records")}`],
  ["RX blanking", u(BLANK_US, "µs"), `blind zone ≈ ${u(BLIND_CM.toFixed(1), "cm")}`],
  ["RX window", u(WINDOW_MS, "ms"), `max range ≈ ${u(MAX_RANGE_M.toFixed(1), "m")}, ${u(BINS, "bins")}`],
  ["Range bin", u(BIN_US, "µs"), `${u(BIN_MM.toFixed(1), "mm")} per bin`],
  ["Detection", `noise + ${u(THRESH_LSB, "LSB")}, ${RUN_SAMPLES} consecutive samples`, `ignores runs under ${u(RUN_SAMPLES, "bins")} (${u(RUN_CM.toFixed(1), "cm")})`],
  ["TX settle", u(SETTLE_MS, "ms"), `round trip to ${u(SETTLE_RANGE_M.toFixed(1), "m")}`],
  ["ADC", "MCP3008, differential", "10-bit samples over SPI"],
  ["Display", `${u(`−${Math.abs(FLOOR_DB)}`, "dB")} floor`, `${u(DYN_RANGE_DB, "dB")} image dynamic range`],
];

export default function Research() {
  return (
    <section id="research">
      <div className="sec-head">
        <div className="label">Research</div>
        <div>
          <h2>Low-cost ultrasonic <span className="nw">phased-array</span> imaging</h2>
          <p className="sec-sub">2025 – present · Undergraduate research · Manuscripts with J. R. G. Bristy and M. M. Haque</p>
        </div>
      </div>

      <div className="r-stack">
        <div className="r-intro">
          <div className="prose">
            <p>An air-coupled 40 kHz imager built from off-the-shelf parts. Eight transmitters steer a beam electronically, one receiver listens, and a sweep of angles becomes a 2D image. The question behind it: how far can careful hardware and signal processing push very low-cost transducers?</p>
            <ul>
              <li>Designed and built the transmit and receive electronics: MOSFET-driven transmit channels and TL072-based receive conditioning, on physically split boards with a star ground.</li>
              <li>Implemented cycle-accurate transmit beamforming under FreeRTOS with full-8, left-4 and right-4 sub-apertures.</li>
              <li>Built Python workflows for raw-waveform capture, metadata, quality control and plotting.</li>
              <li>Analysed multi-channel datasets for phase and amplitude consistency and characterised a systematic time-of-flight offset.</li>
              <li>Studied target localisation, grating-lobe suppression and 2D image formation under severe spatial-sampling limits.</li>
            </ul>
          </div>
          <aside className="r-side">
            <h3 className="label">Manuscripts from this platform</h3>
            <ol>
              <li>Per-element acoustic calibration (lead paper, in preparation, targeting IEEE Sensors Letters 2027)</li>
              <li>True-time-delay beamforming</li>
              <li>Raw-waveform angle–range sensing</li>
              <li>Transmit-timing error budget</li>
              <li>Material classification</li>
            </ol>
            <p className="earlier"><b>Earlier work, 2025:</b> a GPU shader-based real-time sonar display with delay-and-sum beamforming, MTI clutter cancellation, CA-CFAR detection and Kalman tracking, later extended to a fan-sector 2D imager.</p>
          </aside>
        </div>

        <figure className="fig">
          <figcaption className="fig-h"><span className="ref">Fig. 1</span><h3>Signal chain</h3></figcaption>
          <div className="scroll-x sc-h"><SignalChain /></div>
          <div className="sc-v"><SignalChainVertical /></div>
          <p className="cap">The ESP32 sets each channel&apos;s firing time, the burst reflects off the target, and the echo comes back through a receive chain on its own board. The highlighted stage is where the DC-bias fault in the bench notes was found and fixed.</p>
        </figure>

        <div className="duo" id="fig2">
          <figure>
            <Photo
              name="acoustic_array"
              className="shot"
              alt="Blue transmit PCB with eight ultrasonic transducers and MOSFETs, wired by ribbon cable, next to a smaller receive board with one transducer"
              sizes="(max-width: 860px) calc(100vw - 40px), 460px"
              zoomCaption="Fig. 2a. Transmit board with eight 40 kHz transducers and MOSFET drivers (back), and the separate receive board (front)."
            />
            <figcaption><b>Fig. 2a.</b> The hardware: transmit board with eight transducers and MOSFET drivers, and the separate receive board in front.</figcaption>
          </figure>
          <figure>
            <Photo
              name="acoustic_scan"
              className="shot"
              alt="Imaging tool showing acquisition settings and a colour heat map of a detected target"
              sizes="(max-width: 860px) calc(100vw - 40px), 580px"
              zoomCaption={`Fig. 2b. Background-normalised TX-diversity image from a ±${SWEEP_DEG}° sweep in ${STEP_DEG}° steps. Target at a known ${TARGET_TRUE_CM} cm; peak found at ${signed(TARGET_ANGLE_DEG)}°, ${TARGET_MEAS_CM} cm.`}
            />
            <figcaption><b>Fig. 2b.</b> A real image from my imaging tool: ±{SWEEP_DEG}° sweep in {STEP_DEG}° steps, target at a known {TARGET_TRUE_CM} cm, peak found at {signed(TARGET_ANGLE_DEG)}°, {TARGET_MEAS_CM} cm.</figcaption>
          </figure>
        </div>

        <BeamExplorer />

        <div className="r-two">
          <figure className="fig">
            <figcaption className="fig-h"><span className="ref">Table 1</span><h3>Acquisition settings and what they give</h3></figcaption>
            <div className="scroll-x">
              <table className="t1" role="table">
                <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Parameter</th><th scope="col" role="columnheader">Setting</th><th scope="col" role="columnheader">Gives</th></tr></thead>
                <tbody role="rowgroup">
                  {TABLE_1.map(([p, s, g]) => (
                    <tr role="row" key={p}><th scope="row" role="rowheader">{p}</th><td role="cell" className="n">{s}</td><td role="cell" className="g">{g}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="cap">Settings read from the imaging tool in Fig. 2b. Ranges use r = c·t/2 for the round trip.</p>
          </figure>
          <figure className="fig pipe-fig">
            <figcaption className="fig-h"><span className="ref">Pipeline</span><h3>How an image is formed</h3></figcaption>
            <ol className="pipe">
              <li><b>Capture background</b><span>Sweep the empty scene</span></li>
              <li><b>Capture target</b><span>Same sweep with the target in place</span></li>
              <li><b>Normalise</b><span>Remove the background response</span></li>
              <li><b>Combine apertures</b><span>FULL8, LEFT4 and RIGHT4 sweeps</span></li>
              <li><b>Compress</b><span>Log scale with a −30 dB floor</span></li>
              <li><b>Render</b><span>Sector image with depth and lateral axes</span></li>
            </ol>
          </figure>
        </div>

        <PingTiming />

        <div id="bench-notes">
          <div className="notes-h"><span className="ref">Bench notes</span><h3>Three findings from the bench</h3></div>
          <div className="notes">
            <article className="nc">
              <span className="label">Receive chain · fault fixed</span>
              <h4>Lost receive dynamic range</h4>
              <dl>
                <dt>Problem</dt><dd>Receive dynamic range was reduced.</dd>
                <dt>Cause</dt><dd>A DC-bias fault in the envelope-detector chain.</dd>
                <dt>Fix</dt><dd className="fix">Isolated the DC path with a series capacitor and re-selected the divider resistors.</dd>
                <dt>Result</dt><dd>Receive dynamic range restored.</dd>
              </dl>
            </article>
            <article className="nc">
              <span className="label">Layout · design choice</span>
              <h4>Keeping transmit switching out of the receiver</h4>
              <dl>
                <dt>Why</dt><dd>Eight switched MOSFET channels sit next to a sensitive TL072 front end, and crosstalk can couple both acoustically and electrically.</dd>
                <dt>Design</dt><dd className="fix">Transmit and receive on physically separate boards with a star ground.</dd>
              </dl>
            </article>
            <article className="nc">
              <span className="label">Calibration · offset characterised</span>
              <h4>A {OFFSET_CM} cm range offset at {TARGET_TRUE_CM} cm</h4>
              <dl>
                <dt>Problem</dt><dd>A target at a known {TARGET_TRUE_CM} cm imaged at {TARGET_MEAS_CM} cm (Fig. 2b).</dd>
                <dt>Finding</dt><dd>A systematic time-of-flight offset: {OFFSET_CM} cm of range is {Math.round(OFFSET_US)} µs of round-trip time, or {OFFSET_BINS.toFixed(1)} range bins (Fig. 4).</dd>
                <dt>Next</dt><dd>Identified a firmware-side correction. Fig. 2b was captured with the tool&apos;s TOF offset at 0 µs, so it shows the uncorrected reading.</dd>
                <dt>Channels</dt><dd>Per-channel analysis found TX1 the most accurate channel.</dd>
              </dl>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
