"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as RKeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { BROADSIDE_GRATING_DEG, CLEAN_SWEEP_DEG, PITCH_MM, SWEEP_DEG } from "@/lib/acoustics";
import { C, LAM_MM, computeBeam, type Aperture, type BeamResult } from "@/lib/beam";

const RAD = Math.PI / 180;
const CX = 290, CY = 292, RR = 250, DBMIN = -40;
/* one decimal, rounding half away from zero (so −21.25° reads −21.3°), with a true minus sign */
const f1 = (v: number) => { const a = Math.round(Math.abs(v) * 10) / 10; return (a === 0 ? "" : v < 0 ? "−" : "+") + a.toFixed(1); };
const dbs = (v: number) => f1(v) + " dB";
const fx = (v: number) => +v.toFixed(2);
const HALF_LAMBDA = +(LAM_MM / 2).toFixed(3); // 4.334 mm
/* where the grating lobe lands when steered to the sweep edge: asin(sin 15° − λ/d) = asin(0.2588 − 0.5099) = −14.5° */
const GL_AT_EDGE_DEG = Math.asin(Math.sin(SWEEP_DEG * RAD) - LAM_MM / PITCH_MM) / RAD;
type Pitch = "real" | "half";

function niceMax(v: number) {
  const e = Math.pow(10, Math.floor(Math.log10(v))), f = v / e;
  const n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return n * e;
}

function DelayChart({ r, onHover, onLeave }: { r: BeamResult; onHover: (i: number, e: RPointerEvent<SVGSVGElement>) => void; onLeave: () => void }) {
  const x0 = 60, x1 = 566, yb = 128, yt = 26;
  const maxd = ((7 * r.s.d * 1e-3 * Math.sin(30 * RAD)) / C) * 1e6, top = niceMax(maxd);
  let step = niceMax(top / 4);
  if (top / step > 5) step = top / 5;
  const ticks: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);
  const slot = (x1 - x0) / 8, bwid = 22;
  const vals = r.del.map((v) => (v == null ? -1 : v));
  const maxv = Math.max(...vals), maxi = vals.indexOf(maxv);
  const present = r.del.filter((v): v is number => v != null), minv = Math.min(...present), mini = r.del.indexOf(minv);
  return (
    <svg
      className="dly"
      viewBox="0 0 580 160"
      role="img"
      aria-label={"Firing delay of each element in microseconds: " + r.del.map((v, i) => `E${i + 1} ${v == null ? "off" : v.toFixed(1)}`).join(", ") + "."}
      onPointerMove={(e) => {
        const i = (e.target as SVGElement).dataset?.i;
        if (i == null) { onLeave(); return; }
        onHover(+i, e);
      }}
      onPointerLeave={onLeave}
    >
      {ticks.map((v) => {
        const y = fx(yb - (v / top) * (yb - yt));
        return (
          <g key={v}>
            <line className="axis" x1={x0} y1={y} x2={x1} y2={y} />
            <text x={x0 - 8} y={y + 4} textAnchor="end">{+v.toFixed(1)}</text>
          </g>
        );
      })}
      {r.del.map((dv, i) => {
        const cxs = fx(x0 + slot * (i + 0.5));
        const hit = <rect x={fx(cxs - slot / 2)} y={yt - 10} width={fx(slot)} height={yb - yt + 30} fill="transparent" data-i={i} />;
        const lab = <text x={cxs} y={150} textAnchor="middle">{"E" + (i + 1)}</text>;
        if (dv == null) return <g key={i}>{lab}{hit}<text x={cxs} y={yb - 6} textAnchor="middle">off</text></g>;
        const h = (dv / top) * (yb - yt), bx = cxs - bwid / 2, by = yb - h, rr = Math.min(4, h);
        const d = h < 0.5
          ? `M${fx(bx)} ${yb - 1.5}h${bwid}v1.5h-${bwid}z`
          : `M${fx(bx)} ${yb}V${fx(by + rr)}Q${fx(bx)} ${fx(by)} ${fx(bx + rr)} ${fx(by)}H${fx(bx + bwid - rr)}Q${fx(bx + bwid)} ${fx(by)} ${fx(bx + bwid)} ${fx(by + rr)}V${yb}Z`;
        return (
          <g key={i}>
            {lab}
            {hit}
            <path className="bar" d={d} />
            {i === maxi && maxv > 0.05 && <text className="v" x={cxs} y={fx(by - 7)} textAnchor="middle">{maxv.toFixed(1) + " µs"}</text>}
            {i === mini && maxv > 0.05 && <text x={cxs} y={yb - 8} textAnchor="middle">first</text>}
          </g>
        );
      })}
      {maxv <= 0.05 && <text className="v" x={(x0 + x1) / 2} y={yb - 12} textAnchor="middle">θ₀ = 0°: all elements fire together</text>}
      <line className="axis-b" x1={x0} y1={yb} x2={x1} y2={yb} />
    </svg>
  );
}

