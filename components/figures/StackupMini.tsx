/* Generic 4-layer stack-up (signal / GND / 3.3 V / signal) drawn from the facts only.
   No board artwork: the wristband layout belongs to the research team.
   `decorative` draws only the copper layers, as an icon inside a link that already has text. */
export default function StackupMini({ decorative = false }: { decorative?: boolean }) {
  const layers = (
    <g>
      <rect className="cu" x="20" y="34" width="44" height="6" /><rect className="cu" x="74" y="34" width="36" height="6" /><rect className="cu" x="122" y="34" width="30" height="6" /><rect className="cu" x="162" y="34" width="28" height="6" />
      <rect className="diel" x="20" y="40" width="180" height="20" />
      <rect className="cu" x="20" y="60" width="180" height="6" />
      <rect className="diel" x="20" y="66" width="180" height="34" />
      <rect className="cu" x="20" y="100" width="140" height="6" /><rect className="cu" x="170" y="100" width="30" height="6" />
      <rect className="diel" x="20" y="106" width="180" height="20" />
      <rect className="cu" x="20" y="126" width="30" height="6" /><rect className="cu" x="60" y="126" width="52" height="6" /><rect className="cu" x="122" y="126" width="36" height="6" /><rect className="cu" x="168" y="126" width="26" height="6" />
      <rect className="cu" x="158" y="34" width="6" height="98" />
    </g>
  );
  if (decorative) {
    return <svg className="dg" viewBox="12 26 196 114" aria-hidden="true">{layers}</svg>;
  }
  return (
    <svg className="dg" viewBox="0 0 320 170" role="img" aria-label="Generic four-layer stack-up: signal on top, a ground plane, a 3.3 volt plane and signal on the bottom, with a plated via through all layers. Not to scale.">
      <text className="m" x="20" y="16">4-LAYER STACK-UP · NOT TO SCALE</text>
      {layers}
      <text className="m" x="161" y="152" textAnchor="middle">via</text>
      <line className="wire" x1="206" y1="37" x2="216" y2="37" /><text x="222" y="41">L1 signal</text>
      <line className="wire" x1="206" y1="63" x2="216" y2="63" /><text x="222" y="67">L2 GND</text>
      <line className="wire" x1="206" y1="103" x2="216" y2="103" /><text x="222" y="107">L3 3.3 V</text>
      <line className="wire" x1="206" y1="129" x2="216" y2="129" /><text x="222" y="133">L4 signal</text>
    </svg>
  );
}
