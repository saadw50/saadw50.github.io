import CopyEmail from "@/components/CopyEmail";
import { PERSON, updatedLabel } from "@/lib/site";

export function About() {
  return (
    <section id="about" aria-labelledby="about-h">
      <div className="sec-head">
        <h2 className="label" id="about-h">About</h2>
        <div className="prose">
          <p>Most of my hardware puts a switching stage next to a sensitive analog front end. In my ultrasonic imager, an ESP32 times eight MOSFET-driven 40 kHz transmit channels, and a TL072 front end with an envelope detector listens for the echo.</p>
          <p>Keeping the two apart shaped the design: transmit and receive sit on separate boards with a star ground. On the bench, I found and fixed a DC-bias fault in the envelope detector that was costing receive dynamic range.</p>
          <p>Outside the imager, I hand-wound an EI-core transformer and extracted its equivalent circuit from open- and short-circuit tests. As a paid PCB designer, I laid out a 4-layer wearable board with USB-C charging and a 500 mAh LiPo.</p>
          <p className="ask">I&apos;m looking for a funded research Master&apos;s (MASc or MRes) in power electronics and embedded hardware, starting after I graduate in 2028. I want to work on converter hardware where switching, layout and measurement decide the result.</p>
          <ul className="interests" aria-label="Research interests">
            <li>Power electronics</li><li>Mixed-signal hardware</li><li>Embedded sensing instrumentation</li><li>Array signal processing</li><li>PCB design</li>
          </ul>
          <div className="edu">
            <h3 className="label">Education</h3>
            <p><b>B.Sc. in Electrical and Electronic Engineering</b>, expected 2028</p>
            <p className="sub">Jamalpur Science and Technology University (formerly Bangamata Sheikh Fojilatunnesa Mujib Science and Technology University), Jamalpur · Session 2022–23, Batch EEE04</p>
            <p className="sub">Coursework: Power Electronics, Electrical Machines, Control Systems, Digital Signal Processing, Power Systems, Electromagnetics, Communication Engineering, Digital Electronics</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Publications() {
  return (
    <section id="publications" aria-labelledby="pub-h">
      <div className="sec-head">
        <h2 className="label" id="pub-h">Publications</h2>
        <div>
          <ul className="entries pubs">
            <li><span className="when"><span className="status">Under review</span></span><span className="cite">N. F. Iva, R. Khan, A. Aman, A. Ananto, <i>S. E. Wahid</i>, and M. M. Haque, “A unified assistive platform for visually impaired individuals: integrating autonomous navigation, currency recognition, and real-time GPS tracking,” submitted to the 29th International Conference on Computer and Information Technology (ICCIT), 2026.</span></li>
            <li><span className="when"><span className="status">In preparation</span></span><span className="cite"><i>S. E. Wahid</i>, J. R. G. Bristy, and M. M. Haque, “Per-element acoustic calibration of a 40 kHz ultrasonic transmit array,” targeting IEEE Sensors Letters, 2027.</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Toolkit() {
  return (
    <section id="skills" aria-labelledby="skills-h">
      <div className="sec-head">
        <h2 className="label" id="skills-h">Toolkit</h2>
        <div className="skills">
          <div><h3>Hardware</h3><p>Schematic capture, multi-layer PCB layout, mixed-signal design, grounding and EMI practice, analog front ends, MOSFET switching, magnetics, soldering, board bring-up and fault diagnosis</p></div>
          <div><h3>Embedded</h3><p>ESP32 and ESP32-S3, ESP8266, Arduino, FreeRTOS, SPI, I²C and UART, ADC acquisition chains, real-time timing control</p></div>
          <div><h3>Signal processing</h3><p>Delay-and-sum beamforming, envelope detection, CA-CFAR, Kalman filtering, time-of-flight estimation, experimental data analysis</p></div>
          <div><h3>Simulation &amp; software</h3><p>LTspice, MATLAB/Simulink, Proteus, Quantum ESPRESSO, KiCad, EasyEDA, Python, C/C++, Kotlin, Processing, LaTeX, Git, Linux</p></div>
        </div>
      </div>
    </section>
  );
}

export function Leadership() {
  return (
    <section id="leadership" aria-labelledby="lead-h">
      <div className="sec-head">
        <h2 className="label" id="lead-h">Leadership</h2>
        <div>
          <ul className="entries">
            <li><span className="when">Green Voice–JSTU</span><span><b>Joint General Secretary</b><span className="sub">Organisational communication, event coordination and programme delivery.</span></span></li>
            <li><span className="when">JSTU Robotics Club</span><span><b>Assistant Event Manager</b><span className="sub">Logistics, scheduling and volunteer coordination for robotics events.</span></span></li>
            <li><span className="when">Department of EEE</span><span><b>Class Representative, 1st year</b><span className="sub">Elected for one academic year. Also led project groups on two multi-member design projects and led lab groups.</span></span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h">
      <div className="sec-head">
        <h2 className="label" id="contact-h">Contact</h2>
        <div>
          <p className="prose" style={{ margin: "0 0 16px" }}>I&apos;m looking for a funded research Master&apos;s (MASc or MRes) in power electronics and embedded hardware, starting after I graduate in 2028. I&apos;d be glad to hear from professors and research groups in power electronics, mixed-signal hardware or embedded sensing. Email is the fastest way to reach me.</p>
          <div className="contact">
            <a className="btn primary mono" id="email" href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
            <CopyEmail value={PERSON.email} />
            <a className="btn mono" href={PERSON.phoneHref}>{PERSON.phoneDisplay}</a>
          </div>
          <div className="contact">
            <a className="btn" href="/cv.pdf">CV (PDF, 85 KB)</a>
            <a className="btn" href={PERSON.orcid}>ORCID</a>
            <a className="btn" href={PERSON.github}>GitHub</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>© 2026 {PERSON.name}</span>
        <span>Updated {updatedLabel()}</span>
        <span>Built with Next.js, hosted on GitHub Pages</span>
        <span className="print-only">saadw50.github.io · the interactive figures (Fig. 4 and the simulated scan) are online</span>
      </div>
    </footer>
  );
}
