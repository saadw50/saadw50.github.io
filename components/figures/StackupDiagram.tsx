export default function StackupDiagram() {
  return (
    <svg className="dg" viewBox="0 0 520 220" role="img" aria-label="Cross-section of a four-layer board: signal on top, a ground plane, a 3.3 volt plane, and signal on the skin side, with a plated via through all four layers. Not to scale.">
      <rect className="part" x="46" y="16" width="118" height="22" rx="3" />
      <text className="s" x="105" y="31" textAnchor="middle">ESP32-S3</text>
      <rect className="part" x="186" y="24" width="44" height="14" rx="3" />
      <text className="s" x="208" y="20" textAnchor="middle">USB-C</text>
      <rect className="cu" x="30" y="40" width="72" height="6" /><rect className="cu" x="118" y="40" width="58" height="6" /><rect className="cu" x="190" y="40" width="46" height="6" /><rect className="cu" x="250" y="40" width="58" height="6" />
      <rect className="diel" x="30" y="46" width="300" height="24" />
      <rect className="cu" x="30" y="70" width="300" height="6" />
      <rect className="diel" x="30" y="76" width="300" height="40" />
      <rect className="cu" x="30" y="116" width="252" height="6" /><rect className="cu" x="298" y="116" width="32" height="6" />
      <rect className="diel" x="30" y="122" width="300" height="24" />
      <rect className="cu" x="30" y="146" width="44" height="6" /><rect className="cu" x="90" y="146" width="80" height="6" /><rect className="cu" x="186" y="146" width="64" height="6" /><rect className="cu" x="266" y="146" width="42" height="6" />
      <rect className="cu" x="286" y="40" width="8" height="112" />
      <rect className="part" x="96" y="152" width="54" height="16" rx="3" />
      <text className="s" x="123" y="164" textAnchor="middle">PPG</text>
      <rect className="part" x="192" y="152" width="44" height="16" rx="3" />
      <text className="s" x="214" y="164" textAnchor="middle">IMU</text>
      <path className="wire" d="M30 190c20-7 40 7 60 0s40 7 60 0 40 7 60 0 40 7 60 0 40 7 60 0" style={{ color: "var(--line-strong)" }} />
      <text className="m" x="30" y="210">SKIN</text>
      <line className="wire" x1="342" y1="43" x2="358" y2="43" /><text x="364" y="47">L1 signal · top</text>
      <line className="wire" x1="342" y1="73" x2="358" y2="73" /><text x="364" y="77">L2 GND plane</text>
      <line className="wire" x1="342" y1="119" x2="358" y2="119" /><text x="364" y="123">L3 3.3 V plane</text>
      <line className="wire" x1="342" y1="149" x2="358" y2="149" /><text x="364" y="153">L4 signal · skin side</text>
      <text className="m" x="318" y="14">VIA</text>
      <line className="wire" x1="314" y1="11" x2="296" y2="36" style={{ color: "var(--line-strong)" }} />
      <text className="m" x="364" y="200">1.0 mm · not to scale</text>
    </svg>
  );
}
