export default function WristbandArchitecture() {
  return (
    <svg className="dg" viewBox="0 0 520 262" role="img" aria-label="Block diagram. PPG sensor and IMU talk to the ESP32-S3 over I2C and the ECG front-end over an analog line. The ESP32-S3 drives an OLED display over I2C and logs to microSD. Power runs from USB-C through a charger to a 500 mAh LiPo and a 3.3 volt regulator that supplies the board.">
      <defs>
        <marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="currentColor" />
        </marker>
      </defs>
      <rect className="box" x="10" y="14" width="118" height="44" rx="6" /><text className="b" x="69" y="33" textAnchor="middle">PPG sensor</text><text className="s" x="69" y="49" textAnchor="middle">MAX30102</text>
      <rect className="box" x="10" y="78" width="118" height="44" rx="6" /><text className="b" x="69" y="97" textAnchor="middle">ECG front-end</text><text className="s" x="69" y="113" textAnchor="middle">single lead</text>
      <rect className="box" x="10" y="142" width="118" height="44" rx="6" /><text className="b" x="69" y="161" textAnchor="middle">IMU</text><text className="s" x="69" y="177" textAnchor="middle">MPU-6050</text>
      <rect className="box" x="200" y="70" width="120" height="60" rx="6" /><text className="b" x="260" y="96" textAnchor="middle">ESP32-S3</text><text className="s" x="260" y="113" textAnchor="middle">MCU · Wi-Fi · BLE</text>
      <rect className="box" x="392" y="30" width="118" height="44" rx="6" /><text className="b" x="451" y="57" textAnchor="middle">OLED display</text>
      <rect className="box" x="392" y="104" width="118" height="44" rx="6" /><text className="b" x="451" y="123" textAnchor="middle">microSD</text><text className="s" x="451" y="139" textAnchor="middle">data logging</text>
      <path className="wire" d="M128 36L198 84" markerEnd="url(#ah2)" /><text className="m" x="160" y="52" textAnchor="middle">I²C</text>
      <line className="wire" x1="128" y1="100" x2="198" y2="100" markerEnd="url(#ah2)" /><text className="m" x="163" y="93" textAnchor="middle">analog</text>
      <path className="wire" d="M128 164L198 118" markerEnd="url(#ah2)" /><text className="m" x="158" y="163" textAnchor="middle">I²C</text>
      <path className="wire" d="M320 88L390 56" markerEnd="url(#ah2)" /><text className="m" x="352" y="62" textAnchor="middle">I²C</text>
      <path className="wire" d="M320 114L390 124" markerEnd="url(#ah2)" /><text className="m" x="355" y="130" textAnchor="middle">logs</text>
      <rect className="box" x="10" y="216" width="84" height="34" rx="6" /><text className="b" x="52" y="237" textAnchor="middle">USB-C</text>
      <rect className="box" x="130" y="216" width="92" height="34" rx="6" /><text className="b" x="176" y="237" textAnchor="middle">Charger</text>
      <rect className="box" x="258" y="216" width="112" height="34" rx="6" /><text className="b" x="314" y="237" textAnchor="middle">LiPo 500 mAh</text>
      <rect className="box" x="406" y="216" width="104" height="34" rx="6" /><text className="b" x="458" y="237" textAnchor="middle">3.3 V reg.</text>
      <line className="wire" x1="94" y1="233" x2="128" y2="233" markerEnd="url(#ah2)" />
      <line className="wire" x1="222" y1="233" x2="256" y2="233" markerEnd="url(#ah2)" />
      <line className="wire" x1="370" y1="233" x2="404" y2="233" markerEnd="url(#ah2)" />
      <path className="wire" d="M458 216V190H290V132" markerEnd="url(#ah2)" /><text className="m" x="374" y="184" textAnchor="middle">3.3 V rail</text>
    </svg>
  );
}
