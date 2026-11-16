import type { ImageData } from 'ui-kit';
import { Image, safeUrl } from 'ui-kit';

// A photo beside a block of color holding a heading, a few lines and a button, edge to edge: for a story, a new
// category or a season. On phones the photo comes first. Without a photo, its block shows a pattern of stripes and a
// circle in the theme's colors.
export const schema = {
  label: 'Color split',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Our story' },
    { id: 'text', type: 'textarea', label: 'Text', default: 'Learn more about who we are and what we make.' },
    { id: 'link_label', type: 'text', label: 'Button label', default: 'Explore the shop' },
    { id: 'link_href', type: 'url', label: 'Button link', default: '/products' },
    { id: 'image', type: 'image', label: 'Photo' },
    { id: 'photo_side', type: 'select', label: 'Photo side (wide screens)', options: ['left', 'right'], default: 'left' },
    { id: 'tone', type: 'select', label: 'Words block color', options: ['highlight', 'accent', 'dark', 'soft', 'sand'], default: 'highlight' },
    { id: 'photo_tone', type: 'select', label: 'Photo block color (shows with no photo)', options: ['accent', 'highlight', 'dark', 'soft', 'sand'], default: 'accent' },
  ],
} as const;

type Props = {
  eyebrow?: string; heading?: string; text?: string; link_label?: string; link_href?: string; image?: ImageData | null; photo_side?: string; tone?: string; photo_tone?: string;
};

const TONES = ['highlight', 'accent', 'dark', 'soft', 'sand'];

// Syne ExtraBold's letter widths in hundredths of an em (measured in Chrome); any other character counts 1.2em (more than
// its widest digit), punctuation .6. ems(): a text's longest word in ems, a little over (the face's tight tracking isn't
// taken off). fit(): a display heading's size, the size asked for but never so big that its longest word overflows its
// column, the nearest element with container-type: inline-size (100cqi). Headings wrap only between words.
const GLYPHS = 'a106b110c99d110e99f67g97h101i36j36k94l36m165n100o102p106q110r56s84t63u100v92w146x98y93z90A116B114C132D130E114F113G134H128I42J100K122L94M158N130O133P118Q133R123S106T110U129V116W188X114Y107Z120';
const WIDTH = new Map((GLYPHS.match(/[A-Za-z]\d+/g) ?? []).map((g) => [g[0], Number(g.slice(1)) / 100]));
const ems = (text: string) => Math.max(4, ...text.split(/\s+/).map((w) => [...w].reduce((n, c) => n + (WIDTH.get(c) ?? (/[.,:;'!-]/.test(c) ? 0.6 : 1.2)), 0))) * 1.03;
const fit = (text: string, size: string) => `min(${size}, calc(100cqi / ${ems(text).toFixed(2)}))`;

export const styles = `
& .tn { background: var(--tn-bg); color: var(--tn-fg); }
& .tn-sand { --tn-bg: var(--uk-color-muted-bg); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-btn: var(--uk-color-accent); --tn-on: var(--uk-color-on-accent); --tn-pop: var(--uk-color-accent); }
& .tn-soft { --tn-bg: var(--uk-color-accent-soft); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-btn: var(--uk-color-accent); --tn-on: var(--uk-color-on-accent); --tn-pop: var(--uk-color-accent); }
& .tn-highlight { --tn-bg: var(--uk-color-highlight); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-heading); --tn-btn: var(--uk-color-heading); --tn-on: var(--uk-color-bg); --tn-pop: var(--uk-color-accent); }
& .tn-accent { --tn-bg: var(--uk-color-accent); --tn-fg: var(--uk-color-on-accent); --tn-fg2: var(--uk-color-on-accent); --tn-btn: var(--uk-color-highlight); --tn-on: var(--uk-color-heading); --tn-pop: var(--uk-color-highlight); }
& .tn-dark { --tn-bg: var(--uk-color-heading); --tn-fg: var(--uk-color-bg); --tn-fg2: color-mix(in srgb, var(--uk-color-bg) 82%, var(--uk-color-heading)); --tn-btn: var(--uk-color-highlight); --tn-on: var(--uk-color-heading); --tn-pop: var(--uk-color-accent); }
& .cs { padding: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); min-height: clamp(440px, 46vw, 640px); }
& .cs--right > .cs-photo { order: 1; }
& .cs-photo { position: relative; overflow: hidden; }
& .cs-photo > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
& .cs-words { container-type: inline-size; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: var(--uk-space-5); padding: clamp(32px, 6vw, 96px); }
& .cs-eyebrow { margin: 0; font-size: var(--uk-text-sm); font-weight: 600; }
& .cs-heading { margin: 0; max-width: 12ch; font-family: var(--uk-font-heading); font-weight: var(--uk-font-heading-weight, 800); line-height: .95; letter-spacing: -.04em; color: var(--tn-fg); text-wrap: balance; hyphens: manual; }
& .cs-text { margin: 0; max-width: 40ch; font-size: clamp(17px, 1.4vw, 20px); line-height: 1.5; color: var(--tn-fg2); }
& .cs-cta { display: inline-flex; align-items: center; min-height: 54px; padding: 0 30px; border-radius: var(--uk-radius-pill); background: var(--tn-btn); color: var(--tn-on); font-size: var(--uk-text-md); font-weight: 700; text-decoration: none; }
& .cs-cta:focus-visible { outline: 3px solid var(--tn-fg); outline-offset: 4px; }
& .cs-art { position: absolute; inset: 0; background: repeating-linear-gradient(-45deg, transparent 0 26px, color-mix(in srgb, var(--tn-fg) 14%, transparent) 26px 40px); }
& .cs-art::before { content: ''; position: absolute; left: 50%; top: 50%; width: 46%; aspect-ratio: 1; border-radius: 50%; background: var(--tn-pop); transform: translate(-50%, -50%); }
& .cs-art::after { content: ''; position: absolute; left: 50%; top: 50%; width: 16%; aspect-ratio: 1; border-radius: 50%; background: var(--tn-bg); transform: translate(-50%, -50%); }
@media (max-width: 900px) {
  & .cs { grid-template-columns: minmax(0, 1fr); min-height: 0; }
  & .cs--right > .cs-photo { order: 0; }
  & .cs-photo { aspect-ratio: 4 / 3; }
}
`;

export default function ColorSplit({ eyebrow, heading, text, link_label, link_href, image, photo_side, tone, photo_tone }: Props) {
  const photo = image && typeof image === 'object' && image.url ? image : null;
  if (!heading && !text && !photo) return null;
  const words = TONES.includes(tone ?? '') ? tone : 'highlight';
  const back = TONES.includes(photo_tone ?? '') ? photo_tone : 'accent';
  const to = { link: link_label ? safeUrl(link_href) : undefined };
  return (
    <section className={photo_side === 'right' ? 'cs cs--right' : 'cs'}>
      <div className={`tn tn-${back} cs-photo`}>
        {photo ? <Image image={photo} sizes="(max-width: 900px) 100vw, 50vw" /> : <span className="cs-art" aria-hidden="true" />}
      </div>
      <div className={`tn tn-${words} cs-words`}>
        {eyebrow ? <p className="cs-eyebrow">{eyebrow}</p> : null}
        {heading ? <h2 className="cs-heading" style={{ fontSize: fit(heading, 'clamp(38px, 5vw, 80px)') }}>{heading}</h2> : null}
        {text ? <p className="cs-text">{text}</p> : null}
        {to.link ? <a className="cs-cta" href={to.link}>{link_label}</a> : null}
      </div>
    </section>
  );
}
