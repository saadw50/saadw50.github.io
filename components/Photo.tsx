import manifest from "@/lib/image-manifest.json";

type Entry = { width: number; height: number; variants: number[]; cropOf?: string };
const MANIFEST = manifest as Record<string, Entry>;

type Props = {
  /** file name in public/images without .jpg, e.g. "board_tx" */
  name: string;
  alt: string;
  /** CSS width of the slot, used by the browser to pick a variant */
  sizes: string;
  className?: string;
  eager?: boolean;
  /** make the photo open full size in the lightbox, with this caption */
  zoomCaption?: string;
};

/* Plain <img> with srcset from lib/image-manifest.json (written by `npm run images`).
   A photo that has no variants yet still works: it falls back to the original file. */
export default function Photo({ name, alt, sizes, className, eager, zoomCaption }: Props) {
  const m = MANIFEST[name];
  const original = `/images/${name}.jpg`;
  const img = m ? (
    <img
      className={className}
      src={`/images/${name}-${m.variants.find((w) => w >= 800) ?? m.variants[m.variants.length - 1]}.jpg`}
      srcSet={[...m.variants.map((w) => `/images/${name}-${w}.jpg ${w}w`), ...(m.cropOf ? [] : [`${original} ${m.width}w`])].join(", ")}
      sizes={sizes}
      width={m.width}
      height={m.height}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  ) : (
    <img className={className} src={original} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
  );
  if (!zoomCaption) return img;
  return (
    <button className="zoom" type="button" data-full={original} data-cap={zoomCaption} aria-haspopup="dialog">
      <span className="vh">Enlarge photo: </span>
      {img}
    </button>
  );
}
