"use client";

import { Fragment, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type KeyboardEvent as RKeyboardEvent } from "react";
import { C, LAM_MM, computeBeam, type Aperture, type BeamResult } from "@/lib/beam";

const RAD = Math.PI / 180;
const CX = 290, CY = 292, RR = 250, DBMIN = -40;
const rho = (db: number) => (RR * (Math.max(db, DBMIN) - DBMIN)) / -DBMIN;
const pt = (th: number, r: number): [number, number] => [CX + r * Math.sin(th * RAD), CY - r * Math.cos(th * RAD)];
const f1 = (v: number) => (v < 0 ? "−" : v > 0 ? "+" : "") + Math.abs(v).toFixed(1);
const dbs = (v: number) => (v < 0 ? "−" : "") + Math.abs(v).toFixed(1) + " dB";
const fx = (v: number) => +v.toFixed(2);

function pathOf(TH: number[], V: number[], close = false) {
  let o = close ? "M" + CX + " " + CY : "";
  for (let i = 0; i < TH.length; i++) {
    const p = pt(TH[i], rho(V[i]));
    o += (i || close ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
  }
  return o + (close ? "Z" : "");
}

/* static polar grid, computed once */
const W0 = pt(-15, RR), W1 = pt(15, RR);
const WINDOW_PATH = `M${CX} ${CY}L${fx(W0[0])} ${fx(W0[1])}A${RR} ${RR} 0 0 1 ${fx(W1[0])} ${fx(W1[1])}Z`;
const RINGS = [0, -10, -20, -30].map((db) => {
  const r = rho(db), a = pt(-90, r), b = pt(90, r);
  return { db, r, d: `M${fx(a[0])} ${fx(a[1])}A${r} ${r} 0 0 1 ${fx(b[0])} ${fx(b[1])}` };
});
const SPOKES: [number, number][] = [];
for (let a = -90; a <= 90; a += 15) SPOKES.push(pt(a, RR));
const ANGLE_LABELS: { a: number; x: number; y: number; anchor: "start" | "middle" | "end" }[] = [];
for (let a = -90; a <= 90; a += 30) {
  const q = pt(a, RR + 16);
  if (a === -90) ANGLE_LABELS.push({ a, x: CX - RR - 6, y: CY + 4, anchor: "end" });
  else if (a === 90) ANGLE_LABELS.push({ a, x: CX + RR + 6, y: CY + 4, anchor: "start" });
  else ANGLE_LABELS.push({ a, x: fx(q[0]), y: fx(q[1] + 4), anchor: "middle" });
}

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
      aria-label="Bar chart of the firing delay of each of the eight elements in microseconds."
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
      <text x={x0 - 8} y={14} textAnchor="end">µs</text>
      {r.del.map((dv, i) => {
        const cxs = fx(x0 + slot * (i + 0.5));
        const hit = <rect x={fx(cxs - slot / 2)} y={yt - 10} width={fx(slot)} height={yb - yt + 30} fill="transparent" data-i={i} />;
        const lab = <text x={cxs} y={148} textAnchor="middle">{"E" + (i + 1)}</text>;
        if (dv == null) {
          return (
            <g key={i}>{lab}{hit}<text x={cxs} y={yb - 6} textAnchor="middle">off</text></g>
          );
        }
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
  const [pitch, setPitch] = useState<"16" | "4.334">("16");
  const [ap, setAp] = useState<Aperture>("FULL8");
  const [probe, setProbe] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const anchor = useRef<{ x: number; y: number } | null>(null);
  const plots = useRef<HTMLDivElement>(null);
  const polar = useRef<SVGSVGElement>(null);
  const tipEl = useRef<HTMLDivElement>(null);

  const d = +pitch;
  const r = useMemo(() => computeBeam({ th0, d, ap }), [th0, d, ap]);

  const lim = d <= LAM_MM / 2 ? 90 : Math.asin(Math.min(1, LAM_MM / (2 * d))) / RAD;
  const probeIdx = probe == null ? null : Math.max(0, Math.min(720, Math.round((probe + 90) / 0.25)));
  const probeEnd = probeIdx == null ? null : pt(r.TH[probeIdx], RR);

  /* position the tooltip next to the pointer (or the probe tip when using the keyboard) */
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
      const t = Math.max(-90, Math.min(90, probe == null ? th0 : probe + (e.key === "ArrowRight" ? 1 : -1)));
      anchor.current = null;
      setProbe(t);
      setTip({ kind: "polar", i: Math.max(0, Math.min(720, Math.round((t + 90) / 0.25))) });
    } else if (e.key === "Escape") hide();
  }

  const pm = pt(r.TH[r.im], rho(0));

  return (
    <figure className="fig" id="bx">
      <div className="fig-h"><span className="ref">Fig. 3</span><h3>Beam-steering explorer: why the sweep stops at ±15°</h3></div>
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
              <input type="radio" name="bxPitch" id="bxP16" value="16" checked={pitch === "16"} onChange={() => setPitch("16")} />
              <label htmlFor="bxP16">16 mm cans</label>
              <input type="radio" name="bxPitch" id="bxP4" value="4.334" checked={pitch === "4.334"} onChange={() => setPitch("4.334")} />
              <label htmlFor="bxP4">λ/2 ideal</label>
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
            <div><dt>Main lobe, −3 dB width</dt><dd>{r.bw.toFixed(1)}°</dd></div>
            <div><dt>Worst grating lobe</dt><dd className="hl">{r.gl.length ? dbs(r.gl[0].db) + " at " + f1(r.gl[0].th) + "°" : "none"}</dd></div>
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
            <span><span className="win"></span>±15° imaging window</span>
          </div>
          <svg
            className="pol"
            ref={polar}
            viewBox="0 0 580 318"
            tabIndex={0}
            role="img"
            aria-label="Polar beam pattern in decibels from minus 90 to plus 90 degrees. Hover or use the arrow keys to read the level at any angle."
            onPointerMove={onPolarMove}
            onPointerLeave={hide}
            onKeyDown={onPolarKey}
            onBlur={hide}
          >
            <path className="winw" d={WINDOW_PATH} />
            {RINGS.map((g) => (
              <g key={g.db}>
                <path className={g.db === 0 ? "grid-o" : "grid"} d={g.d} />
                <text x={CX + g.r} y={CY + 16} textAnchor="middle">{g.db === 0 ? "0 dB" : "−" + -g.db}</text>
              </g>
            ))}
            {SPOKES.map((p, i) => <line key={i} className="grid" x1={CX} y1={CY} x2={fx(p[0])} y2={fx(p[1])} />)}
            {ANGLE_LABELS.map((l) => (
              <text key={l.a} x={l.x} y={l.y} textAnchor={l.anchor}>{(l.a > 0 ? "+" : l.a < 0 ? "−" : "") + Math.abs(l.a) + "°"}</text>
            ))}
            <path className="a-cb" d={pathOf(r.TH, r.CBd, true)} />
            <path className="l-el" d={pathOf(r.TH, r.ELd)} />
            <path className="l-af" d={pathOf(r.TH, r.AFd)} />
            <path className="l-cb" d={pathOf(r.TH, r.CBd)} />
            <g>
              <circle className="mk" cx={fx(pm[0])} cy={fx(pm[1])} r={5} />
              {r.gl.map((g, k) => {
                const p = pt(g.th, rho(g.db));
                let label = null;
                if (g.db > -32) {
                  const q = pt(g.th, rho(g.db) + 14), anc = g.th < -3 ? "end" : g.th > 3 ? "start" : "middle";
                  const txt = dbs(g.db), len = txt.length * 6.6;
                  let tx = q[0];
                  if (anc === "end" && tx - len < 4) tx = 4 + len;
                  if (anc === "start" && tx + len > 576) tx = 576 - len;
                  label = <text className="gl" x={fx(tx)} y={fx(q[1] + 4)} textAnchor={anc}>{txt}</text>;
                }
                return (
                  <g key={k}>
                    <circle className="mk-g" cx={fx(p[0])} cy={fx(p[1])} r={4.5} />
                    {label}
                  </g>
                );
              })}
            </g>
            <line className="probe" x1={CX} y1={CY} x2={probeEnd ? fx(probeEnd[0]) : CX} y2={probeEnd ? fx(probeEnd[1]) : CY - RR} visibility={probeEnd ? "visible" : "hidden"} />
          </svg>
          <div className="label" style={{ margin: "10px 0 0" }}>Firing delay per element</div>
          <DelayChart
            r={r}
            onHover={(i, e) => { anchor.current = { x: e.clientX, y: e.clientY }; setTip({ kind: "delay", i }); }}
            onLeave={() => { if (tip?.kind === "delay") setTip(null); }}
          />
          <div className="tip" ref={tipEl} hidden={!tip}>
            {tip?.kind === "polar" && (
              <>
                <div style={{ marginBottom: 3 }}><b>θ = {f1(r.TH[tip.i])}°</b></div>
                <div className="row"><i style={{ borderColor: "var(--c1)" }}></i><b>{dbs(r.CBd[tip.i])}</b><span>beam</span></div>
                <div className="row"><i style={{ borderColor: "var(--c2)" }}></i><b>{dbs(r.AFd[tip.i])}</b><span>array factor</span></div>
                <div className="row"><i style={{ borderColor: "var(--c3)" }}></i><b>{dbs(r.ELd[tip.i])}</b><span>element</span></div>
              </>
            )}
            {tip?.kind === "delay" && (
              <>
                <b>{r.del[tip.i] == null ? "off" : r.del[tip.i]!.toFixed(2) + " µs"}</b>
                <span style={{ opacity: 0.75 }}>{"  E" + (tip.i + 1) + (r.del[tip.i] == null ? " is not in this aperture" : " fires after the first")}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <details className="tv">
        <summary>Show the numbers</summary>
        <div className="tv-grid">
          <table>
            <thead><tr><th>Element</th><th>Fires at</th></tr></thead>
            <tbody>
              {r.del.map((v, i) => <tr key={i}><td>{"E" + (i + 1)}</td><td>{v == null ? "off" : v.toFixed(2) + " µs"}</td></tr>)}
            </tbody>
          </table>
          <table>
            <thead><tr><th>Lobe</th><th>Angle</th><th>Level</th></tr></thead>
            <tbody>
              <tr><td>Main</td><td>{f1(r.TH[r.im])}°</td><td>0.0 dB</td></tr>
              {r.gl.map((g, k) => <tr key={k}><td>Grating</td><td>{f1(g.th)}°</td><td>{dbs(g.db)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </details>
      <p className="cap">
        Computed live from c = 346.75 m/s and 40 kHz, the values in my imaging tool. Each element fires τ<sub>n</sub> = n·d·sin θ₀ / c after the first. When the pitch d is larger than λ/2, copies of the main lobe called grating lobes appear at sin θ = sin θ₀ ± λ/d. Off-the-shelf 16 mm transducers force d ≈ 1.85 λ, which limits a symmetric sweep with no grating lobe inside the scanned sector to ±15.7°, matching the imager&apos;s ±15° sweep. Element pattern: circular-piston model.
      </p>
    </figure>
  );
}
