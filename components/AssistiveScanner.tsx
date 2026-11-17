type AssistiveScannerProps = {
  title: string;
  description: string;
  note: string;
  className?: string;
};

export default function AssistiveScanner({
  title,
  description,
  note,
  className = "",
}: AssistiveScannerProps) {
  return (
    <div className={`paper-scanner ${className}`.trim()}>
      <svg viewBox="0 0 680 430" role="img" aria-labelledby="paper-scanner-title paper-scanner-desc">
        <title id="paper-scanner-title">{title}</title>
        <desc id="paper-scanner-desc">{description}</desc>
        <defs>
          <linearGradient id="paper-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#13242d" />
            <stop offset="1" stopColor="#081117" />
          </linearGradient>
          <radialGradient id="paper-radar" cx="50%" cy="100%" r="80%">
            <stop offset="0" stopColor="#38d5c8" stopOpacity=".2" />
            <stop offset="1" stopColor="#38d5c8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="680" height="430" rx="12" className="paper-scan-bg" />
        <g className="paper-grid-lines" aria-hidden="true">
          <path d="M0 78H680M0 148H680M0 218H680M0 288H680M0 358H680" />
          <path d="M90 0V430M180 0V430M270 0V430M360 0V430M450 0V430M540 0V430M630 0V430" />
        </g>

        <path d="M242 92H438L624 430H56Z" fill="url(#paper-road)" className="paper-road" />
        <path d="M340 92L340 430M287 92L194 430M393 92L486 430" className="paper-lanes" />
        <path d="M340 380L214 126A286 286 0 0 1 466 126Z" fill="url(#paper-radar)" className="paper-radar-area" />
        <g className="paper-radar-rings" aria-hidden="true">
          <path d="M272 314A76 76 0 0 1 408 314" />
          <path d="M227 237A130 130 0 0 1 453 237" />
          <path d="M181 159A182 182 0 0 1 499 159" />
        </g>
        <path d="M340 380L218 138" className="paper-sweep" aria-hidden="true" />

        <g className="paper-target paper-stop">
          <path d="M454 128l14-6 14 6 6 14-6 14-14 6-14-6-6-14z" />
          <text x="468" y="146" textAnchor="middle">STOP</text>
          <rect x="441" y="113" width="54" height="59" rx="5" />
          <text x="468" y="104" textAnchor="middle">YOLOv8</text>
        </g>
        <g className="paper-target paper-obstacle">
          <rect x="203" y="210" width="66" height="46" rx="5" />
          <text x="236" y="203" textAnchor="middle">OBSTACLE</text>
        </g>
        <g className="paper-gps">
          <circle cx="90" cy="72" r="20" />
          <path d="M90 59v26M77 72h26" />
          <text x="122" y="68">GPS LOCK</text>
          <text x="122" y="84">GSM LINK</text>
        </g>

        <g className="paper-vehicle">
          <rect x="296" y="316" width="88" height="58" rx="12" />
          <path d="M311 316l12-24h34l12 24" />
          <circle cx="311" cy="375" r="9" />
          <circle cx="369" cy="375" r="9" />
          <circle cx="340" cy="331" r="7" />
          <path d="M340 324v-17" />
          <path d="M325 340h30" />
        </g>

        <g className="paper-scan-labels">
          <text x="24" y="404">LANE: LOCKED</text>
          <text x="531" y="404">MODE: ASSIST</text>
        </g>
      </svg>

      <div className="paper-readout" aria-hidden="true">
        <span><small>NAV</small><b>PIXEL SUM</b></span>
        <span><small>VISION</small><b>YOLOv8</b></span>
        <span><small>WALLET</small><b>YOLOv11</b></span>
        <span><small>LINK</small><b>GPS / GSM</b></span>
      </div>
      <p>{note}</p>
    </div>
  );
}
