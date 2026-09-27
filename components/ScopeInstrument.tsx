"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SWEEP_DEG } from "@/lib/acoustics";
import { createScope, type ScopeHandle } from "@/lib/scope-sim";

const REDUCE = "(prefers-reduced-motion: reduce)";
function subscribeReduce(cb: () => void) {
  const m = window.matchMedia(REDUCE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

export default function ScopeInstrument() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const log = useRef<HTMLOListElement>(null);
  const state = useRef<HTMLSpanElement>(null);
  const stateText = useRef<HTMLElement>(null);
  const steer = useRef<HTMLElement>(null);
  const tau = useRef<HTMLElement>(null);
  const aperture = useRef<HTMLElement>(null);
  const objects = useRef<HTMLElement>(null);
  const scope = useRef<ScopeHandle | null>(null);
  // reduced motion starts the scan paused; null on the server, which cannot know the preference
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => null);
  const [choice, setChoice] = useState<boolean | null>(null); // the visitor's own Play/Pause choice
  const paused = choice ?? reduce;

  useEffect(() => {
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--mono").trim() || "monospace";
    scope.current = createScope(
      {
        canvas: canvas.current!,
        log: log.current!,
        state: state.current!,
        stateText: stateText.current!,
        steer: steer.current!,
        tau: tau.current!,
        aperture: aperture.current!,
        objects: objects.current!,
      },
      { paused: window.matchMedia(REDUCE).matches, mono },
    );
    return () => { scope.current?.destroy(); scope.current = null; };
  }, []);

  useEffect(() => {
    if (paused != null) scope.current?.setPaused(paused);
  }, [paused]);

  return (
    <figure className="inst">
      <div className="inst-body">
        <div className="inst-bar">
          <span className="inst-title">
            SECTOR SCAN <em>· 40 kHz · 8 TX / 1 RX</em>
            <span className="sim">SIMULATED · IDEAL λ/2</span>
          </span>
          <span className="inst-ctl">
            <span className="inst-state" ref={state} data-state="scan">
              <i></i>
              <b ref={stateText}>SCANNING</b>
            </span>
            <button className="inst-btn" type="button" onClick={() => setChoice(!paused)} disabled={paused === null} aria-label={paused ? "Play the simulation" : "Pause the simulation"}>
              {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
              <span>{paused ? "Play" : "Pause"}</span>
            </button>
          </span>
        </div>
        <canvas
          ref={canvas}
          role="img"
          aria-label={`Simulated sonar sector scan on an ideal array. A transmit beam sweeps from minus 45 to plus 45 degrees, echoes build a heat map, and each detected object is boxed with its angle, range and signal-to-noise ratio. A dashed wedge marks the real imager's plus and minus ${SWEEP_DEG} degree sweep. The echo trace for the current beam is drawn underneath.`}
        ></canvas>
        <div className="inst-read">
          <div><span>Steer <i className="nt">θ</i></span><b ref={steer}>+0.0°</b></div>
          <div><span>Δ<i className="nt">τ</i> / element</span><b ref={tau}>0.00 µs</b></div>
          <div><span>Aperture</span><b ref={aperture}>FULL8</b></div>
          <div><span>Objects</span><b ref={objects}>0</b></div>
        </div>
        <div className="inst-log">
          <span>DETECTION LOG</span>
          <ol ref={log} aria-label="Detection log"></ol>
        </div>
      </div>
      <figcaption>
        A browser simulation of the imager&apos;s scan loop, labelled SIMULATED. It sweeps ±45° in 0.5° steps (181 beams) on an ideal λ/2 array; the real imager sweeps ±{SWEEP_DEG}° (61 beams, dashed wedge), and Fig. 4 shows why. Each 8-cycle 40 kHz burst returns the echo trace underneath, and a threshold detector (noise floor plus margin, three consecutive samples) boxes each object. Targets appear and move at random.
      </figcaption>
    </figure>
  );
}
