import type { ImageData, SiteInfo } from 'ui-kit';
import { Image, safeUrl, sectionColours } from 'ui-kit';

// The opening screen as two flat blocks of color: the words on one (the title as large as its longest word allows), the
// photo on the other, side by side on wide screens and stacked on phones (words first, so the title is the first thing a
// shopper reads). Without a photo the second block shows a pattern of circles and stripes drawn in the theme's colors.
// "Words only" drops the second block and lets the title run the full width. Every color is a theme color (the block
// colors below), so the Theme tab recolors it; the text block's own color fields win over its block color.
export const schema = {
  label: 'Color block hero',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'title', type: 'text', label: 'Title (empty: the store\'s name)', default: 'Discover our latest products' },
    { id: 'text', type: 'textarea', label: 'Text', default: 'Shop new arrivals and best sellers.' },
    { id: 'cta_label', type: 'text', label: 'Button label', default: 'Shop all' },
    { id: 'cta_href', type: 'url', label: 'Button link', default: '/products' },
    { id: 'secondary_label', type: 'text', label: 'Second button label' },
    { id: 'secondary_href', type: 'url', label: 'Second button link' },
    { id: 'image', type: 'image', label: 'Photo' },
    { id: 'layout', type: 'select', label: 'Layout', options: ['side by side', 'words only'], default: 'side by side' },
    { id: 'photo_side', type: 'select', label: 'Photo side (wide screens)', options: ['right', 'left'], default: 'right' },
    { id: 'title_size', type: 'select', label: 'Title size', options: ['huge', 'large'], default: 'huge' },
    { id: 'tone', type: 'select', label: 'Words block color', options: ['accent', 'highlight', 'dark', 'soft', 'sand', 'page'], default: 'accent' },
    { id: 'photo_tone', type: 'select', label: 'Photo block color (shows around a photo with transparency, or the pattern)', options: ['highlight', 'accent', 'dark', 'soft', 'sand', 'page'], default: 'highlight' },
    { id: 'height', type: 'select', label: 'Height (wide screens)', options: ['tall', 'medium'], default: 'tall' },
    { id: 'background_colour', type: 'color', label: 'Words block: background color' },
    { id: 'text_colour', type: 'color', label: 'Words block: text color' },
  ],
} as const;

type Props = {
  site?: SiteInfo; eyebrow?: string; title?: string; text?: string; cta_label?: string; cta_href?: string; secondary_label?: string; secondary_href?: string;
  image?: ImageData | null; layout?: string; photo_side?: string; title_size?: string; tone?: string; photo_tone?: string; height?: string;
  background_colour?: string; text_colour?: string;
};

