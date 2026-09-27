type Project = { ref: string; status: string; title: string; text: string; tags: string[] };

const PROJECTS: Project[] = [
  { ref: "Magnetics · 2025", status: "Built & tested", title: "EI-core transformer design and characterisation", text: "Designed and hand-wound an EI-core transformer to specification, then ran open-circuit and short-circuit tests to extract equivalent-circuit parameters and evaluate losses and regulation.", tags: ["Magnetics", "OC/SC tests", "Power"] },
  { ref: "Renewable energy", status: "2nd place", title: "Single-axis solar tracking panel", text: "A solar panel that turns on one axis to follow the sun and raise energy yield. Placed second in a university project competition.", tags: ["Solar PV", "Sun tracking", "Control"] },
  { ref: "Simulation · 2025 – 2026", status: "Ongoing", title: "DFT study of Cs₃MX₃ under tensile strain", text: "SCF and band-structure calculations for Cs₃AuX₃, Cs₃PtX₃ and Cs₃PdX₃ across isotropic tensile strain states, with a managed multi-strain convergence workflow. With M. M. Haque.", tags: ["Quantum ESPRESSO", "DFT", "M = Au, Pt, Pd"] },
  { ref: "Machine learning · 2026", status: "Ongoing", title: "Bangladeshi currency recognition", text: "A machine-learning classifier that detects Taka banknotes and identifies their denomination; it feeds the assistive platform paper under review.", tags: ["Computer vision", "Python"] },
  { ref: "Networking · 2026", status: "Tool", title: "nat_audit.py, ISP transparency audit", text: "A Python tool that audits NAT and CGNAT deployment and BDIX peering behaviour across Bangladeshi ISPs and produces a comparative report.", tags: ["Python", "NAT / CGNAT", "BDIX"] },
  { ref: "Android", status: "Play release prep", title: "Expense Tracker app", text: "An Android app for tracking personal spending, built with Jetpack Compose, Material 3 and an MVVM architecture.", tags: ["Kotlin", "Jetpack Compose", "MVVM"] },
];

export default function Projects() {
  return (
    <section id="projects">
      <div className="sec-head">
        <div className="label">Projects</div>
        <div className="prose"><h2>Engineering projects</h2></div>
      </div>
      <div className="grid">
        {PROJECTS.map((p) => (
          <article className="card" key={p.title}>
            <div className="top"><span className="ref">{p.ref}</span><span className="status">{p.status}</span></div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
