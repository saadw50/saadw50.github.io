// Beam pattern of the 8-element transmit array (Fig. 3).
// c = 346.75 m/s and f = 40 kHz are the values set in the imaging tool.
// λ = c / f = 346.75 / 40000 = 8.669 mm.
import { C_AIR, LAMBDA_MM } from "@/lib/acoustics";

export const C = C_AIR; // m/s
export const LAM_MM = LAMBDA_MM; // 8.66875 mm

export type Aperture = "FULL8" | "LEFT4" | "RIGHT4";
export type BeamState = { th0: number; d: number; ap: Aperture };
export type Lobe = { th: number; db: number };
export type BeamResult = {
  TH: number[];
  /** combined beam in dB relative to the steered beam's peak (grating lobes can exceed 0 dB) */
  CBd: number[];
  AFd: number[];
  ELd: number[];
  /** index of the steered beam's peak */
  im: number;
  /** -3 dB width of the steered beam, degrees */
  bw: number;
  /** grating lobes, strongest first, level relative to the steered beam */
  gl: Lobe[];
  /** highest level anywhere in CBd, dB (> 0 when a grating lobe beats the beam) */
  peakDb: number;
  del: (number | null)[];
  s: BeamState;
  n: number;
};

const RAD = Math.PI / 180;

/* Bessel J1 (rational approximation, Numerical Recipes) for the circular-piston element pattern */
export function J1(x: number): number {
  const ax = Math.abs(x);
  let y, a1, a2;
  if (ax < 8) {
    y = x * x;
    a1 = x * (72362614232.0 + y * (-7895059235.0 + y * (242396853.1 + y * (-2972611.439 + y * (15704.4826 + y * -30.16036606)))));
    a2 = 144725228442.0 + y * (2300535178.0 + y * (18583304.74 + y * (99447.43394 + y * (376.9991397 + y))));
    return a1 / a2;
  }
  const z = 8 / ax, xx = ax - 2.356194491;
  y = z * z;
  a1 = 1 + y * (0.183105e-2 + y * (-0.3516396496e-4 + y * (0.2457520174e-5 + y * -0.240337019e-6)));
  a2 = 0.04687499995 + y * (-0.2002690873e-3 + y * (0.8449199096e-5 + y * (-0.88228987e-6 + y * 0.105787412e-6)));
  const ans = Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * a1 - z * Math.sin(xx) * a2);
  return x < 0 ? -ans : ans;
}

export function activeElements(ap: Aperture): number[] {
  return ap === "FULL8" ? [0, 1, 2, 3, 4, 5, 6, 7] : ap === "LEFT4" ? [0, 1, 2, 3] : [4, 5, 6, 7];
}

export function computeBeam(s: BeamState): BeamResult {
  const act = activeElements(s.ap), n = act.length;
  /* Element pattern: circular piston 2·J1(ka·sin θ)/(ka·sin θ). ASSUMED radius: 8 mm (the full face of a
     16 mm can) for the real array; for the λ/2 comparison the piston shrinks to 0.9 × d/2 so it fits the
     pitch. Lobe levels are therefore model values, not measurements. */
  const arad = s.d >= 10 ? 8 : (s.d / 2) * 0.9, ka = (2 * Math.PI / LAM_MM) * arad, s0 = Math.sin(s.th0 * RAD);
  const TH: number[] = [], AF: number[] = [], EL: number[] = [], CB: number[] = [];
  for (let i = 0; i <= 720; i++) {
    const th = -90 + i * 0.25, sn = Math.sin(th * RAD), psi = 2 * Math.PI * s.d / LAM_MM * (sn - s0), h = Math.sin(psi / 2);
    const afv = Math.abs(h) < 1e-9 ? 1 : Math.abs(Math.sin((n * psi) / 2) / (n * h)), x = ka * sn, elv = Math.abs(x) < 1e-9 ? 1 : Math.abs((2 * J1(x)) / x), cb = afv * elv;
    TH.push(th); AF.push(afv); EL.push(elv); CB.push(cb);
  }
  /* The steered beam is the local peak within ±3° of θ0. Past about ±16° with 16 mm pitch the global
     maximum is a grating lobe, so the global maximum must not be called the main lobe. */
  const i0 = Math.round((s.th0 + 90) / 0.25);
  let im = i0;
  for (let k = Math.max(0, i0 - 12); k <= Math.min(720, i0 + 12); k++) if (CB[k] > CB[im]) im = k;
  const dB = (v: number) => 20 * Math.log10(Math.max(v, 1e-5));
  const CBd = CB.map((v) => dB(v / CB[im])), AFd = AF.map(dB), ELd = EL.map(dB);
  const peakDb = Math.max(...CBd);
  /* -3 dB width around the steered beam */
  let L = im, Rr = im;
  while (L > 0 && CBd[L] > -3) L--;
  while (Rr < 720 && CBd[Rr] > -3) Rr++;
  const lx = TH[L] + ((-3 - CBd[L]) / (CBd[L + 1] - CBd[L])) * 0.25, rx = TH[Rr - 1] + ((-3 - CBd[Rr - 1]) / (CBd[Rr] - CBd[Rr - 1])) * 0.25, bw = rx - lx;
  /* grating lobes at sin(theta) = sin(theta0) + m*lambda/d */
  const gl: Lobe[] = [];
  for (let m = -3; m <= 3; m++) {
    if (!m) continue;
    const sg = s0 + (m * LAM_MM) / s.d;
    if (Math.abs(sg) > 1) continue;
    const tg = Math.asin(sg) / RAD, ic = Math.round((tg + 90) / 0.25);
    let best = ic;
    for (let k = Math.max(0, ic - 12); k <= Math.min(720, ic + 12); k++) if (CBd[k] > CBd[best]) best = k;
    gl.push({ th: TH[best], db: CBd[best] });
  }
  gl.sort((p, q) => q.db - p.db);
  const xs = act.map((i) => i * s.d * 1e-3 * s0), base = Math.min(...xs), del: (number | null)[] = [];
  for (let e = 0; e < 8; e++) { const ai = act.indexOf(e); del.push(ai < 0 ? null : ((xs[ai] - base) / C) * 1e6); }
  return { TH, CBd, AFd, ELd, im, bw, gl, peakDb, del, s, n };
}
