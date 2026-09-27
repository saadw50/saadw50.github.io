import Photo from "@/components/Photo";
import { AUDIT_50, BROADSIDE_GRATING_DEG, DELAY_FIT, MATERIALS, PITCH_MM, TX1_RUN } from "@/lib/acoustics";

/* Fig. 3: the owner's bench measurements. Numbers in the captions come from lib/acoustics.ts,
   which records them as they appear on the owner's plots and in the repository README. */
const SIZES = "(max-width: 860px) calc(100vw - 80px), 500px";

export default function MeasuredResults() {
  const fit = `y = ${DELAY_FIT.slope}x + ${DELAY_FIT.offsetUs} µs, R² = ${DELAY_FIT.r2}, RMSE ${DELAY_FIT.rmseNs} ns`;
  const materials = MATERIALS.map(([m, n]) => `${m} (n = ${n})`).join(", ");
  return (
    <figure className="fig" id="fig3">
      <figcaption className="fig-h"><span className="ref">Fig. 3</span><h3>Measured on the bench</h3></figcaption>
      <div className="meas">
        <figure>
          <Photo
            name="fig_delay_fit"
            className="plot"
            alt="Scatter plot of measured against theoretical relative firing delay from minus 80 to plus 80 microseconds. Every point lies on the ideal y equals x line."
            sizes={SIZES}
            zoomCaption={`Fig. 3a. Measured against theoretical relative firing delay. Fit: ${fit}.`}
          />
          <figcaption><b>a. Transmit timing.</b> Measured relative firing delays against the true-time-delay schedule. Fit: {fit}.</figcaption>
        </figure>
        <figure>
          <Photo
            name="fig_tx1_54cm"
            className="plot"
            alt={`Scatter plot of ${TX1_RUN.bursts} TX1 range readings at a known ${TX1_RUN.targetCm} cm, clustered within about a quarter centimetre of the target line.`}
            sizes={SIZES}
            zoomCaption={`Fig. 3b. TX1 after filtering: ${TX1_RUN.bursts} bursts at a known ${TX1_RUN.targetCm} cm, mean ${TX1_RUN.meanCm.toFixed(2)} cm, SD ${TX1_RUN.sdCm} cm.`}
          />
          <figcaption><b>b. TX1 ranging.</b> TX1 alone, after filtering: {TX1_RUN.bursts} bursts at a known {TX1_RUN.targetCm} cm, mean {TX1_RUN.meanCm.toFixed(2)} cm, SD {TX1_RUN.sdCm} cm.</figcaption>
        </figure>
        <figure>
          <Photo
            name="fig_steer_yaw"
            className="plot"
            alt="Line plot of relative median echo peak in decibels against electronic steering angle from minus 45 to plus 45 degrees, for yaw angles of minus 10, 0 and plus 10 degrees, with dashed lines at plus and minus 30.7 degrees."
            sizes={SIZES}
            zoomCaption={`Fig. 3c. Median echo peak against electronic steering angle at three yaw angles. Dashed lines: ±${BROADSIDE_GRATING_DEG.toFixed(1)}°.`}
          />
          <figcaption><b>c. Steering sweep.</b> Median echo peak against electronic steering angle, recorded at yaw −10°, 0° and +10°. Dashed lines: ±{BROADSIDE_GRATING_DEG.toFixed(1)}°, where the broadside grating lobes of the {PITCH_MM} mm array sit (Fig. 4).</figcaption>
        </figure>
        <figure>
          <Photo
            name="fig_materials_50cm"
            className="plot"
            alt="Two panels: band-passed echo waveforms and their envelopes in decibels for glass, plastic, wall and wood targets at 50 centimetres."
            sizes={SIZES}
            zoomCaption="Fig. 3d. Median band-passed echo and analytic-signal envelope for four materials at 50 cm."
          />
          <figcaption><b>d. Four materials at 50 cm.</b> Median band-passed echo and analytic-signal envelope for {materials}, for the material-classification study.</figcaption>
        </figure>
      </div>
      <p className="cap">
        All four plots are measurements from the real 8 TX / 1 RX array. A separate raw-waveform audit at {AUDIT_50.distanceCm.toFixed(1)} cm ({AUDIT_50.sessions} sessions, {AUDIT_50.captures.toLocaleString("en")} captures over {AUDIT_50.angles} electronic angles from −15° to +15°, {AUDIT_50.repeatsMin}–{AUDIT_50.repeatsMax} repeats per angle) measured {AUDIT_50.snrMinDb}–{AUDIT_50.snrMaxDb} dB mean echo SNR and a repeatable uncorrected range bias of +{AUDIT_50.biasCm} ± {AUDIT_50.biasSdCm} cm.
      </p>
    </figure>
  );
}