const TONES = ['accent', 'highlight', 'dark', 'soft', 'sand', 'page'];
const toneOf = (v: unknown, dflt: string) => (typeof v === 'string' && TONES.includes(v) ? v : dflt);

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
& .tn-page, & .tn-sand { --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-btn: var(--uk-color-accent); --tn-on: var(--uk-color-on-accent); --tn-link: var(--uk-color-accent-text, var(--uk-color-accent)); --tn-pop: var(--uk-color-highlight); --tn-deep: var(--uk-color-heading); }
& .tn-page { --tn-bg: var(--uk-color-bg); }
& .tn-sand { --tn-bg: var(--uk-color-muted-bg); }
& .tn-soft { --tn-bg: var(--uk-color-accent-soft); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-btn: var(--uk-color-accent); --tn-on: var(--uk-color-on-accent); --tn-link: var(--uk-color-accent-strong); --tn-pop: var(--uk-color-accent); --tn-deep: var(--uk-color-heading); }
& .tn-highlight { --tn-bg: var(--uk-color-highlight); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-heading); --tn-btn: var(--uk-color-heading); --tn-on: var(--uk-color-bg); --tn-link: var(--uk-color-heading); --tn-pop: var(--uk-color-accent); --tn-deep: var(--uk-color-heading); }
& .tn-accent { --tn-bg: var(--uk-color-accent); --tn-fg: var(--uk-color-on-accent); --tn-fg2: var(--uk-color-on-accent); --tn-btn: var(--uk-color-highlight); --tn-on: var(--uk-color-heading); --tn-link: var(--uk-color-on-accent); --tn-pop: var(--uk-color-highlight); --tn-deep: var(--uk-color-heading); }
& .tn-dark { --tn-bg: var(--uk-color-heading); --tn-fg: var(--uk-color-bg); --tn-fg2: color-mix(in srgb, var(--uk-color-bg) 82%, var(--uk-color-heading)); --tn-btn: var(--uk-color-highlight); --tn-on: var(--uk-color-heading); --tn-link: var(--uk-color-highlight); --tn-pop: var(--uk-color-accent); --tn-deep: var(--uk-color-accent); }
& .tn-in { --uk-color-bg: var(--tn-bg); --uk-color-surface: var(--tn-bg); --uk-color-heading: var(--tn-fg); --uk-color-ink: var(--tn-fg); --uk-color-text-muted: var(--tn-fg2); --uk-color-text-subtle: var(--tn-fg2); --uk-color-accent: var(--tn-btn); --uk-color-on-accent: var(--tn-on); --uk-color-accent-text: var(--tn-link); --uk-color-line: color-mix(in srgb, var(--tn-fg) 22%, transparent); --uk-color-line-strong: var(--tn-fg); --uk-color-outline: var(--tn-fg); --uk-color-tile: color-mix(in srgb, var(--tn-fg) 9%, var(--tn-bg)); }
& .hr { padding: 0; --hr-pad: clamp(24px, 5vw, 72px); display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); min-height: var(--hr-height); }
& .hr--left { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
& .hr--left > .hr-photo { order: -1; }
& .hr--solo { grid-template-columns: minmax(0, 1fr); }
& .hr-words { container-type: inline-size; display: flex; flex-direction: column; justify-content: flex-end; gap: var(--uk-space-5); padding: var(--hr-pad); }
& .hr-title { margin: 0; font-family: var(--uk-font-heading); font-weight: var(--uk-font-heading-weight, 800); line-height: .92; letter-spacing: -.04em; color: var(--uk-color-heading); text-wrap: balance; hyphens: manual; }
& .hr-eyebrow { margin: 0; display: inline-flex; align-self: flex-start; padding: 6px 14px; border: 2px solid currentColor; border-radius: var(--uk-radius-pill); font-size: var(--uk-text-sm); font-weight: 600; }
& .hr-text { margin: 0; max-width: 34ch; font-size: clamp(18px, 1.7vw, 22px); line-height: 1.4; color: var(--uk-color-text-muted); }
& .hr-actions { display: flex; flex-wrap: wrap; gap: 12px; }
& .hr-photo { position: relative; overflow: hidden; min-height: 280px; }
& .hr-photo > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
& .hr-art { position: absolute; inset: 0; }
& .hr-art > span { position: absolute; display: block; }
& .hr-sun { width: 62%; aspect-ratio: 1; right: -8%; top: 10%; border-radius: 50%; background: var(--tn-pop); }
& .hr-half { width: 54%; aspect-ratio: 2 / 1; left: 8%; bottom: 0; border-radius: 999px 999px 0 0; background: var(--tn-deep); }
& .hr-bars { width: 30%; height: 34%; left: 10%; top: 12%; background: repeating-linear-gradient(90deg, var(--tn-fg) 0 10px, transparent 10px 22px); }
& .hr-dot { width: 14%; aspect-ratio: 1; right: 18%; bottom: 14%; border-radius: 50%; background: var(--uk-color-bg); box-shadow: 0 0 0 6px var(--tn-fg); }
@media (max-width: 900px) {
  & .hr, & .hr--left { grid-template-columns: minmax(0, 1fr); min-height: 0; }
  & .hr--left > .hr-photo { order: 0; }
  & .hr-words { padding-top: calc(var(--hr-pad) * 1.6); }
  & .hr-photo { min-height: 0; aspect-ratio: 5 / 4; }
}
`;

export default function ColorHero({ site, eyebrow, title, text, cta_label, cta_href, secondary_label, secondary_href, image, layout, photo_side, title_size, tone, photo_tone, height, ...colours }: Props) {
  const heading = (title || site?.store.name || '').trim();
  const solo = layout === 'words only';
  const huge = title_size !== 'large';
  const to = { cta: cta_label ? safeUrl(cta_href) : undefined, second: secondary_label ? safeUrl(secondary_href) : undefined };
  const photo = image && typeof image === 'object' && image.url ? image : null;
  const words = toneOf(tone, 'accent');
  const back = toneOf(photo_tone, 'highlight');
  const tall = height !== 'medium';
  const own = !!sectionColours(colours); // the merchant's own colors, in place of the block color
  if (!heading && !text && !photo) return null;
  return (
    <section className={solo ? 'hr hr--solo' : photo_side === 'left' ? 'hr hr--left' : 'hr'} style={{ '--hr-height': tall ? 'min(760px, calc(100vh - var(--uk-header-sticky, 0px)))' : '520px' }}>
      <div className={own ? undefined : `tn tn-${words}`} style={{ display: 'flex', ...sectionColours(colours) }}>
        <div className={own ? 'hr-words' : 'tn-in hr-words'} style={{ flex: '1 1 auto' }}>
          {eyebrow ? <p className="hr-eyebrow">{eyebrow}</p> : null}
          {heading ? <h1 className="hr-title" style={{ fontSize: fit(heading, huge ? 'clamp(54px, 9.4vw, 150px)' : 'clamp(44px, 6.6vw, 104px)') }}>{heading}</h1> : null}
          {text ? <p className="hr-text">{text}</p> : null}
          {to.cta || to.second ? (
            <div className="hr-actions">
              {to.cta ? <a className="uk-button uk-button--primary" href={to.cta}>{cta_label}</a> : null}
              {to.second ? <a className="uk-button uk-button--secondary" href={to.second}>{secondary_label}</a> : null}
            </div>
          ) : null}
        </div>
      </div>
      {solo ? null : (
        <div className={`tn tn-${back} hr-photo`}>
          {photo ? (
            <Image image={photo} sizes="(max-width: 900px) 100vw, 42vw" priority />
          ) : (
            <div className="hr-art" aria-hidden="true">
              <span className="hr-sun" />
              <span className="hr-half" />
              <span className="hr-bars" />
              <span className="hr-dot" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
