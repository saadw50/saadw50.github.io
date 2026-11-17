import type { Metadata } from "next";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";
import Nav from "@/components/Nav";
import ProjectPageHeader from "@/components/ProjectPageHeader";
import Awards from "@/components/sections/Awards";
import Boards from "@/components/sections/Boards";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import { About, Footer, Leadership, Toolkit } from "@/components/sections/Simple";

export const metadata: Metadata = {
  title: "Project archive · Shad Ebny Wahid",
  description: "PCB design, paid engineering work, magnetics, renewable-energy projects, awards, tools and leadership.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main className="wrap" id="main" tabIndex={-1}>
        <ProjectPageHeader
          eyebrow="Complete portfolio"
          title="Project archive"
          summary="The supporting record behind the two flagship systems: background, PCB work, paid roles, engineering builds, awards, technical tools and leadership."
        >
          <Link className="btn primary" href="#boards">Start with PCB work</Link>
          <Link className="btn" href="/#work">Return to the flagships</Link>
        </ProjectPageHeader>

        <About />
        <Boards />
        <Experience />
        <Projects />
        <Awards />
        <Toolkit />
        <Leadership />
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
