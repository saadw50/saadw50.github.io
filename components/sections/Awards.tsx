export default function Awards() {
  return (
    <section id="awards">
      <div className="sec-head">
        <div className="label">Awards</div>
        <div className="prose"><h2>Recognition</h2></div>
      </div>
      <div className="awards">
        <article className="award">
          <button className="zoom" type="button" data-full="/images/award_solar.jpg" data-cap="Receiving the 2nd-place prize for the single-axis solar tracking panel.">
            <img className="shot" src="/images/award_solar.jpg" alt="Shad and teammates receiving a prize envelope from faculty at a university event" width={1600} height={1200} loading="lazy" />
          </button>
          <span className="ref">Project competition · Department of EEE</span>
          <h3>2nd place, Single-axis solar tracking panel</h3>
          <p>Awarded at the university&apos;s training programme on net metering for on-grid solar systems.</p>
        </article>
        <article className="award">
          <button className="zoom" type="button" data-full="/images/award_documentary.jpg" data-cap="Receiving the Documentary Making Award certificate from university faculty.">
            <img className="shot" src="/images/award_documentary.jpg" alt="Shad receiving a certificate from university officials beside two trophies" width={1600} height={1200} loading="lazy" />
          </button>
          <span className="ref">Jamalpur Science and Technology University</span>
          <h3>Documentary Making Award</h3>
          <p>Certificate of recognition for the documentary films produced for the department and university.</p>
        </article>
      </div>
    </section>
  );
}
