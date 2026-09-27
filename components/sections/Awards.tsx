import Photo from "@/components/Photo";

export default function Awards() {
  return (
    <section id="awards">
      <div className="sec-head">
        <div className="label">Awards</div>
        <div className="prose"><h2>Recognition</h2></div>
      </div>
      <div className="awards">
        <article className="award">
          <Photo
            name="award_solar"
            className="shot"
            alt="Shad and teammates receiving a prize envelope from faculty at a university event"
            sizes="168px"
            zoomCaption="Receiving the 2nd-place prize for the single-axis solar tracking panel."
          />
          <div>
            <span className="ref">Project competition · Department of EEE</span>
            <h3>2nd place, Single-axis solar tracking panel</h3>
            <p>Awarded at the university&apos;s training programme on net metering for on-grid solar systems.</p>
          </div>
        </article>
        <article className="award">
          <Photo
            name="award_documentary"
            className="shot"
            alt="Shad receiving a certificate from university officials beside two trophies"
            sizes="168px"
            zoomCaption="Receiving the Documentary Making Award certificate from university faculty."
          />
          <div>
            <span className="ref">Jamalpur Science and Technology University</span>
            <h3>Documentary Making Award</h3>
            <p>Certificate of recognition for the documentary films produced for the department and university.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
