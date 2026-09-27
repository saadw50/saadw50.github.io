import BeamExplorer from "@/components/BeamExplorer";
import SignalChain from "@/components/figures/SignalChain";

export default function Research() {
  return (
    <section id="research">
      <div className="sec-head">
        <div className="label">Research</div>
        <div>
          <h2>Low-cost ultrasonic phased-array imaging</h2>
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
            <div className="label">Manuscripts from this platform</div>
            <ol>
              <li>Per-element acoustic calibration (lead paper, targeting IEEE Sensors Letters)</li>
              <li>True-time-delay beamforming</li>
              <li>Raw-waveform angle–range sensing</li>
              <li>Transmit-timing error budget</li>
              <li>Material classification</li>
            </ol>
            <p className="earlier"><b>Earlier work, 2025:</b> a GPU shader-based real-time sonar display with delay-and-sum beamforming, MTI clutter cancellation, CA-CFAR detection and Kalman tracking, later extended to a fan-sector 2D imager.</p>
          </aside>
        </div>

        <figure className="fig">
          <div className="fig-h"><span className="ref">Fig. 1</span><h3>Signal chain</h3></div>
          <div className="scroll-x"><SignalChain /></div>
          <p className="cap">The ESP32 sets each channel&apos;s firing time, the burst reflects off the target, and the echo comes back through a receive chain that lives on its own board. The highlighted stage is where the DC-bias fault in the bench notes below was found and fixed.</p>
        </figure>

        <div className="duo">
          <figure>
            <button className="zoom" type="button" data-full="/images/acoustic_array.jpg" data-cap="Fig. 2a. Transmit board with eight 40 kHz transducers and MOSFET drivers (back), and the separate receive board (front).">
              <img className="shot" src="/images/acoustic_array.jpg" alt="Blue transmit PCB with eight ultrasonic transducers and MOSFETs, wired by ribbon cable, next to a smaller receive board with one transducer" width={1600} height={1254} loading="lazy" />
            </button>
            <figcaption><b>Fig. 2a.</b> The hardware: transmit board with eight transducers and MOSFET drivers, and the separate receive board in front.</figcaption>
          </figure>
          <figure>
            <button className="zoom" type="button" data-full="/images/acoustic_scan.jpg" data-cap="Fig. 2b. Background-normalised TX-diversity image from a ±15° sweep in 0.5° steps. Target at a known 150 cm; peak found at −13.5°, 156.5 cm.">
              <img className="shot" src="/images/acoustic_scan.jpg" alt="Imaging tool showing acquisition settings and a colour heat map of a detected target" width={1500} height={930} loading="lazy" />
            </button>
            <figcaption><b>Fig. 2b.</b> A real image from my imaging tool: ±15° sweep in 0.5° steps, target at a known 150 cm, peak found at −13.5°, 156.5 cm.</figcaption>
          </figure>
        </div>

        <BeamExplorer />

        <div className="r-two">
          <figure className="fig">
            <div className="fig-h"><span className="ref">Table 1</span><h3>Acquisition settings and what they give</h3></div>
            <div className="scroll-x">
              <table className="t1">
                <thead><tr><th>Parameter</th><th>Setting</th><th>Gives</th></tr></thead>
                <tbody>
                  <tr><td>Carrier, sound speed</td><td className="n">40 kHz, 346.75 m/s</td><td className="g">λ = 8.67 mm (≈25 °C air)</td></tr>
                  <tr><td>Burst</td><td className="n">8 cycles = 200 µs</td><td className="g">axial resolution ≈ 3.5 cm</td></tr>
                  <tr><td>Sweep</td><td className="n">−15° to +15°, 0.5° steps</td><td className="g">61 beams per image</td></tr>
                  <tr><td>RX blanking</td><td className="n">500 µs</td><td className="g">blind zone ≈ 8.7 cm</td></tr>
                  <tr><td>RX window</td><td className="n">15 ms</td><td className="g">max range ≈ 2.6 m</td></tr>
                  <tr><td>Range bin</td><td className="n">50 µs</td><td className="g">8.7 mm per bin</td></tr>
                  <tr><td>Detection</td><td className="n">noise + 10 LSB, 3 samples</td><td className="g">rejects one-sample spikes</td></tr>
                  <tr><td>TX settle</td><td className="n">30 ms per angle</td><td className="g">echoes die out between bursts</td></tr>
                  <tr><td>ADC</td><td className="n">MCP3008, differential</td><td className="g">10-bit samples over SPI</td></tr>
                  <tr><td>Display</td><td className="n">−30 dB floor</td><td className="g">30 dB image dynamic range</td></tr>
                </tbody>
              </table>
            </div>
            <p className="cap">Settings read from the imaging tool in Fig. 2b. Ranges use r = c·t/2 for the round trip.</p>
          </figure>
          <figure className="fig">
            <div className="fig-h"><span className="ref">Pipeline</span><h3>How an image is formed</h3></div>
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

        <div>
          <div className="notes-h"><span className="ref">Bench notes</span><h3>Three faults found and fixed</h3></div>
          <div className="notes">
            <article className="nc">
              <span className="label">Receive chain</span>
              <h4>Lost receive dynamic range</h4>
              <dl>
                <dt>Problem</dt><dd>Receive dynamic range was reduced.</dd>
                <dt>Cause</dt><dd>A DC bias fault in the envelope-detector chain.</dd>
                <dt>Fix</dt><dd className="fix">Isolated the DC path with a series capacitor and re-selected the divider resistors.</dd>
                <dt>Result</dt><dd>Receive dynamic range restored.</dd>
              </dl>
            </article>
            <article className="nc">
              <span className="label">Layout</span>
              <h4>Transmit noise in the receiver</h4>
              <dl>
                <dt>Problem</dt><dd>Acoustic and electrical crosstalk from the transmit side into the receiver.</dd>
                <dt>Cause</dt><dd>Eight switched transmit channels sharing copper and a board with a sensitive analog front end.</dd>
                <dt>Fix</dt><dd className="fix">Split transmit and receive onto physically separate boards with a star-ground topology.</dd>
                <dt>Result</dt><dd>Crosstalk suppressed at the source.</dd>
              </dl>
            </article>
            <article className="nc">
              <span className="label">Calibration</span>
              <h4>Targets read 6.5 cm too far</h4>
              <dl>
                <dt>Problem</dt><dd>A target at a known 150 cm imaged at 156.5 cm.</dd>
                <dt>Cause</dt><dd>A systematic time-of-flight offset: +6.5 cm of range is ≈375 µs of round-trip time.</dd>
                <dt>Fix</dt><dd className="fix">A single firmware-side time-of-flight correction.</dd>
                <dt>Result</dt><dd>Offset characterised per channel, with TX1 the most accurate channel.</dd>
              </dl>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
