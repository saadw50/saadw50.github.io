import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found · Shad Ebny Wahid", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="wrap" style={{ paddingBlock: "80px" }}>
      <p className="label">404</p>
      <h1 style={{ fontSize: 40, fontWeight: 800, margin: "12px 0 16px" }}>This page does not exist</h1>
      <p><Link href="/">Go to the home page</Link></p>
    </main>
  );
}
