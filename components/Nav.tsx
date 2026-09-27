const LINKS = [
  ["#about", "About"],
  ["#research", "Research"],
  ["#publications", "Publications"],
  ["#boards", "PCBs"],
  ["#experience", "Experience"],
  ["#projects", "Projects"],
  ["#contact", "Contact"],
] as const;

export default function Nav() {
  return (
    <nav aria-label="Sections">
      <div className="wrap">
        <a className="mark" href="#main">SEW&nbsp;/&nbsp;EEE</a>
        <ul>
          {LINKS.map(([href, text]) => (
            <li key={href}><a href={href}>{text}</a></li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
