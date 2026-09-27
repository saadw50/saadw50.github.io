import StackupDiagram from "@/components/figures/StackupDiagram";

export default function Boards() {
  return (
    <section id="boards">
      <div className="sec-head">
        <div className="label">PCB design</div>
        <div>
          <h2>Boards I&apos;ve designed and built</h2>
          <p className="sec-sub">Schematic to fabricated, populated and debugged hardware.</p>
        </div>
      </div>
      <div className="boards">
        <div className="pairb">
          <article className="bc">
            <button className="zoom" type="button" data-full="/images/board_tx.jpg" data-cap="8-channel transmit board: eight 40 kHz transducers, each switched by its own MOSFET channel.">
              <img src="/images/board_tx.jpg" alt="Blue PCB with a row of eight silver ultrasonic transducers above eight TO-220 MOSFETs and rows of resistors" width={1400} height={814} loading="lazy" />
            </button>
            <div className="bc-t">
              <span className="ref">Ultrasonic array · transmit</span>
              <h3>8-channel transmit board</h3>
              <p>Eight 40 kHz transducers in one row, each switched by its own MOSFET channel with a pull-down, driven from the ESP32 over a ribbon cable.</p>
              <div className="chips"><span>8 channels</span><span>TO-220 MOSFETs</span><span>Through-hole</span></div>
            </div>
          </article>
          <article className="bc">
            <button className="zoom" type="button" data-full="/images/board_rx.jpg" data-cap="Receive front-end board: one 40 kHz receiver, TL072 conditioning, envelope detection and on-board regulation.">
              <img src="/images/board_rx.jpg" alt="Small blue PCB with one ultrasonic receiver, an 8-pin IC socket, a regulator and a large electrolytic capacitor" width={1100} height={1075} loading="lazy" />
            </button>
            <div className="bc-t">
              <span className="ref">Ultrasonic array · receive</span>
              <h3>Receive front-end board</h3>
              <p>One 40 kHz receiver with TL072 conditioning, envelope detection and on-board regulation, kept separate to keep switching noise out.</p>
              <div className="chips"><span>TL072</span><span>Envelope detector</span><span>Split from TX</span></div>
            </div>
          </article>
        </div>
        <article className="bwide">
          <div className="vis"><StackupDiagram /></div>
          <div className="bc-t">
            <span className="ref">Wearable · paid research work</span>
            <h3>Stroke-risk wristband board</h3>
            <p>A 46 × 36 mm four-layer board: ground and 3.3 V planes in the middle, the ESP32-S3 module, USB-C charging and microSD on top, and the PPG, ECG and IMU sensors on the skin side. Layout renders are available on request.</p>
            <div className="chips"><span>4-layer</span><span>1.0 mm</span><span>86 parts</span><span>DRC clean</span></div>
          </div>
        </article>
      </div>
    </section>
  );
}
