import type { CSSProperties } from "react";
import Photo from "@/components/Photo";
import StackupMini from "@/components/figures/StackupMini";
import { BOARDS } from "@/data/boards";

export default function Boards() {
  return (
    <section id="boards">
      <div className="sec-head">
        <div className="label">PCB design</div>
        <div>
          <h2>Boards I&apos;ve designed</h2>
          <p className="sec-sub">Two ultrasonic boards designed, built and debugged, and a 4-layer wearable layout delivered as a manufacturing-ready package.</p>
        </div>
      </div>
      <div className="boards">
        {BOARDS.map((b) => (
          <article className="bc" key={b.id}>
            {b.photo ? (
              <div className="bc-media" style={b.photo.focus ? ({ "--focus": b.photo.focus } as CSSProperties) : undefined}>
                <Photo name={b.photo.name} alt={b.photo.alt} sizes="(max-width: 700px) calc(100vw - 40px), 340px" zoomCaption={b.photo.caption} />
              </div>
            ) : (
              <div className="bc-media diagram"><StackupMini /></div>
            )}
            <div className="bc-t">
              <span className="ref">{b.kicker}</span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
              {b.note && <p className="note">{b.note}</p>}
              <div className="chips">{b.chips.map((c) => <span key={c}>{c}</span>)}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
