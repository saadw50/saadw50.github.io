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
              <h3>PCB Designer, Early Stroke-Risk Detection Wristband</h3>
              <ul>
                <li>Designed the complete wristband board in KiCad: a compact 4-layer layout with dedicated ground and 3.3 V planes.</li>
                <li>Integrated an ESP32-S3 module with antenna keep-out, MAX30102 PPG sensor, single-lead ECG front-end and MPU-6050 IMU, with OLED display, USB-C charging, microSD logging and LiPo power.</li>
                <li>Delivered a DRC-clean, manufacturing-ready package (Gerbers, BOM, pick-and-place) for the team&apos;s planned patient data-collection study.</li>
              </ul>
              <div className="chips"><span>46 × 36 mm</span><span>4-layer</span><span>86 parts</span><span>DRC clean</span></div>
            </div>
            <figure className="arch">
              <span className="label">System architecture</span>
              <WristbandArchitecture />
            </figure>
          </div>
        </article>
        <div className="pair">
          <article className="panel">
            <span className="ref">2026 – present · Freelance</span>
            <h3>PCB Designer, Fiverr</h3>
            <p className="org" style={{ margin: 0 }}>Schematic capture and multi-layer PCB layout for external clients, delivered with fabrication files in KiCad and EasyEDA.</p>
            <ol className="flow" aria-label="Design flow"><li>Brief</li><li>Schematic</li><li>Layout</li><li>DRC</li><li>Fab files</li></ol>
            <p style={{ margin: "16px 0 0" }}><a href={PERSON.fiverr}>View my Fiverr profile</a></p>
          </article>
          <article className="panel">
            <span className="ref">Jamalpur Science and Technology University</span>
            <h3>Videographer and Production Assistant</h3>
            <p className="org" style={{ margin: 0 }}>Produced official department and university documentary films on two occasions; the second was a paid commission.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
