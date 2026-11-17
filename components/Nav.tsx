import Link from "next/link";

const LINKS = [
  ["/", "Home"],
  ["/#work", "Flagships"],
  ["/projects/ultrasonic-imager/", "Transducer"],
  ["/projects/assistive-car/", "Car"],
  ["/projects/", "All projects"],
  ["/#contact", "Contact"],
] as const;

export default function Nav() {
  return (
    <nav aria-label="Sections">
      <div className="wrap">
        <Link className="mark" href="/">SEW&nbsp;/&nbsp;EEE</Link>
        <ul>
          {LINKS.map(([href, text]) => (
            <li key={href}><Link href={href}>{text}</Link></li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