type Tip = { kind: "polar"; i: number } | { kind: "delay"; i: number };

export default function BeamExplorer() {
  const [th0, setTh0] = useState(10);
  const [pitch, setPitch] = useState<Pitch>("real");
  const [ap, setAp] = useState<Aperture>("FULL8");
  const [probe, setProbe] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const [say, setSay] = useState("");
  const [k, setK] = useState(1); // text scale so labels stay readable when the figure is narrow
  const anchor = useRef<{ x: number; y: number } | null>(null);
  const plots = useRef<HTMLDivElement>(null);
  const polar = useRef<SVGSVGElement>(null);
  const tipEl = useRef<HTMLDivElement>(null);

  const d = pitch === "real" ? PITCH_MM : HALF_LAMBDA;
  const r = useMemo(() => computeBeam({ th0, d, ap }), [th0, d, ap]);

  /* radial dB scale: -40 dB at the centre, 0 dB (the steered beam) at the rim, extended above 0 dB
     when a grating lobe is stronger than the beam */
  const dbMax = r.peakDb > 0.05 ? Math.ceil(r.peakDb / 5) * 5 : 0;
  const rho = (db: number) => (RR * (Math.min(Math.max(db, DBMIN), dbMax) - DBMIN)) / (dbMax - DBMIN);
  const pt = (th: number, rad: number): [number, number] => [CX + rad * Math.sin(th * RAD), CY - rad * Math.cos(th * RAD)];
  const pathOf = (V: number[], close = false) => {
    let o = close ? "M" + CX + " " + CY : "";
    for (let i = 0; i < r.TH.length; i++) {
      const p = pt(r.TH[i], rho(V[i]));
      o += (i || close ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
    }
    return o + (close ? "Z" : "");
  };
  const rings = (dbMax > 0 ? [dbMax, 0, -10, -20, -30] : [0, -10, -20, -30]).map((db) => {
    const rad = rho(db), a = pt(-90, rad), b = pt(90, rad);
    return { db, rad, d: `M${fx(a[0])} ${fx(a[1])}A${fx(rad)} ${fx(rad)} 0 0 1 ${fx(b[0])} ${fx(b[1])}` };
  });
  const w0 = pt(-SWEEP_DEG, RR), w1 = pt(SWEEP_DEG, RR);
  const windowPath = `M${CX} ${CY}L${fx(w0[0])} ${fx(w0[1])}A${RR} ${RR} 0 0 1 ${fx(w1[0])} ${fx(w1[1])}Z`;
  const spokes: [number, number][] = [];
  for (let a = -90; a <= 90; a += 15) spokes.push(pt(a, RR));

  const lim = d <= LAM_MM / 2 ? 90 : Math.asin(Math.min(1, LAM_MM / (2 * d))) / RAD;
  const probeIdx = probe == null ? null : Math.max(0, Math.min(720, Math.round((probe + 90) / 0.25)));
  const probeEnd = probeIdx == null ? null : pt(r.TH[probeIdx], RR);
  const worst = r.gl[0];

  /* keep SVG text near 9-10 px on screen however narrow the figure gets */
  useEffect(() => {
    const el = polar.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.getBoundingClientRect().width || 580;
      setK(Math.min(2, Math.max(1, (580 / w) * 0.85)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* position the tooltip next to the pointer, or next to the probe tip when using the keyboard */
  useLayoutEffect(() => {
    const el = tipEl.current, box = plots.current;
    if (!el || !box || !tip) return;
    let a = anchor.current;
    if (!a && tip.kind === "polar" && probeEnd && polar.current) {
      const pr = polar.current.getBoundingClientRect(), sc = pr.width / 580;
      a = { x: pr.left + probeEnd[0] * sc, y: pr.top + probeEnd[1] * sc };
    }
    if (!a) return;
    const b = box.getBoundingClientRect();
    let x = a.x - b.left + 14, y = a.y - b.top + 14;
    const tw = el.offsetWidth, th = el.offsetHeight;
    if (x + tw > b.width) x = a.x - b.left - tw - 14;
    if (x < 0) x = 0;
    if (y + th > b.height) y = a.y - b.top - th - 14;
    el.style.left = x + "px";
    el.style.top = y + "px";
  });

  function hide() { setProbe(null); setTip(null); anchor.current = null; }
  function reading(i: number) { return `θ ${f1(r.TH[i])}°: beam ${dbs(r.CBd[i])}, array factor ${dbs(r.AFd[i])}, element ${dbs(r.ELd[i])}`; }

  function onPolarMove(e: RPointerEvent<SVGSVGElement>) {
    const rc = e.currentTarget.getBoundingClientRect(), sc = 580 / rc.width;
    const x = (e.clientX - rc.left) * sc, y = (e.clientY - rc.top) * sc, dx = x - CX, dy = CY - y;
    if (dy < -6 || Math.hypot(dx, dy) > RR + 26) { hide(); return; }
    const th = Math.max(-90, Math.min(90, Math.atan2(dx, Math.max(dy, 0)) / RAD));
    anchor.current = { x: e.clientX, y: e.clientY };
    setProbe(th);
    setTip({ kind: "polar", i: Math.max(0, Math.min(720, Math.round((th + 90) / 0.25))) });
  }
  function onPolarKey(e: RKeyboardEvent<SVGSVGElement>) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const t = Math.max(-90, Math.min(90, probe == null ? th0 : Math.round(probe) + (e.key === "ArrowRight" ? 1 : -1)));
      const i = Math.max(0, Math.min(720, Math.round((t + 90) / 0.25)));
      anchor.current = null;
      setProbe(t);
      setTip({ kind: "polar", i });
      setSay(reading(i));
    } else if (e.key === "Escape") hide();
  }

  const pm = pt(r.TH[r.im], rho(0));
  const hideMinorRings = k > 1.4;

  return (
    <figure className="fig" id="bx" style={{ ["--bxk" as string]: k.toFixed(2) }}>
      <figcaption className="fig-h"><span className="ref">Fig. 4</span><h3>Beam-steering explorer: grating lobes limit the sweep to about ±{SWEEP_DEG}°</h3></figcaption>
      <div className="bx">
        <div className="bx-ctl">
          <div>
            <div className="sl">
              <label htmlFor="bxSteer">Steering angle θ₀</label>
              <output id="bxSteerOut" htmlFor="bxSteer">{f1(th0)}°</output>
            </div>
            <input type="range" id="bxSteer" min={-30} max={30} step={0.5} value={th0} onChange={(e) => setTh0(+e.target.value)} />
          </div>
          <fieldset className="seg">
            <legend>Element pitch</legend>
            <div className="opts">
              <input type="radio" name="bxPitch" id="bxPreal" value="real" checked={pitch === "real"} onChange={() => setPitch("real")} />
              <label htmlFor="bxPreal">{PITCH_MM} mm real</label>
              <input type="radio" name="bxPitch" id="bxPhalf" value="half" checked={pitch === "half"} onChange={() => setPitch("half")} />
              <label htmlFor="bxPhalf">λ/2 ideal</label>
            </div>
          </fieldset>
          <fieldset className="seg">
            <legend>Transmit aperture</legend>
            <div className="opts">
              {(["FULL8", "LEFT4", "RIGHT4"] as Aperture[]).map((a) => (
                <Fragment key={a}>
                  <input type="radio" name="bxAp" id={"bxA" + a} value={a} checked={ap === a} onChange={() => setAp(a)} />
                  <label htmlFor={"bxA" + a}>{a}</label>
                </Fragment>
              ))}
            </div>
          </fieldset>
          <dl className="bx-read">
            <div><dt>Wavelength λ</dt><dd>{LAM_MM.toFixed(2)} mm</dd></div>
            <div><dt>Pitch d</dt><dd>{d.toFixed(d < 10 ? 2 : 1)} mm · {(d / LAM_MM).toFixed(2)} λ</dd></div>
            <div><dt>Beam, −3 dB width</dt><dd>{r.bw.toFixed(1)}° at {f1(r.TH[r.im])}°</dd></div>
            <div>
              <dt>Worst grating lobe</dt>
              <dd className="hl">{worst ? `${dbs(worst.db)} at ${f1(worst.th)}°` : "none"}</dd>
              {worst && worst.db > 0 && <dd className="warn">stronger than the beam</dd>}
            </div>
            <div><dt>Largest clean sweep</dt><dd>{lim >= 90 ? "±90° (no grating lobes)" : "±" + lim.toFixed(1) + "°"}</dd></div>
            <div><dt>Delay step Δτ</dt><dd>{((d * 1e-3 * Math.abs(Math.sin(th0 * RAD))) / C * 1e6).toFixed(2)} µs</dd></div>
          </dl>
        </div>
        <div className="bx-plots" ref={plots}>
          <div className="legend" aria-hidden="true">
            <span><i style={{ borderColor: "var(--c1)" }}></i>Beam (array × element)</span>
            <span><i style={{ borderColor: "var(--c2)" }}></i>Array factor</span>
            <span><i style={{ borderColor: "var(--c3)" }}></i>Element pattern</span>
            <span><svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill="var(--panel)" stroke="var(--c1)" strokeWidth="2" /></svg>Grating lobe</span>
            <span><span className="win"></span>±{SWEEP_DEG}° imaging window</span>
          </div>
          <svg
            className="pol"
            ref={polar}
            viewBox="0 0 580 318"
            tabIndex={0}
            role="img"
            aria-label={`Polar beam pattern from minus 90 to plus 90 degrees, levels relative to the steered beam. Steered to ${f1(th0)} degrees, the worst grating lobe is ${worst ? dbs(worst.db) + " at " + f1(worst.th) + " degrees" : "absent"}. Use the left and right arrow keys to read the level at any angle.`}
            onPointerMove={onPolarMove}
            onPointerLeave={hide}
            onKeyDown={onPolarKey}
            onBlur={hide}
          >
            <path className="winw" d={windowPath} />
            {rings.map((g) => (
              <g key={g.db}>
                <path className={g.db === dbMax ? "grid-o" : g.db === 0 ? "grid-z" : "grid"} d={g.d} />
                {!(hideMinorRings && (g.db === -10 || g.db === -20)) && (
                  <text x={fx(CX + g.rad)} y={CY + 16} textAnchor="middle">{g.db === 0 ? (dbMax > 0 ? "0 beam" : hideMinorRings ? "0" : "0 dB") : f1(g.db).replace(".0", "")}</text>
                )}
              </g>
            ))}
            {spokes.map((p, i) => <line key={i} className="grid" x1={CX} y1={CY} x2={fx(p[0])} y2={fx(p[1])} />)}
            {[-90, -60, -30, 0, 30, 60, 90].map((a) => {
              const q = pt(a, RR + 16);
              const x = a === -90 ? CX - RR - 6 : a === 90 ? CX + RR + 6 : q[0];
              /* ±90° sit just above the baseline so they clear the dB ring labels below it */
              const y = a === -90 || a === 90 ? CY - 6 : q[1] + 4;
              return <text key={a} x={fx(x)} y={fx(y)} textAnchor={a === -90 ? "end" : a === 90 ? "start" : "middle"}>{(a > 0 ? "+" : a < 0 ? "−" : "") + Math.abs(a) + "°"}</text>;
            })}
            <path className="a-cb" d={pathOf(r.CBd, true)} />
            <path className="l-el" d={pathOf(r.ELd)} />
            <path className="l-af" d={pathOf(r.AFd)} />
            <path className="l-cb" d={pathOf(r.CBd)} />
            <g>
              <circle className="mk" cx={fx(pm[0])} cy={fx(pm[1])} r={5} />
              {r.gl.map((g, idx) => {
                const p = pt(g.th, rho(g.db));
                let label = null;
                if (g.db > -32) {
                  /* labels near the rim go inside the curve so they never sit on the angle labels */
                  let rq = rho(g.db) + 14;
                  if (rq > RR - 24) rq = rho(g.db) - 22;
                  const q = pt(g.th, rq), anc = g.th < -3 ? "end" : g.th > 3 ? "start" : "middle";
                  const txt = dbs(g.db), len = txt.length * 6.6 * k;
                  let tx = q[0];
                  if (anc === "end" && tx - len < 4) tx = 4 + len;
                  if (anc === "start" && tx + len > 576) tx = 576 - len;
                  label = <text className="gl" x={fx(tx)} y={fx(q[1] + 4)} textAnchor={anc}>{txt}</text>;
                }
                return <g key={idx}><circle className="mk-g" cx={fx(p[0])} cy={fx(p[1])} r={4.5} />{label}</g>;
              })}
            </g>
            <line className="probe" x1={CX} y1={CY} x2={probeEnd ? fx(probeEnd[0]) : CX} y2={probeEnd ? fx(probeEnd[1]) : CY - RR} visibility={probeEnd ? "visible" : "hidden"} />
          </svg>
          <p className="vh" aria-live="polite">{say}</p>
          <div className="label dly-h">Firing delay per element, <span className="nt">µs</span></div>
          <DelayChart
            r={r}
            onHover={(i, e) => { anchor.current = { x: e.clientX, y: e.clientY }; setTip({ kind: "delay", i }); }}
            onLeave={() => { if (tip?.kind === "delay") setTip(null); }}
          />
          <div className="tip" ref={tipEl} hidden={!tip} aria-hidden="true">
            {tip?.kind === "polar" && (
              <>
                <div className="tip-h"><b>θ = {f1(r.TH[tip.i])}°</b></div>
                <div className="row"><i style={{ borderColor: "var(--c1)" }}></i><b>{dbs(r.CBd[tip.i])}</b><span>beam</span></div>
                <div className="row"><i style={{ borderColor: "var(--c2)" }}></i><b>{dbs(r.AFd[tip.i])}</b><span>array factor</span></div>
                <div className="row"><i style={{ borderColor: "var(--c3)" }}></i><b>{dbs(r.ELd[tip.i])}</b><span>element</span></div>
              </>
            )}
            {tip?.kind === "delay" && (
              <>
                <b>{r.del[tip.i] == null ? "off" : r.del[tip.i]!.toFixed(2) + " µs"}</b>
                <span className="dim">{"  E" + (tip.i + 1) + (r.del[tip.i] == null ? " is not in this aperture" : " fires after the first")}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <details className="tv">
        <summary>Show the numbers</summary>
        <div className="tv-grid">
          <table>
            <thead><tr><th scope="col">Element</th><th scope="col">Fires at</th></tr></thead>
            <tbody>
              {r.del.map((v, i) => <tr key={i}><td>{"E" + (i + 1)}</td><td>{v == null ? "off" : v.toFixed(2) + " µs"}</td></tr>)}
            </tbody>
          </table>
          <table>
            <thead><tr><th scope="col">Lobe</th><th scope="col">Angle</th><th scope="col">Level vs beam</th></tr></thead>
            <tbody>
              <tr><td>Beam</td><td>{f1(r.TH[r.im])}°</td><td>0.0 dB</td></tr>
              {r.gl.map((g, idx) => <tr key={idx}><td>Grating</td><td>{f1(g.th)}°</td><td>{dbs(g.db)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </details>
      <p className="cap">
        Computed live from c = 346.75 m/s and f = 40 kHz, the values in my imaging tool. Each element fires τ<sub>n</sub> = n·d·sin θ₀ / c after the first.
        Grating lobes sit at sin θ = sin θ₀ ± m·λ/d. With the real pitch d = {PITCH_MM} mm = {(PITCH_MM / LAM_MM).toFixed(2)} λ they exist even at broadside, at ±{BROADSIDE_GRATING_DEG.toFixed(1)}° (the dashed lines in the measured sweep, Fig. 3c).
        Keeping them out of a symmetric sector needs sin θ<sub>max</sub> ≤ λ/2d, so θ<sub>max</sub> = {CLEAN_SWEEP_DEG.toFixed(1)}°, and the imager&apos;s ±{SWEEP_DEG}° sweep sits right at that limit:
        steered to ±{SWEEP_DEG}°, the grating lobe falls near ∓{Math.abs(GL_AT_EDGE_DEG).toFixed(1)}°, just inside the window, and is about as strong as the beam.
        Levels are relative to the steered beam. Element pattern: circular piston with an assumed 8 mm radius (16 mm cans), so lobe levels are model values.
      </p>
    </figure>
  );
}
