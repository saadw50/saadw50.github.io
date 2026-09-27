import manifest from "@/lib/image-manifest.json";

type Entry = { width: number; height: number; variants: number[]; cropOf?: string; ext?: string };
const MANIFEST = manifest as Record<string, Entry>;

type Props = {
  /** file name in public/images without the extension, e.g. "board_tx" */
  name: string;
  alt: string;
  /** CSS width of the slot, used by the browser to pick a variant */
  sizes: string;
  className?: string;
  eager?: boolean;
  /** make the image open full size in the lightbox, with this caption */
  zoomCaption?: string;
};

/* Plain <img> with srcset from lib/image-manifest.json (written by `npm run images`).
   An image that has no variants yet still works: it falls back to the original file. */
export default function Photo({ name, alt, sizes, className, eager, zoomCaption }: Props) {
  const m = MANIFEST[name];
  const ext = m?.ext ?? "jpg";
  const original = `/images/${name}.${ext}`;
  const hasVariants = m && m.variants.length > 0;
  const img = m ? (
    <img
      className={className}
      src={hasVariants ? `/images/${name}-${m.variants.find((w) => w >= 800) ?? m.variants[m.variants.length - 1]}.${ext}` : original}
      srcSet={hasVariants ? [...m.variants.map((w) => `/images/${name}-${w}.${ext} ${w}w`), ...(m.cropOf ? [] : [`${original} ${m.width}w`])].join(", ") : undefined}
      sizes={hasVariants ? sizes : undefined}
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
      <span className="vh">Enlarge image: </span>
      {img}
    </button>
  );
}
