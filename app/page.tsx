import Hero from "@/components/Hero";
import Lightbox from "@/components/Lightbox";
import Nav from "@/components/Nav";
import Awards from "@/components/sections/Awards";
import Boards from "@/components/sections/Boards";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Research from "@/components/sections/Research";
import { About, Contact, Education, Footer, Leadership, Publications, Toolkit } from "@/components/sections/Simple";
import { PERSON, SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON.name,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/images/headshot.jpg`,
  jobTitle: "Undergraduate researcher, Electrical and Electronic Engineering",
  affiliation: { "@type": "CollegeOrUniversity", name: PERSON.university },
  email: `mailto:${PERSON.email}`,
  sameAs: [PERSON.github, PERSON.orcid, PERSON.fiverr],
  knowsAbout: ["Power electronics", "Mixed-signal hardware", "PCB design", "Embedded systems", "Ultrasonic phased arrays", "Beamforming"],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main className="wrap" id="top">
        <Hero />
        <About />
        <Education />
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
