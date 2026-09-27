import {
  BIN_US, BLANK_US, BLIND_CM, BURST_CYCLES, BURST_US, C_AIR, ECHO_MEAS_MS, ECHO_TRUE_MS, F_TX, OFFSET_BINS, OFFSET_CM,
  OFFSET_US, PITCH_MM, RUN_SAMPLES, RUN_US, STEP_AT_TARGET_US, TARGET_ANGLE_DEG, TARGET_MEAS_CM, TARGET_TRUE_CM, WINDOW_MS, signed,
} from "@/lib/acoustics";

/* Fig. 4: timing of one steering angle, drawn from the tool settings and the Fig. 2b result.
   Nothing here is a scope capture; every position is computed from lib/acoustics.ts. */

const f = (v: number) => +v.toFixed(2);

function PanelA() {
  const x = (us: number) => f(44 + us * (320 / 600)); // 0..600 µs over 320 px
  const period = 1e6 / F_TX; // 25 µs per cycle
  const rows = Array.from({ length: 8 }, (_, i) => ({ i, y: 52 + i * 16, del: (7 - i) * STEP_AT_TARGET_US })); // θ0 < 0: E8 fires first
  const e1 = rows[0];
  return (
    <svg className="dg" viewBox="0 0 380 252" role="img" aria-label={`First 600 microseconds at ${signed(TARGET_ANGLE_DEG)} degrees. Element 8 fires first and each next element fires ${STEP_AT_TARGET_US.toFixed(1)} microseconds later, each for ${BURST_CYCLES} cycles of 40 kilohertz, ${BURST_US} microseconds. The receiver is blanked for the first ${BLANK_US} microseconds.`}>
      <text className="m" x="44" y="14">A · FIRST 600 µs · STEERED TO {signed(TARGET_ANGLE_DEG)}°</text>
      <path className="brk" d={`M${x(e1.del)} 42V37H${x(e1.del + BURST_US)}V42`} />
      <text x={f((x(e1.del) + x(e1.del + BURST_US)) / 2)} y="32" textAnchor="middle">{BURST_CYCLES} cycles = {BURST_US} µs</text>
      {rows.map((r) => (
        <g key={r.i}>
          <text className="m" x="38" y={r.y + 4} textAnchor="end">E{r.i + 1}</text>
          {Array.from({ length: BURST_CYCLES }, (_, k) => (
            <rect key={k} className="pulse" x={x(r.del + k * period)} y={r.y - 5} width={f((period / 2) * (320 / 600))} height="10" />
          ))}
        </g>
      ))}
      <text className="m" x="206" y="98">E8 fires first;</text>
      <text className="m" x="206" y="112">each next element</text>
      <text className="m" x="206" y="126">{STEP_AT_TARGET_US.toFixed(1)} µs later</text>
      <text className="m" x="206" y="140">(Δτ, d = {PITCH_MM} mm)</text>
      <text className="m" x="38" y="194" textAnchor="end">RX</text>
      <rect className="blank" x={x(0)} y="183" width={f(x(BLANK_US) - x(0))} height="14" />
      <text className="m" x={f((x(0) + x(BLANK_US)) / 2)} y="193.5" textAnchor="middle" style={{ fill: "var(--ink)" }}>blanked {BLANK_US} µs (first {BLIND_CM.toFixed(1)} cm)</text>
      <line className="meas" x1={x(BLANK_US)} y1="190" x2={x(600)} y2="190" />
      <text className="m" x={f((x(BLANK_US) + x(600)) / 2)} y="179" textAnchor="middle">listening</text>
      <line className="ax" x1="44" y1="214" x2="364" y2="214" />
      {[0, 100, 200, 300, 400, 500, 600].map((t) => (
        <g key={t}>
          <line className="ax" x1={x(t)} y1="214" x2={x(t)} y2="218" />
          <text className="m" x={x(t)} y="230" textAnchor={t === 0 ? "start" : "middle"}>{t}</text>
        </g>
      ))}
      <text className="m" x="364" y="244" textAnchor="end">time, µs</text>
    </svg>
  );
}

