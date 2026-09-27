/* Fig. 1: signal chain of the 8 TX / 1 RX imager (facts: ESP32 + FreeRTOS, MOSFET-driven TX,
   TL072 RX conditioning, envelope detector, MCP3008 over SPI, split boards, star ground). */
export default function SignalChain() {
  return (
    <svg className="dg dg-wide" viewBox="0 0 1000 300" role="img" aria-label="Signal chain. The ESP32 times eight MOSFET drivers that fire the 40 kilohertz transmit array. The echo from the target returns to a separate receive transducer, TL072 conditioning and an envelope detector, is digitised by an MCP3008 over SPI, and is streamed to the PC over USB.">
      <defs>
        <marker id="ah1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="currentColor" />
        </marker>
      </defs>
      <rect className="grp" x="366" y="20" width="420" height="100" rx="8" />
      <text className="m" x="378" y="35">TX SECTION</text>
      <rect className="grp" x="462" y="182" width="368" height="100" rx="8" />
      <text className="m" x="474" y="276">RX SECTION</text>

      <rect className="box" x="12" y="120" width="128" height="60" rx="6" />
      <text className="b" x="76" y="146" textAnchor="middle">PC</text>
      <text className="s" x="76" y="164" textAnchor="middle">Python · Processing</text>

      <rect className="box" x="210" y="30" width="116" height="240" rx="6" />
      <text className="b" x="268" y="136" textAnchor="middle" style={{ fontSize: 14 }}>ESP32</text>
      <text className="s" x="268" y="156" textAnchor="middle">FreeRTOS</text>
      <text className="s" x="268" y="172" textAnchor="middle">cycle-accurate</text>
      <text className="s" x="268" y="186" textAnchor="middle">TX timing</text>

      <line className="wire" x1="142" y1="150" x2="208" y2="150" markerStart="url(#ah1)" markerEnd="url(#ah1)" />
      <text className="m" x="175" y="140" textAnchor="middle">USB · CSV</text>

      <rect className="box" x="380" y="44" width="160" height="62" rx="6" />
      <text className="b" x="460" y="71" textAnchor="middle">8 × MOSFET drivers</text>
      <text className="s" x="460" y="89" textAnchor="middle">one per element</text>
      <rect className="box" x="596" y="44" width="176" height="62" rx="6" />
      <text className="b" x="684" y="71" textAnchor="middle">8 × 40 kHz transmitters</text>
      <text className="m" x="684" y="89" textAnchor="middle">FULL8 · LEFT4 · RIGHT4</text>

      <line className="wire" x1="326" y1="75" x2="378" y2="75" markerEnd="url(#ah1)" />
      <text className="m" x="352" y="66" textAnchor="middle">GPIO</text>
      <line className="wire" x1="540" y1="75" x2="594" y2="75" markerEnd="url(#ah1)" />
      <text className="m" x="567" y="66" textAnchor="middle">drive</text>

      <rect className="box" x="846" y="120" width="140" height="60" rx="6" />
      <text className="b" x="916" y="146" textAnchor="middle">Target</text>
      <text className="s" x="916" y="164" textAnchor="middle">reflector in air</text>
      <path className="wire" d="M772 75C830 75 916 84 916 118" markerEnd="url(#ah1)" />
      <text className="m" x="842" y="64" textAnchor="middle">8-cycle burst</text>
      <path className="wire" d="M916 182C916 222 872 230 820 230" markerEnd="url(#ah1)" />
      <text className="m" x="912" y="246" textAnchor="middle">echo</text>

      <rect className="box" x="356" y="200" width="94" height="60" rx="6" />
      <text className="b" x="403" y="226" textAnchor="middle">MCP3008</text>
      <text className="s" x="403" y="244" textAnchor="middle">10-bit ADC</text>
      <rect className="box hot" x="474" y="200" width="100" height="60" rx="6" />
      <text className="b" x="524" y="226" textAnchor="middle">Envelope</text>
      <text className="s" x="524" y="244" textAnchor="middle">detector</text>
      <text className="hot-t" x="524" y="195" textAnchor="middle">DC-bias fault fixed</text>
      <rect className="box" x="596" y="200" width="100" height="60" rx="6" />
      <text className="b" x="646" y="226" textAnchor="middle">TL072</text>
      <text className="s" x="646" y="244" textAnchor="middle">conditioning</text>
      <rect className="box" x="718" y="200" width="100" height="60" rx="6" />
      <text className="b" x="768" y="226" textAnchor="middle">RX transducer</text>
      <text className="s" x="768" y="244" textAnchor="middle">40 kHz</text>

      <line className="wire" x1="718" y1="230" x2="698" y2="230" markerEnd="url(#ah1)" />
      <line className="wire" x1="596" y1="230" x2="576" y2="230" markerEnd="url(#ah1)" />
      <line className="wire" x1="474" y1="230" x2="452" y2="230" markerEnd="url(#ah1)" />
      <line className="wire" x1="356" y1="230" x2="328" y2="230" markerEnd="url(#ah1)" />
      <text className="m" x="342" y="221" textAnchor="middle">SPI</text>

      <text className="s" x="598" y="155" textAnchor="middle" style={{ fontSize: 11.5 }}>TX and RX on physically split boards · star ground</text>
    </svg>
  );
}
