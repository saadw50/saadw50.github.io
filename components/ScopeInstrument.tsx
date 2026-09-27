"use client";

import { useEffect, useRef } from "react";
import { createScope } from "@/lib/scope-sim";

export default function ScopeInstrument() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const log = useRef<HTMLOListElement>(null);
  const state = useRef<HTMLSpanElement>(null);
  const stateText = useRef<HTMLElement>(null);
  const steer = useRef<HTMLElement>(null);
  const tau = useRef<HTMLElement>(null);
  const aperture = useRef<HTMLElement>(null);
  const objects = useRef<HTMLElement>(null);

  useEffect(() => {
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--mono").trim() || "monospace";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scope = createScope(
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
      { reduce, mono },
    );
    return () => scope.destroy();
  }, []);

  return (
    <figure className="inst">
      <div className="inst-body">
        <div className="inst-bar">
          <span>
            SECTOR SCAN <em>· 40 kHz · 8 TX / 1 RX</em>
            <span className="sim">SIMULATED</span>
          </span>
          <span className="inst-state" ref={state} data-state="scan">
            <i></i>
            <b ref={stateText}>SCANNING</b>
          </span>
        </div>
        <canvas
          ref={canvas}
          role="img"
          aria-label="Simulated sonar sector scan. A transmit beam sweeps from minus 45 to plus 45 degrees, echoes build a heat map, and each detected object is boxed with its angle, range and signal-to-noise ratio. The echo trace for the current beam is drawn underneath."
        ></canvas>
        <div className="inst-read">
          <div><span>Steer θ</span><b ref={steer}>+0.0°</b></div>
          <div><span>Δτ / element</span><b ref={tau}>0.00 µs</b></div>
          <div><span>Aperture</span><b ref={aperture}>FULL8</b></div>
          <div><span>Objects</span><b ref={objects}>0</b></div>
        </div>
        <div className="inst-log">
          <span>DETECTION LOG</span>
          <ol ref={log} aria-label="Detection log"></ol>
        </div>
      </div>
      <figcaption>
        A browser simulation of my imager&apos;s scan loop: the beam steps 0.5° at a time, each 8-cycle 40 kHz burst returns the echo trace shown underneath, and a threshold detector (noise floor plus margin, three consecutive samples) boxes each object. Objects come and go at random. The array is idealised to λ/2 spacing here; Fig. 3 below shows what real 16 mm transducers do.
      </figcaption>
    </figure>
  );
}
