type Project = { ref: string; status: string; title: string; text: string; tags: string[] };

/* Hardware and power work first: it is what a power-electronics supervisor looks for. */
const MAIN: Project[] = [
  { ref: "Magnetics · 2025", status: "Built & tested", title: "EI-core transformer design and characterisation", text: "Designed and hand-wound an EI-core transformer to specification, then ran open-circuit and short-circuit tests to extract equivalent-circuit parameters and evaluate losses and regulation.", tags: ["Magnetics", "OC/SC tests", "Power"] },
  { ref: "Renewable energy", status: "2nd place", title: "Single-axis solar tracking panel", text: "A solar panel that turns on one axis to follow the sun and raise energy yield. Placed second in the Department of EEE project competition.", tags: ["Solar PV", "Sun tracking", "Control"] },
];

const OTHER: Project[] = [
  { ref: "Simulation · 2025 – 2026", status: "Ongoing", title: "DFT study of Cs₃MX₃ under tensile strain", text: "SCF and band-structure calculations for Cs₃AuX₃, Cs₃PtX₃ and Cs₃PdX₃ across isotropic tensile strain states in Quantum ESPRESSO, with M. M. Haque.", tags: [] },
  { ref: "Machine learning · 2026", status: "Ongoing", title: "Bangladeshi currency recognition", text: "A machine-learning classifier that detects Taka banknotes and identifies their denomination.", tags: [] },
  { ref: "Networking · 2026", status: "Tool", title: "nat_audit.py, ISP transparency audit", text: "A Python tool that audits NAT and CGNAT deployment and BDIX peering across Bangladeshi ISPs and produces a comparative report.", tags: [] },
  { ref: "Android", status: "App", title: "Expense Tracker", text: "An Android app for tracking personal spending, written in Kotlin with Jetpack Compose.", tags: [] },
];

export default function Projects() {
  return (
    <section id="projects">
      <div className="sec-head">
        <div className="label">Projects</div>
        <div className="prose"><h2>Engineering projects</h2></div>
      </div>
      <div className="grid">
        {MAIN.map((p) => (
          <article className="card" key={p.title}>
            <div className="top"><span className="ref">{p.ref}</span><span className="status">{p.status}</span></div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </article>
        ))}
      </div>
      <h3 className="label other-h">Other work</h3>
      <ul className="other">
        {OTHER.map((p) => (
          <li key={p.title}>
            <span className="ref">{p.ref} · {p.status}</span>
            <b>{p.title}</b>
            <p>{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
