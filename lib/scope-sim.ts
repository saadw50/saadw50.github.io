// Live sector-scan instrument for the hero. Everything here is SIMULATED and is
// labelled as such on the page. It mimics the real imager's scan loop (0.5°
// steps, 8-cycle 40 kHz bursts, a noise + margin threshold that needs three
// consecutive samples) on an idealised λ/2 array.

export type ScopeElements = {
  canvas: HTMLCanvasElement;
  log: HTMLOListElement;
  state: HTMLElement;
  stateText: HTMLElement;
  steer: HTMLElement;
  tau: HTMLElement;
  aperture: HTMLElement;
  objects: HTMLElement;
};

type Target = { th: number; r: number; refl: number; vth: number; vr: number; life: number; fade: number };
type Det = { r: number; a: number };
type Track = { last: number; n: number; w: number; ts: number; r: number; pk: number; pr: number; nz: number; took: boolean };
type Mark = { id: number; th: number; r: number; snr: number; seen: number; born: number };

export function createScope(els: ScopeElements, opts: { reduce: boolean; mono: string }) {
  const cvs = els.canvas;
  const ctx = cvs.getContext("2d");
  if (!ctx) return { destroy() {} };
  const reduce = opts.reduce;
  const mono = opts.mono;
  const RAD = Math.PI / 180;
  const C = 346.75, F = 40000, LAM = C / F, D = LAM / 2; /* m; idealised lambda/2 pitch for the display */
  const SECT = 45, STEP = 0.5, NC = Math.round((2 * SECT) / STEP) + 1; /* 181 beams */
  const RMAX = 270, NR = 216, DR = RMAX / NR; /* cm; 1.25 cm bins */
  const BLIND = 8.7, FLOOR = -30, SIG = 0.02, MARGIN = 0.26, SPEED = 64;
  const MODES = [{ n: "FULL8", a: 0, b: 8 }, { n: "LEFT4", a: 0, b: 4 }, { n: "RIGHT4", a: 4, b: 8 }];
  const S = Math.sin(SECT * RAD);
  const buf = new Float32Array(NC * NR), amp = new Float32Array(NR), sig = new Float32Array(NR), tmp = new Float32Array(NR), lastAmp = new Float32Array(NR);
  let lastNoise = 0, lastThr = 0, lastTh = 0, lastDets: Det[] = [];
  let col = 0, colF = 0, dir = 1, mode = 0, prevCol = -1;
  let targets: Target[] = [], tracks: Track[] = [], marks: Mark[] = [], objCount = 0, now = 0, detectUntil = -1, quiet = 0;
  let W = 0, H = 0, R = 0, cx = 0, cy = 0, stripTop = 0, stripH = 60, OW = 0, OH = 0;
  const off = document.createElement("canvas"), octx = off.getContext("2d")!;
  let img: ImageData | null = null, lut: Int32Array | null = null;

  /* copper heat colour map, transparent at the floor */
  const CM = new Uint8ClampedArray(256 * 4);
  {
    const st = [[0, 26, 15, 11, 0], [0.08, 52, 24, 14, 0.45], [0.26, 106, 46, 21, 0.85], [0.46, 172, 84, 37, 1], [0.64, 226, 130, 63, 1], [0.82, 249, 188, 118, 1], [1, 255, 245, 232, 1]];
    for (let i = 0; i < 256; i++) {
      const v = i / 255;
      let j = 0;
      while (j < st.length - 2 && v > st[j + 1][0]) j++;
      const a = st[j], b = st[j + 1], f = (v - a[0]) / (b[0] - a[0]);
      CM[i * 4] = a[1] + (b[1] - a[1]) * f; CM[i * 4 + 1] = a[2] + (b[2] - a[2]) * f; CM[i * 4 + 2] = a[3] + (b[3] - a[3]) * f; CM[i * 4 + 3] = 255 * (a[4] + (b[4] - a[4]) * f);
    }
  }

  function gauss() { let u = 0; while (u === 0) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); }
  function rnd(a: number, b: number) { return a + Math.random() * (b - a); }
  function sgn(v: number, d: number) { return (v < 0 ? "−" : "+") + Math.abs(v).toFixed(d); }
  function af(th: number, st: number, n: number) { const psi = Math.PI * (Math.sin(th * RAD) - Math.sin(st * RAD)), s = Math.sin(psi / 2); if (Math.abs(s) < 1e-7) return 1; return Math.abs(Math.sin((n * psi) / 2) / (n * s)); }
  function el(th: number) { return Math.pow(Math.cos(th * RAD), 1.6); }

  function spawn(th?: number, r?: number): Target | null {
    for (let k = 0; k < 14; k++) {
      const T: Target = { th: th != null ? th : rnd(-36, 36), r: r != null ? r : rnd(70, 238), refl: rnd(0.8, 1), vth: rnd(-1.4, 1.4), vr: rnd(-8, 8), life: rnd(16, 34), fade: 1 };
      const ok = targets.every((o) => Math.abs(o.th - T.th) > 14 || Math.abs(o.r - T.r) > 45);
      if (ok || th != null) { targets.push(T); return T; }
    }
    return null;
  }

  function fire(ci: number) {
    const a = -SECT + ci * STEP, m = MODES[mode], n = m.b - m.a;
    sig.fill(0);
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i], g = t.refl * af(t.th, a, n) * el(t.th) * Math.exp(-t.r / 700) * t.fade;
      if (g < 0.003) continue;
      const k0 = Math.max(0, Math.floor((t.r - 7) / DR)), k1 = Math.min(NR - 1, Math.ceil((t.r + 14) / DR));
      for (let k = k0; k <= k1; k++) { const x = (k + 0.5) * DR - t.r; sig[k] += g * (x < 0 ? Math.exp(-0.5 * (x / 1.8) * (x / 1.8)) : Math.exp(-0.5 * (x / 3.6) * (x / 3.6))); }
    }
    const kb = Math.ceil(BLIND / DR);
    for (let k = 0; k < NR; k++) { if (k < kb) { amp[k] = 0; continue; } const nx = gauss() * SIG, ny = gauss() * SIG; amp[k] = Math.hypot(sig[k] + nx, ny); }
    tmp.set(amp);
    const w = tmp.subarray(kb).sort(), noise = w[w.length >> 1], thr = noise + MARGIN;
    /* detector: at least 3 consecutive samples above threshold, report the peak of each run */
    const dets: Det[] = [];
    let run = 0, pk = 0, pkK = 0;
    for (let k = kb; k <= NR; k++) {
      const v = k < NR ? amp[k] : 0;
      if (v > thr) { run++; if (v > pk) { pk = v; pkK = k; } }
      else { if (run >= 3) dets.push({ r: (pkK + 0.5) * DR, a: pk }); run = 0; pk = 0; }
    }
    const base = ci * NR;
    for (let k = 0; k < NR; k++) { const A = amp[k], q = A > 1e-6 ? (20 * Math.log10(A) - FLOOR) / -FLOOR : 0; buf[base + k] = q < 0 ? 0 : q > 1 ? 1 : q; }
    lastAmp.set(amp); lastNoise = noise; lastThr = thr; lastTh = a; lastDets = dets;
    associate(ci, a, dets, noise);
  }

  /* join detections across neighbouring beams into objects */
  function associate(ci: number, a: number, dets: Det[], noise: number) {
    for (let i = 0; i < dets.length; i++) {
      const d = dets[i];
      let best: Track | null = null, bd = 14;
      for (let j = 0; j < tracks.length; j++) { const tr = tracks[j]; if (tr.last !== prevCol || tr.took) continue; const dr = Math.abs(tr.r - d.r); if (dr < bd) { bd = dr; best = tr; } }
      if (best) { best.took = true; best.last = ci; best.n++; best.w += d.a; best.ts += a * d.a; best.r = d.r; best.nz += noise; if (d.a > best.pk) { best.pk = d.a; best.pr = d.r; } }
      else tracks.push({ last: ci, n: 1, w: d.a, ts: a * d.a, r: d.r, pk: d.a, pr: d.r, nz: noise, took: true });
    }
    const keep: Track[] = [];
    for (let q = 0; q < tracks.length; q++) { const t = tracks[q]; if (t.last === ci) { t.took = false; keep.push(t); } else closeTrack(t); }
    tracks = keep; prevCol = ci;
  }
  function closeTrack(t: Track) { if (t.n >= 4) emit(t.ts / t.w, t.pr, 20 * Math.log10(t.pk / Math.max(1e-4, t.nz / t.n))); }
  function flush() { for (let i = 0; i < tracks.length; i++) closeTrack(tracks[i]); tracks = []; prevCol = -1; }
  function emit(th: number, r: number, snr: number) {
    for (let i = 0; i < marks.length; i++) { const m = marks[i]; if (Math.abs(m.th - th) < 8 && Math.abs(m.r - r) < 22) { m.th = th; m.r = r; m.snr = snr; m.seen = now; return; } }
    const nm: Mark = { id: ++objCount, th, r, snr, seen: now, born: now };
    marks.push(nm); detectUntil = now + 2.4; addLog(nm);
  }
  function fmt(s: number) { const mm = Math.floor(s / 60), ss = s - mm * 60; return (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss.toFixed(1); }
  function addLog(m: Mark) {
    const logEl = els.log;
    const li = document.createElement("li"), t = document.createElement("time"), b = document.createElement("b"), s = document.createElement("span");
    t.textContent = fmt(now); b.textContent = "OBJ " + (m.id < 10 ? "0" : "") + m.id; s.textContent = sgn(m.th, 1) + "°  " + Math.round(m.r) + " cm";
    li.appendChild(t); li.appendChild(b); li.appendChild(s); logEl.insertBefore(li, logEl.firstChild);
    while (logEl.children.length > 4) logEl.removeChild(logEl.lastChild!);
  }

  function update(dt: number) {
    now += dt;
    const f = Math.exp(-dt / 7);
    for (let i = 0; i < buf.length; i++) buf[i] *= f;
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i]; t.th += t.vth * dt; t.r += t.vr * dt;
      if (t.th > 36 || t.th < -36) { t.vth = -t.vth; t.th = Math.max(-36, Math.min(36, t.th)); }
      if (t.r < 65 || t.r > 240) { t.vr = -t.vr; t.r = Math.max(65, Math.min(240, t.r)); }
      t.life -= dt; t.fade = t.life < 2 ? Math.max(0, t.life / 2) : 1;
    }
    targets = targets.filter((t) => t.life > 0);
    quiet = targets.length ? 0 : quiet + dt;
    if (targets.length < 3 && (Math.random() < dt * 0.09 || quiet > 4.5)) spawn();
    colF += dir * SPEED * dt;
    const tgt = Math.max(0, Math.min(NC - 1, Math.round(colF)));
    while (col !== tgt) { col += dir; fire(col); }
    if ((dir > 0 && colF >= NC - 1) || (dir < 0 && colF <= 0)) { colF = dir > 0 ? NC - 1 : 0; dir = -dir; flush(); mode = (mode + 1) % 3; }
    marks = marks.filter((m) => now - m.seen < 9);
  }

  function P(th: number, r: number): [number, number] { const q = (r / RMAX) * R; return [cx + q * Math.sin(th * RAD), cy - q * Math.cos(th * RAD)]; }
  function fan(rr: number) { ctx!.beginPath(); ctx!.moveTo(cx, cy); ctx!.arc(cx, cy, rr, -Math.PI / 2 - SECT * RAD, -Math.PI / 2 + SECT * RAD); ctx!.closePath(); }

  function layout() {
    const rect = cvs.getBoundingClientRect(); if (!rect.width) return false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = rect.width; H = rect.height;
    cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr); ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    stripH = Math.max(52, Math.min(76, H * 0.15));
    R = Math.max(60, Math.min((W - 64) / (2 * S), H - 22 - 34 - stripH - 20));
    cx = W / 2; cy = 22 + R; stripTop = cy + 34;
    OW = Math.max(120, Math.min(460, Math.round(2 * S * R))); OH = Math.round(OW / (2 * S));
    off.width = OW; off.height = OH; img = octx.createImageData(OW, OH); lut = new Int32Array(OW * OH);
    for (let j = 0; j < OH; j++) {
      const ny = 1 - (j + 0.5) / OH;
      for (let i = 0; i < OW; i++) {
        const nx = ((i + 0.5) / OW * 2 - 1) * S, rn = Math.sqrt(nx * nx + ny * ny), th = Math.atan2(nx, ny) / RAD;
        let idx = -1;
        if (rn <= 1 && Math.abs(th) <= SECT) { idx = Math.round((th + SECT) / STEP) * NR + Math.min(NR - 1, Math.floor(rn * NR)); }
        lut[j * OW + i] = idx;
      }
    }
    return true;
  }

  function roundRect(x: number, y: number, w: number, h: number, r: number) { ctx!.beginPath(); ctx!.moveTo(x + r, y); ctx!.arcTo(x + w, y, x + w, y + h, r); ctx!.arcTo(x + w, y + h, x, y + h, r); ctx!.arcTo(x, y + h, x, y, r); ctx!.arcTo(x, y, x + w, y, r); ctx!.closePath(); }

  function draw() {
    if (!lut || !img) return;
    const c = ctx!;
    let p: [number, number];
    c.clearRect(0, 0, W, H);
    fan(R); c.fillStyle = "#0C1822"; c.fill();
    /* heat map of the last echo seen at every beam angle */
    const d = img.data;
    for (let i = 0; i < lut.length; i++) { const q = i * 4, ix = lut[i]; if (ix < 0) { d[q + 3] = 0; continue; } const o = ((buf[ix] * 255) | 0) * 4; d[q] = CM[o]; d[q + 1] = CM[o + 1]; d[q + 2] = CM[o + 2]; d[q + 3] = CM[o + 3]; }
    octx.putImageData(img, 0, 0);
    c.imageSmoothingEnabled = true; c.drawImage(off, cx - S * R, cy - R, 2 * S * R, R);
    /* grid */
    c.lineWidth = 1; c.strokeStyle = "rgba(126,176,196,.16)";
    for (let rr = 50; rr < RMAX; rr += 50) { c.beginPath(); c.arc(cx, cy, (rr / RMAX) * R, -Math.PI / 2 - SECT * RAD, -Math.PI / 2 + SECT * RAD); c.stroke(); }
    for (let a = -SECT; a <= SECT; a += 15) { p = P(a, RMAX); c.beginPath(); c.moveTo(cx, cy); c.lineTo(p[0], p[1]); c.stroke(); }
    c.strokeStyle = "rgba(126,176,196,.38)"; fan(R); c.stroke();
    c.font = "10px " + mono; c.fillStyle = "#7D909E"; c.textAlign = "center"; c.textBaseline = "middle";
    for (let a = -SECT; a <= SECT; a += 15) { const lx = cx + (R + 13) * Math.sin(a * RAD), ly = cy - (R + 13) * Math.cos(a * RAD); c.fillText((a > 0 ? "+" : a < 0 ? "−" : "") + Math.abs(a) + "°", lx, ly); }
    c.textAlign = "right";
    for (let rr = 50; rr < RMAX; rr += 50) { p = P(-SECT, rr); c.fillText(rr + (rr === 250 ? " cm" : ""), p[0] - 7, p[1]); }
    /* transmit beam */
    const th0 = -SECT + col * STEP, n = MODES[mode].b - MODES[mode].a, bw = Math.min(40, (0.886 * (2 / n)) / Math.cos(th0 * RAD) / RAD);
    const gr = c.createRadialGradient(cx, cy, 0, cx, cy, R); gr.addColorStop(0, "rgba(63,184,201,.26)"); gr.addColorStop(1, "rgba(63,184,201,.03)");
    c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, -Math.PI / 2 + (th0 - bw / 2) * RAD, -Math.PI / 2 + (th0 + bw / 2) * RAD); c.closePath(); c.fillStyle = gr; c.fill();
    p = P(th0, RMAX); c.strokeStyle = "rgba(120,215,228,.85)"; c.lineWidth = 1.3; c.beginPath(); c.moveTo(cx, cy); c.lineTo(p[0], p[1]); c.stroke();
    /* echoes crossing threshold on the current beam */
    c.fillStyle = "#FFE3BF"; c.shadowColor = "rgba(244,162,89,.9)"; c.shadowBlur = 10;
    for (let i = 0; i < lastDets.length; i++) { p = P(lastTh, lastDets[i].r); c.beginPath(); c.arc(p[0], p[1], 2.6, 0, Math.PI * 2); c.fill(); }
    c.shadowBlur = 0;
    /* detected objects */
    c.textBaseline = "alphabetic";
    for (let i = 0; i < marks.length; i++) {
      const m = marks[i], age = now - m.seen, life = now - m.born, al = age > 6.5 ? Math.max(0, (9 - age) / 2.5) : 1;
      p = P(m.th, m.r);
      const x = p[0], y = p[1];
      c.globalAlpha = al;
      if (life < 1.6) { const kk = life / 1.6; c.strokeStyle = "rgba(244,162,89," + 0.95 * (1 - kk) + ")"; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 6 + kk * 36, 0, Math.PI * 2); c.stroke(); }
      const s = 11, cc = 5; c.strokeStyle = "#F4A259"; c.lineWidth = 1.5; c.beginPath();
      c.moveTo(x - s, y - s + cc); c.lineTo(x - s, y - s); c.lineTo(x - s + cc, y - s); c.moveTo(x + s - cc, y - s); c.lineTo(x + s, y - s); c.lineTo(x + s, y - s + cc);
      c.moveTo(x + s, y + s - cc); c.lineTo(x + s, y + s); c.lineTo(x + s - cc, y + s); c.moveTo(x - s + cc, y + s); c.lineTo(x - s, y + s); c.lineTo(x - s, y + s - cc); c.stroke();
      const l1 = "OBJ " + (m.id < 10 ? "0" : "") + m.id, l2 = sgn(m.th, 1) + "°  " + Math.round(m.r) + " cm", l3 = "SNR " + Math.round(m.snr) + " dB";
      c.font = "600 10.5px " + mono;
      const bwid = Math.max(c.measureText(l2).width, c.measureText(l1).width) + 16, bh = 47;
      let bx = x + s + 10, by = y - s - bh + 6;
      if (bx + bwid > W - 6) bx = x - s - 10 - bwid; if (by < 4) by = y + s + 4; if (by + bh > stripTop - 26) by = stripTop - 26 - bh;
      c.strokeStyle = "rgba(244,162,89,.55)"; c.lineWidth = 1; c.beginPath(); c.moveTo(bx < x ? x - s : x + s, y - s / 2); c.lineTo(bx < x ? bx + bwid : bx, by + bh / 2); c.stroke();
      roundRect(bx, by, bwid, bh, 3); c.fillStyle = "rgba(7,16,24,.9)"; c.fill(); c.stroke();
      c.textAlign = "left"; c.fillStyle = "#F4A259"; c.fillText(l1, bx + 8, by + 15);
      c.font = "10.5px " + mono; c.fillStyle = "#D5E0E7"; c.fillText(l2, bx + 8, by + 29); c.fillStyle = "#7D909E"; c.fillText(l3, bx + 8, by + 42);
      c.globalAlpha = 1;
    }
    /* colour bar, in the empty corner beside the fan */
    const cbx = W - 20, cy0 = cy - R * 0.62, cy1 = cy - R * 0.26, cg = c.createLinearGradient(0, cy1, 0, cy0);
    for (let i = 0; i <= 8; i++) { const o = Math.round((i / 8) * 255) * 4; cg.addColorStop(i / 8, "rgb(" + CM[o] + "," + CM[o + 1] + "," + CM[o + 2] + ")"); }
    c.fillStyle = cg; c.fillRect(cbx, cy0, 6, cy1 - cy0); c.strokeStyle = "rgba(126,176,196,.3)"; c.strokeRect(cbx + 0.5, cy0 + 0.5, 5, cy1 - cy0 - 1);
    c.font = "9.5px " + mono; c.fillStyle = "#7D909E"; c.textAlign = "center"; c.fillText("0 dB", cbx + 3, cy0 - 7); c.fillText("−30", cbx + 3, cy1 + 13);
    /* element row: lit elements are firing in this aperture */
    const sp = Math.min(12, R / 24), mm = MODES[mode];
    for (let i = 0; i < 8; i++) { const ex = cx + (i - 3.5) * sp, on = i >= mm.a && i < mm.b; c.beginPath(); c.arc(ex, cy + 11, 3, 0, Math.PI * 2); if (on) { c.fillStyle = "#3FB8C9"; c.fill(); } else { c.strokeStyle = "#3A4B58"; c.lineWidth = 1; c.stroke(); } }
    c.font = "9.5px " + mono; c.fillStyle = "#7D909E"; c.textAlign = "right"; c.fillText("TX", cx - 4.5 * sp - 6, cy + 14); c.textAlign = "left"; c.fillText(mm.n, cx + 4.5 * sp + 6, cy + 14);
    /* A-scan strip: echo amplitude against range for the current beam */
    const x0 = 34, x1 = W - 12, y0 = stripTop, y1 = stripTop + stripH, ph = stripH - 18;
    roundRect(x0, y0, x1 - x0, stripH, 4); c.fillStyle = "rgba(255,255,255,.025)"; c.fill(); c.strokeStyle = "rgba(126,176,196,.2)"; c.lineWidth = 1; c.stroke();
    const X = (r: number) => x0 + (r / RMAX) * (x1 - x0), Y = (v: number) => y1 - 4 - Math.min(1, v / 0.95) * ph;
    c.strokeStyle = "rgba(126,176,196,.12)"; c.fillStyle = "#7D909E"; c.font = "9.5px " + mono; c.textAlign = "center";
    for (let rr = 0; rr <= RMAX; rr += 50) { const gx = X(rr); if (rr > 0 && rr < RMAX) { c.beginPath(); c.moveTo(gx, y0); c.lineTo(gx, y1); c.stroke(); } c.fillText(rr + (rr === 250 ? " cm" : ""), gx, y1 + 12); }
    c.textAlign = "left"; c.fillText("A-SCAN  θ " + sgn(lastTh, 1) + "°", x0 + 7, y0 + 12);
    const yT = Y(lastThr), yN = Y(lastNoise);
    c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, yT - y0); c.clip();
    c.beginPath(); c.moveTo(X(0), y1);
    for (let i = 0; i < NR; i++) c.lineTo(X((i + 0.5) * DR), Y(lastAmp[i]));
    c.lineTo(X(RMAX), y1); c.closePath(); c.fillStyle = "rgba(244,162,89,.42)"; c.fill(); c.restore();
    c.setLineDash([4, 4]); c.lineWidth = 1;
    c.strokeStyle = "rgba(63,184,201,.55)"; c.beginPath(); c.moveTo(x0, yN); c.lineTo(x1, yN); c.stroke();
    c.strokeStyle = "rgba(244,162,89,.8)"; c.beginPath(); c.moveTo(x0, yT); c.lineTo(x1, yT); c.stroke(); c.setLineDash([]);
    c.textAlign = "right"; c.fillStyle = "#F4A259"; c.fillText("THRESHOLD", x1 - 6, yT - 4);
    c.strokeStyle = "#CFE0E8"; c.lineWidth = 1.2; c.beginPath();
    for (let i = 0; i < NR; i++) { const tx = X((i + 0.5) * DR), ty = Y(lastAmp[i]); if (i) c.lineTo(tx, ty); else c.moveTo(tx, ty); }
    c.stroke();
  }

  let curState = "", curN = -1;
  function ui() {
    const th0 = -SECT + col * STEP;
    els.steer.textContent = sgn(th0, 1) + "°";
    els.tau.textContent = ((D * Math.abs(Math.sin(th0 * RAD))) / C * 1e6).toFixed(2) + " µs";
    els.aperture.textContent = MODES[mode].n;
    els.objects.textContent = String(marks.length);
    const s = now < detectUntil ? "detect" : marks.length ? "track" : "scan";
    if (s !== curState || (s === "track" && curN !== marks.length)) {
      if (s === "detect" && curState !== "detect") { els.state.setAttribute("data-state", "scan"); void els.state.offsetWidth; }
      els.state.setAttribute("data-state", s);
      els.stateText.textContent = s === "detect" ? "OBJECT DETECTED" : s === "track" ? "TRACKING " + marks.length : "SCANNING";
      curState = s; curN = marks.length;
    }
  }

  function prefill() {
    const a = spawn(-13.5, 156.5)!; a.vth = 0.6; a.vr = -4; a.life = rnd(24, 32); /* same spot as the real target in Fig. 2b */
    const b = spawn(22, 96)!; b.vth = -0.8; b.vr = 6; b.life = rnd(14, 20);
    now = 0; mode = 0; col = 0; prevCol = -1; fire(0);
    for (let c = 1; c < NC; c++) { col = c; fire(c); }
    flush(); dir = -1; colF = NC - 1; mode = 1;
  }

  let running = false, raf = 0, last = 0, uiT = 0, inView = true, dead = false;
  function frame(ts: number) {
    raf = 0;
    const dt = Math.min(0.05, Math.max(0, (ts - last) / 1000)); last = ts;
    update(dt); draw(); uiT += dt; if (uiT > 0.1) { uiT = 0; ui(); }
    if (running) raf = requestAnimationFrame(frame);
  }
  function start() { if (running || reduce || !inView || dead) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  prefill();
  if (layout()) draw();
  ui();
  /* Next.js 16 targets Chrome/Edge/Firefox 111+ and Safari 16.4+, which all have these observers */
  const ro = new ResizeObserver(() => { if (layout()) draw(); });
  ro.observe(cvs);
  document.fonts?.ready.then(() => { if (!dead) draw(); });
  const io = new IntersectionObserver((es) => { inView = es[0].isIntersecting; if (inView) start(); else stop(); }, { rootMargin: "80px" });
  io.observe(cvs);
  start();

  return {
    destroy() {
      dead = true; stop();
      ro.disconnect(); io.disconnect();
      els.log.textContent = "";
    },
  };
}
