import EvidenceStrip from "@/components/EvidenceStrip";
import Hero from "@/components/Hero";
import Lightbox from "@/components/Lightbox";
import Nav from "@/components/Nav";
import Awards from "@/components/sections/Awards";
import Boards from "@/components/sections/Boards";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Research from "@/components/sections/Research";
import { About, Contact, Footer, Leadership, Publications, Toolkit } from "@/components/sections/Simple";
import { PERSON, SITE_URL, UPDATED_ISO } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  dateModified: UPDATED_ISO,
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PERSON.name,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/images/headshot.jpg`,
    email: `mailto:${PERSON.email}`,
    jobTitle: "Undergraduate researcher, Electrical and Electronic Engineering",
    affiliation: { "@type": "CollegeOrUniversity", name: PERSON.university, alternateName: PERSON.universityFormer },
    identifier: { "@type": "PropertyValue", propertyID: "ORCID", value: PERSON.orcidId },
    sameAs: [PERSON.github, PERSON.orcid, PERSON.fiverr],
    knowsAbout: ["Mixed-signal hardware", "Power electronics", "PCB design", "Embedded systems", "Ultrasonic phased arrays", "Beamforming"],
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main className="wrap" id="main" tabIndex={-1}>
        <Hero />
        <EvidenceStrip />
        <About />
        <Research />
        <Publications />
        <Boards />
        <Experience />
        <Projects />
        <Awards />
        <Toolkit />
        <Leadership />
        <Contact />
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
