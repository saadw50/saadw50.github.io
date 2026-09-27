// Real acquisition settings of the 8 TX / 1 RX imager, as set in the imaging
// tool (Fig. 2b screenshot), and every number the page derives from them.
// Each derived value shows its arithmetic, so all figures trace back here.

/* ---- settings read from the imaging tool ---- */
export const C_AIR = 346.75; // m/s ("Sound speed 0.034675 cm/µs")
export const F_TX = 40_000; // Hz, transducer carrier
export const BURST_CYCLES = 8;
export const SWEEP_DEG = 15; // sweep -15° .. +15°
export const STEP_DEG = 0.5;
export const APERTURES = ["FULL8", "LEFT4", "RIGHT4"] as const;
export const BLANK_US = 500; // RX blanking
export const WINDOW_MS = 15; // RX window
export const BIN_US = 50; // range bin
export const THRESH_LSB = 10; // threshold = noise + 10 LSB
export const RUN_SAMPLES = 3; // consecutive samples above threshold
export const SETTLE_MS = 30; // TX settle
export const FLOOR_DB = -30; // display floor

/* ---- the one measured result on the page ---- */
export const TARGET_TRUE_CM = 150; // target placed at a known 150 cm
export const TARGET_MEAS_CM = 156.5; // peak found at 156.5 cm
export const TARGET_ANGLE_DEG = -13.5; // peak found at -13.5°

/* ---- array geometry ----
   Centre-to-centre element pitch of the transmit board.
   TO CONFIRM: the ultrasound-phased-array-imaging README says "approximately 17-mm pitch".
   Changing this one number updates Fig. 3, Fig. 4 and their captions. */
export const PITCH_MM = 16;

/* ---- derived values (r = c·t/2 for a round trip) ---- */
export const LAMBDA_MM = (C_AIR / F_TX) * 1000; // 346.75 / 40000 = 8.669 mm
export const BURST_US = (BURST_CYCLES / F_TX) * 1e6; // 8 / 40000 = 200 µs
export const AXIAL_RES_CM = ((C_AIR * BURST_US * 1e-6) / 2) * 100; // 346.75 × 200e-6 / 2 = 3.47 cm
export const ANGLES = (2 * SWEEP_DEG) / STEP_DEG + 1; // (15 + 15) / 0.5 + 1 = 61
export const RECORDS = ANGLES * APERTURES.length; // 61 × 3 = 183 ("Background records: 183" in Fig. 2b)
export const BLIND_CM = ((C_AIR * BLANK_US * 1e-6) / 2) * 100; // 346.75 × 500e-6 / 2 = 8.67 cm
export const MAX_RANGE_M = (C_AIR * WINDOW_MS * 1e-3) / 2; // 346.75 × 15e-3 / 2 = 2.60 m
export const BIN_MM = ((C_AIR * BIN_US * 1e-6) / 2) * 1000; // 346.75 × 50e-6 / 2 = 8.67 mm
export const BINS = (WINDOW_MS * 1000) / BIN_US; // 15 ms / 50 µs = 300 bins
export const RUN_CM = (RUN_SAMPLES * BIN_MM) / 10; // 3 × 8.67 mm = 2.6 cm
export const RUN_US = RUN_SAMPLES * BIN_US; // 3 × 50 µs = 150 µs
export const SETTLE_RANGE_M = (C_AIR * SETTLE_MS * 1e-3) / 2; // 346.75 × 30e-3 / 2 = 5.20 m of range-equivalent time
export const DYN_RANGE_DB = -FLOOR_DB; // 30 dB between the peak and the floor

export const OFFSET_CM = TARGET_MEAS_CM - TARGET_TRUE_CM; // 156.5 - 150 = 6.5 cm
export const OFFSET_PCT = (OFFSET_CM / TARGET_TRUE_CM) * 100; // 6.5 / 150 = 4.3 %
export const ECHO_TRUE_MS = ((2 * TARGET_TRUE_CM) / 100 / C_AIR) * 1000; // 2 × 1.500 / 346.75 = 8.652 ms
export const ECHO_MEAS_MS = ((2 * TARGET_MEAS_CM) / 100 / C_AIR) * 1000; // 2 × 1.565 / 346.75 = 9.027 ms
export const OFFSET_US = (ECHO_MEAS_MS - ECHO_TRUE_MS) * 1000; // 2 × 0.065 / 346.75 = 374.9 µs
export const OFFSET_BINS = OFFSET_US / BIN_US; // 374.9 / 50 = 7.5 range bins

export const PITCH_LAMBDA = PITCH_MM / LAMBDA_MM; // 16 / 8.669 = 1.85 λ
const RAD = Math.PI / 180;
/* Largest symmetric sweep that keeps grating lobes out of the scanned sector:
   the grating lobe sits at sin θg = sin θ0 - λ/d, and staying outside ±θmax needs 2·sin θmax ≤ λ/d.
   θmax = asin(λ / 2d) = asin(8.669 / 32) = 15.72° */
export const CLEAN_SWEEP_DEG = Math.asin(LAMBDA_MM / (2 * PITCH_MM)) / RAD;
/* Grating lobes at broadside: sin θ = ±λ/d = ±0.542, θ = ±32.8° */
export const BROADSIDE_GRATING_DEG = Math.asin(LAMBDA_MM / PITCH_MM) / RAD;
/* Per-element firing step at the measured target angle: Δτ = d·sin|θ0| / c
   = 0.016 × sin 13.5° / 346.75 = 10.77 µs, so the last element fires 7 × 10.77 = 75.4 µs after the first. */
export const STEP_AT_TARGET_US = ((PITCH_MM * 1e-3 * Math.sin(Math.abs(TARGET_ANGLE_DEG) * RAD)) / C_AIR) * 1e6;

/* number formatting shared by the figures */
export const fmt = (v: number, d = 1) => v.toFixed(d);
export const signed = (v: number, d = 1) => (v < 0 ? "−" : v > 0 ? "+" : "") + Math.abs(v).toFixed(d);
