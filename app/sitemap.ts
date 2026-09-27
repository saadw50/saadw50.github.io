import type { MetadataRoute } from "next";
import { SITE_URL, UPDATED_ISO } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: UPDATED_ISO }];
}
