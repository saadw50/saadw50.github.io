import CopyEmail from "@/components/CopyEmail";
import { PERSON } from "@/lib/site";

export function About() {
  return (
    <section id="about">
      <div className="sec-head">
        <div className="label">About</div>
        <div className="prose">
          <p>I&apos;m an undergraduate electrical engineer who learns best at the bench. I design, fabricate and characterise my own hardware: I built a complete low-cost ultrasonic phased-array imaging platform, from schematic and transducer drive to image formation, and I&apos;m writing it up for publication.</p>
          <p>Alongside coursework I&apos;m the paid PCB designer on a wearable stroke-risk research project, take freelance PCB work, and have run first-principles DFT calculations on strained perovskite-type compounds.</p>
          <ul className="interests" aria-label="Research interests">
            <li>Power electronics</li><li>Mixed-signal hardware</li><li>Embedded sensing instrumentation</li><li>Array signal processing</li><li>PCB design</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education">
      <div className="sec-head">
        <div className="label">Education</div>
        <div>
          <ul className="entries">
            <li>
              <span className="when">2022 – 2028</span>
              <span>
                <b>B.Sc. in Electrical and Electronic Engineering</b>
                <span className="sub">Jamalpur Science and Technology University (formerly Bangamata Sheikh Fojilatunnesa Mujib Science and Technology University), Jamalpur · Session 2022–23, Batch EEE04</span>
                <span className="sub">Coursework: Power Electronics, Electrical Machines, Control Systems, Digital Signal Processing, Power Systems, Electromagnetics, Communication Engineering, Digital Electronics</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Publications() {
  return (
    <section id="publications">
      <div className="sec-head">
        <div className="label">Publications</div>
        <div>
          <ul className="entries">
            <li><span className="when">Under review</span><span className="cite">N. F. Iva, R. Khan, A. Aman, A. Ananto, <i>S. E. Wahid</i>, and M. M. Haque, “A unified assistive platform for visually impaired individuals: integrating autonomous navigation, currency recognition, and real-time GPS tracking,” submitted to the 29th International Conference on Computer and Information Technology, 2026.</span></li>
            <li><span className="when">In preparation</span><span className="cite"><i>S. E. Wahid</i>, J. R. G. Bristy, and M. M. Haque, “Per-element acoustic calibration of a 40 kHz ultrasonic transmit array,” targeting IEEE Sensors Letters, 2027.</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Toolkit() {
  return (
    <section id="skills">
      <div className="sec-head">
        <div className="label">Toolkit</div>
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
    <section id="leadership">
      <div className="sec-head">
        <div className="label">Leadership</div>
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
    <section id="contact">
      <div className="sec-head">
        <div className="label">Contact</div>
        <div>
          <p className="prose" style={{ margin: "0 0 16px" }}>I&apos;d be glad to hear from professors and research groups working on power electronics, mixed-signal hardware or embedded sensing.</p>
          <div className="contact">
            <code id="email">{PERSON.email}</code>
            <CopyEmail targetId="email" />
            <code>{PERSON.phoneDisplay}</code>
            <a className="btn" href="/cv.pdf">CV (PDF)</a>
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
      <div className="wrap">© 2026 Shad Ebny Wahid · Hosted on GitHub Pages</div>
    </footer>
  );
}