function PanelB() {
  const x = (ms: number) => f(24 + ms * (340 / WINDOW_MS)); // 0..15 ms over 340 px
  const z0 = 8.5, z1 = 9.2;
  const zx = (ms: number) => f(24 + (ms - z0) * (340 / (z1 - z0))); // zoom: 0.7 ms over 340 px
  const rangeTicks = [0, 0.5, 1, 1.5, 2, 2.5]; // m, placed at t = 2r/c
  const bins: number[] = [];
  for (let t = z0; t <= z1 + 1e-9; t += BIN_US / 1000) bins.push(+t.toFixed(3));
  return (
    <svg className="dg" viewBox="0 0 380 286" role="img" aria-label={`One ping over the ${WINDOW_MS} millisecond receive window. A target at the known ${TARGET_TRUE_CM} centimetres should echo at ${ECHO_TRUE_MS.toFixed(2)} milliseconds. The imager placed it at ${TARGET_MEAS_CM} centimetres, which is ${ECHO_MEAS_MS.toFixed(2)} milliseconds, ${Math.round(OFFSET_US)} microseconds later, or ${OFFSET_BINS.toFixed(1)} range bins of ${BIN_US} microseconds.`}>
      <text className="m" x="24" y="14">B · ONE PING, 0 TO {WINDOW_MS} ms</text>
      <line className="ax" x1="24" y1="34" x2="364" y2="34" />
      {rangeTicks.map((r) => {
        const t = ((2 * r) / C_AIR) * 1000;
        return (
          <g key={r}>
            <line className="ax" x1={x(t)} y1="30" x2={x(t)} y2="34" />
            <text className="m" x={x(t)} y="26" textAnchor={r === 0 ? "start" : "middle"}>{r === 0 ? "0 m" : r === 2.5 ? "2.5 m" : r.toFixed(1)}</text>
          </g>
        );
      })}
      <rect className="pulse" x={x(0)} y="56" width={f(x(BURST_US / 1000) - x(0))} height="12" />
      <text x={f(x(BURST_US / 1000) + 6)} y="66">TX burst, {BURST_US} µs</text>
      <rect className="blank" x={x(0)} y="85" width={f(x(BLANK_US / 1000) - x(0))} height="14" />
      <rect className="win" x={x(BLANK_US / 1000)} y="85" width={f(x(WINDOW_MS) - x(BLANK_US / 1000))} height="14" />
      <text className="m" x="358" y="95.5" textAnchor="end" style={{ fill: "var(--ink)" }}>RX window {WINDOW_MS} ms</text>
      <line className="exp" x1={x(ECHO_TRUE_MS)} y1="40" x2={x(ECHO_TRUE_MS)} y2="112" />
      <line className="meas" x1={x(ECHO_MEAS_MS)} y1="40" x2={x(ECHO_MEAS_MS)} y2="112" />
      <text x={f(x(ECHO_TRUE_MS) - 5)} y="126" textAnchor="end">{TARGET_TRUE_CM} cm → {ECHO_TRUE_MS.toFixed(2)} ms</text>
      <text className="hl" x={f(x(ECHO_MEAS_MS) + 5)} y="126">{TARGET_MEAS_CM} cm → {ECHO_MEAS_MS.toFixed(2)} ms</text>
      <line className="ax" x1="24" y1="140" x2="364" y2="140" />
      {[0, 5, 10, 15].map((t) => (
        <g key={t}>
          <line className="ax" x1={x(t)} y1="140" x2={x(t)} y2="144" />
          <text className="m" x={x(t)} y="156" textAnchor={t === 0 ? "start" : t === 15 ? "end" : "middle"}>{t === 15 ? "15 ms" : t}</text>
        </g>
      ))}
      <rect className="brk" x={x(z0)} y="136" width={f(x(z1) - x(z0))} height="8" />
      <line className="zoomline" x1={x(z0)} y1="144" x2="24" y2="176" />
      <line className="zoomline" x1={x(z1)} y1="144" x2="364" y2="176" />
      <rect className="brk" x="24" y="176" width="340" height="86" style={{ stroke: "var(--line-strong)" }} />
      <text className="m" x="30" y="190">ZOOM {z0} TO {z1} ms · TICKS: {BIN_US} µs BINS</text>
      <line className="exp" x1={zx(ECHO_TRUE_MS)} y1="198" x2={zx(ECHO_TRUE_MS)} y2="262" />
      <line className="meas" x1={zx(ECHO_MEAS_MS)} y1="198" x2={zx(ECHO_MEAS_MS)} y2="262" />
      <path className="brk" d={`M${zx(ECHO_TRUE_MS)} 218V212H${zx(ECHO_MEAS_MS)}V218`} />
      <text className="hl" x={f((zx(ECHO_TRUE_MS) + zx(ECHO_MEAS_MS)) / 2)} y="208" textAnchor="middle">{Math.round(OFFSET_US)} µs = {OFFSET_CM} cm = {OFFSET_BINS.toFixed(1)} bins</text>
      <path className="brk" d={`M${zx(ECHO_MEAS_MS)} 242V236H${zx(ECHO_MEAS_MS + RUN_US / 1000)}V242`} />
      <text className="m" x={f((zx(ECHO_MEAS_MS) + zx(ECHO_MEAS_MS + RUN_US / 1000)) / 2)} y="252" textAnchor="middle">{RUN_SAMPLES} bins</text>
      {bins.map((t) => <line key={t} className="ax" x1={zx(t)} y1="258" x2={zx(t)} y2="262" />)}
      {[8.5, 8.7, 8.9, 9.1].map((t) => <text key={t} className="m" x={zx(t)} y="276" textAnchor={t === 8.5 ? "start" : "middle"}>{t === 9.1 ? "9.1 ms" : t}</text>)}
    </svg>
  );
}

export default function PingTiming() {
  return (
    <figure className="fig" id="fig4">
      <figcaption className="fig-h"><span className="ref">Fig. 4</span><h3>Anatomy of one ping, from the tool settings</h3></figcaption>
      <div className="ping">
        <PanelA />
        <PanelB />
      </div>
      <p className="cap">
        Drawn from the settings in Table 1 and the Fig. 2b result; this is not a scope capture.
        A: steered to {signed(TARGET_ANGLE_DEG)}°, the elements fire {STEP_AT_TARGET_US.toFixed(1)} µs apart (d = {PITCH_MM} mm, as in Fig. 3), each for {BURST_CYCLES} cycles, and the receiver ignores the first {BLANK_US} µs.
        B: an echo from the known {TARGET_TRUE_CM} cm should arrive at {ECHO_TRUE_MS.toFixed(2)} ms (t = 2r/c). The imager placed the target at {TARGET_MEAS_CM} cm, which is {ECHO_MEAS_MS.toFixed(2)} ms.
        The {Math.round(OFFSET_US)} µs difference is {OFFSET_BINS.toFixed(1)} range bins, so bin quantisation cannot explain it.
        The short bracket after the echo marks the {RUN_SAMPLES} bins the detector needs above threshold.
      </p>
    </figure>
  );
}
