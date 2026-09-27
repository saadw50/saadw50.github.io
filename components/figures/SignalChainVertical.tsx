/* Fig. 1 for narrow screens: the transmit chain runs down the left, the echo comes back up the
   receive chain on the right. Same facts as the wide version. */
export default function SignalChainVertical() {
  return (
    <svg className="dg" viewBox="0 0 360 432" role="img" aria-label="Signal chain. The PC talks to the ESP32 over USB. The ESP32 times eight MOSFET drivers that fire the 40 kilohertz transmit array. The burst reflects off the target, and the echo returns through the receive transducer, TL072 conditioning and the envelope detector to an MCP3008 ADC, read by the ESP32 over SPI.">
      <defs>
        <marker id="ah3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="currentColor" />
        </marker>
      </defs>
      <rect className="box" x="120" y="8" width="120" height="34" rx="6" />
      <text className="b" x="180" y="23" textAnchor="middle">PC</text>
      <text className="s" x="180" y="36" textAnchor="middle">Python · Processing</text>
      <line className="wire" x1="180" y1="42" x2="180" y2="62" markerStart="url(#ah3)" markerEnd="url(#ah3)" />
      <text className="m" x="190" y="56">USB · CSV</text>

      <rect className="box" x="16" y="64" width="328" height="42" rx="6" />
      <text className="b" x="180" y="82" textAnchor="middle" style={{ fontSize: 14 }}>ESP32 · FreeRTOS</text>
      <text className="s" x="180" y="98" textAnchor="middle">cycle-accurate TX timing</text>

      <text className="m" x="12" y="126">TX SECTION</text>
      <rect className="grp" x="8" y="132" width="166" height="146" rx="8" />
      <line className="wire" x1="91" y1="106" x2="91" y2="140" markerEnd="url(#ah3)" />
      <text className="m" x="98" y="124">GPIO</text>
      <rect className="box" x="16" y="142" width="150" height="46" rx="6" />
      <text className="b" x="91" y="162" textAnchor="middle">8 × MOSFET drivers</text>
      <text className="s" x="91" y="178" textAnchor="middle">one per element</text>
      <line className="wire" x1="91" y1="188" x2="91" y2="218" markerEnd="url(#ah3)" />
      <text className="m" x="98" y="207">drive</text>
      <rect className="box" x="16" y="220" width="150" height="48" rx="6" />
      <text className="b" x="91" y="240" textAnchor="middle">8 × 40 kHz transmitters</text>
      <text className="m" x="91" y="257" textAnchor="middle">FULL8 · LEFT4 · RIGHT4</text>

      <rect className="box" x="194" y="126" width="150" height="40" rx="6" />
      <text className="b" x="269" y="143" textAnchor="middle">MCP3008</text>
      <text className="s" x="269" y="158" textAnchor="middle">10-bit ADC</text>
      <line className="wire" x1="269" y1="126" x2="269" y2="108" markerEnd="url(#ah3)" />
      <text className="m" x="276" y="121">SPI</text>

      <text className="m" x="190" y="184">RX SECTION</text>
      <rect className="grp" x="186" y="190" width="166" height="152" rx="8" />
      <rect className="box hot" x="194" y="196" width="150" height="36" rx="6" />
      <text className="b" x="269" y="211" textAnchor="middle">Envelope detector</text>
      <text className="hot-t" x="269" y="226" textAnchor="middle">DC-bias fault fixed</text>
      <line className="wire" x1="269" y1="196" x2="269" y2="168" markerEnd="url(#ah3)" />
      <rect className="box" x="194" y="248" width="150" height="34" rx="6" />
      <text className="b" x="269" y="263" textAnchor="middle">TL072</text>
      <text className="s" x="269" y="276" textAnchor="middle">conditioning</text>
      <line className="wire" x1="269" y1="248" x2="269" y2="234" markerEnd="url(#ah3)" />
      <rect className="box" x="194" y="298" width="150" height="36" rx="6" />
      <text className="b" x="269" y="313" textAnchor="middle">RX transducer</text>
      <text className="s" x="269" y="327" textAnchor="middle">40 kHz</text>
      <line className="wire" x1="269" y1="298" x2="269" y2="284" markerEnd="url(#ah3)" />

      <rect className="box" x="110" y="358" width="140" height="40" rx="6" />
      <text className="b" x="180" y="375" textAnchor="middle">Target</text>
      <text className="s" x="180" y="390" textAnchor="middle">reflector in air</text>
      <path className="wire" d="M91 268C91 336 96 378 108 378" markerEnd="url(#ah3)" />
      <text className="m" x="100" y="318">8-cycle burst</text>
      <path className="wire" d="M252 378C266 378 269 360 269 336" markerEnd="url(#ah3)" />
      <text className="m" x="276" y="362">echo</text>

      <text className="s" x="180" y="422" textAnchor="middle" style={{ fontSize: 11.5 }}>TX and RX on physically split boards · star ground</text>
    </svg>
  );
}
