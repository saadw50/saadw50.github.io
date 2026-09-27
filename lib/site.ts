// One place for the facts that appear in metadata, JSON-LD, the footer and the
// sitemap, so they cannot drift apart.

export const SITE_URL = "https://saadw50.github.io";

export const PERSON = {
  name: "Shad Ebny Wahid",
  email: "s23111212@bsfmstu.ac.bd",
  phoneDisplay: "+880 1837 096689",
  phoneHref: "tel:+8801837096689",
  github: "https://github.com/saadw50",
  orcid: "https://orcid.org/0009-0009-5240-1184",
  orcidId: "0009-0009-5240-1184",
  fiverr: "https://www.fiverr.com/shadwahid50",
  university: "Jamalpur Science and Technology University",
  universityFormer:
    "Bangamata Sheikh Fojilatunnesa Mujib Science and Technology University",
} as const;

// Update this when the page content changes. It drives the footer
// "Updated" line, the sitemap <lastmod> and JSON-LD dateModified.
export const UPDATED_ISO = "2026-09-27";

export function updatedLabel(iso: string = UPDATED_ISO): string {
  const [y, m] = iso.split("-").map(Number);
  const month = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][m - 1];
  return `${month} ${y}`;
}
