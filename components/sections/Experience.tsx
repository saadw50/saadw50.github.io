import WristbandArchitecture from "@/components/figures/WristbandArchitecture";
import { PERSON } from "@/lib/site";

export default function Experience() {
  return (
    <section id="experience">
      <div className="sec-head">
        <div className="label">Experience</div>
        <div className="prose"><h2>Paid work</h2></div>
      </div>
      <div className="roles">
        <article className="panel">
          <div className="split">
            <div>
              <span className="ref">2026 – present · Paid role, research team</span>
              <h3>PCB Designer, Early <span className="nw">Stroke-Risk</span> Detection Wristband</h3>
              <ul>
                <li>Designed the complete wristband board in KiCad: a compact 4-layer layout (signal, GND, 3.3 V, signal).</li>
                <li>Integrated an ESP32-S3 module, MAX30102 PPG sensor, single-lead ECG front-end and MPU-6050 IMU, with an OLED display, USB-C charging, microSD logging and a 500 mAh LiPo.</li>
                <li>Delivered a DRC-clean, manufacturing-ready design for the team&apos;s planned patient study.</li>
              </ul>
            </div>
            <figure className="arch">
              <figcaption className="label">System architecture</figcaption>
              <p className="swipe arch-swipe" aria-hidden="true">Swipe to see the whole diagram →</p>
              <div className="scroll-x"><WristbandArchitecture /></div>
            </figure>
          </div>
        </article>
        <div className="pair">
          <article className="panel">
            <span className="ref">2026 – present · Freelance</span>
            <h3>PCB Designer, Fiverr</h3>
            <p className="org">Schematic capture and multi-layer PCB layout for external clients, delivered with fabrication files in KiCad and EasyEDA.</p>
            <ol className="flow" aria-label="Design flow"><li>Brief</li><li>Schematic</li><li>Layout</li><li>DRC</li><li>Fab files</li></ol>
            <p className="link-row"><a href={PERSON.fiverr}>View my Fiverr profile</a></p>
          </article>
          <article className="panel">
            <span className="ref">Jamalpur Science and Technology University</span>
            <h3>Videographer and Production Assistant</h3>
            <p className="org">Produced official department and university documentary films on two occasions; the second was a paid commission.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
