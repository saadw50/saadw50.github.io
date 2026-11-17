import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type ProjectPageHeaderProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children?: ReactNode;
};

export default function ProjectPageHeader({ eyebrow, title, summary, children }: ProjectPageHeaderProps) {
  return (
    <header className="project-intro">
      <Link className="project-back" href="/"><ArrowLeft aria-hidden="true" size={16} /> Portfolio home</Link>
      <span className="label">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{summary}</p>
      {children && <div className="project-actions">{children}</div>}
    </header>
  );
}
