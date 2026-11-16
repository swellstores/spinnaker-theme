import { safeUrl, sectionColours } from 'ui-kit';

// Two lines of brand voice set as large as the page allows, on a full-width block of color: the first line in the
// block's text color, the second in a second color. A round sticker with a few words can sit on the corner. With a
// link, a button under the words.
export const schema = {
  label: 'Statement block',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'line_one', type: 'text', label: 'First line', default: 'Shop the' },
    { id: 'line_two', type: 'text', label: 'Second line (in the second color)', default: 'latest arrivals.' },
    { id: 'sticker', type: 'text', label: 'Sticker (a few words; empty: no sticker)', default: 'New in' },
    { id: 'link_label', type: 'text', label: 'Button label', default: 'Shop now' },
    { id: 'link_href', type: 'url', label: 'Button link', default: '/products' },
    { id: 'size', type: 'select', label: 'Size', options: ['huge', 'large'], default: 'huge' },
    { id: 'align', type: 'select', label: 'Alignment', options: ['left', 'center'], default: 'left' },
    { id: 'tone', type: 'select', label: 'Block color', options: ['dark', 'accent', 'highlight', 'soft', 'sand', 'page'], default: 'dark' },
    { id: 'second', type: 'select', label: 'Second color', options: ['highlight', 'accent', 'soft'], default: 'highlight' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
  ],
} as const;

type Props = {
  eyebrow?: string; line_one?: string; line_two?: string; sticker?: string; link_label?: string; link_href?: string; size?: string; align?: string; tone?: string;
  second?: string; background_colour?: string; text_colour?: string;
};

const TONES = ['dark', 'accent', 'highlight', 'soft', 'sand', 'page'];
// the second color for each block color, when the one asked for wouldn't read on it
const CLASH: Record<string, Record<string, string>> = {
  accent: { accent: 'highlight', soft: 'highlight' },
  highlight: { highlight: 'accent', soft: 'accent' },
  soft: { soft: 'accent', highlight: 'accent' },
  sand: { highlight: 'accent', soft: 'accent' },
  page: { highlight: 'accent', soft: 'accent' },
};

// Syne ExtraBold's letter widths in hundredths of an em (measured in Chrome); any other character counts 1.2em (more than
// its widest digit), punctuation .6. ems(): a text's longest word in ems, a little over (the face's tight tracking isn't
// taken off). fit(): a display heading's size, the size asked for but never so big that its longest word overflows its
// column, the nearest element with container-type: inline-size (100cqi), less the sticker's room. Headings wrap only
// between words.
const GLYPHS = 'a106b110c99d110e99f67g97h101i36j36k94l36m165n100o102p106q110r56s84t63u100v92w146x98y93z90A116B114C132D130E114F113G134H128I42J100K122L94M158N130O133P118Q133R123S106T110U129V116W188X114Y107Z120';
const WIDTH = new Map((GLYPHS.match(/[A-Za-z]\d+/g) ?? []).map((g) => [g[0], Number(g.slice(1)) / 100]));
const ems = (text: string) => Math.max(4, ...text.split(/\s+/).map((w) => [...w].reduce((n, c) => n + (WIDTH.get(c) ?? (/[.,:;'!-]/.test(c) ? 0.6 : 1.2)), 0))) * 1.03;
const fit = (text: string, size: string) => `min(${size}, calc((100cqi - var(--sb-room, 0px)) / ${ems(text).toFixed(2)}))`;

export const styles = `
& .sb { position: relative; overflow: hidden; padding: clamp(64px, 9vw, 140px) 0; }
& .sb-dark { background: var(--uk-color-heading); color: var(--uk-color-bg); }
& .sb-accent { background: var(--uk-color-accent); color: var(--uk-color-on-accent); }
& .sb-highlight { background: var(--uk-color-highlight); color: var(--uk-color-heading); }
& .sb-soft { background: var(--uk-color-accent-soft); color: var(--uk-color-heading); }
& .sb-sand { background: var(--uk-color-muted-bg); color: var(--uk-color-heading); }
& .sb-page { color: var(--uk-color-heading); }
& .sb-2-highlight { --sb-two: var(--uk-color-highlight); --sb-two-on: var(--uk-color-heading); }
& .sb-2-accent { --sb-two: var(--uk-color-accent); --sb-two-on: var(--uk-color-on-accent); }
& .sb-2-soft { --sb-two: var(--uk-color-accent-soft); --sb-two-on: var(--uk-color-heading); }
& .sb-words { position: relative; z-index: 1; margin: 0; font-family: var(--uk-font-heading); font-weight: var(--uk-font-heading-weight, 800); line-height: 1; letter-spacing: -.045em; text-wrap: balance; hyphens: manual; }
& .sb-in { container-type: inline-size; }
& .sb-words > span { display: block; }
& .sb-two { color: var(--sb-two); }
& .sb-eyebrow { margin: 0 0 var(--uk-space-5); font-size: var(--uk-text-sm); font-weight: 600; opacity: .9; }
& .sb-cta { display: inline-flex; align-items: center; min-height: 56px; margin-top: var(--uk-space-7); padding: 0 32px; border-radius: var(--uk-radius-pill); background: var(--sb-two); color: var(--sb-two-on); font-size: var(--uk-text-md); font-weight: 700; text-decoration: none; }
& .sb-cta:focus-visible { outline: 3px solid currentColor; outline-offset: 4px; }
& .sb-sticker { position: absolute; z-index: 2; right: clamp(16px, 6vw, 96px); top: clamp(24px, 5vw, 72px); display: grid; place-items: center; width: clamp(104px, 13vw, 176px); aspect-ratio: 1; padding: 14px; border-radius: 50%; background: var(--sb-two); color: var(--sb-two-on); font-family: var(--uk-font-heading); font-size: clamp(15px, 1.6vw, 21px); font-weight: 800; line-height: 1.05; text-align: center; transform: rotate(-12deg); }
& .sb--sticker { --sb-room: clamp(112px, 15vw, 210px); }
& .sb--sticker .sb-words { padding-right: var(--sb-room); }
& .sb-ring { position: absolute; z-index: 0; right: -12vw; bottom: -30vw; width: 46vw; aspect-ratio: 1; border-radius: 50%; border: clamp(18px, 2.4vw, 36px) solid var(--sb-two); }
@media (max-width: 560px) {
  & .sb-sticker { position: relative; right: auto; top: auto; margin: 0 0 var(--uk-space-5) auto; }
  & .sb--sticker { --sb-room: 0px; }
  & .sb-ring { width: 80vw; bottom: -56vw; }
}
`;

export default function StatementBlock({ eyebrow, line_one, line_two, sticker, link_label, link_href, size = 'huge', align = 'left', tone = 'dark', second = 'highlight', ...colours }: Props) {
  const one = String(line_one ?? '').trim();
  const two = String(line_two ?? '').trim();
  if (!one && !two) return null;
  const block = TONES.includes(tone) ? tone : 'dark';
  const pick = ['highlight', 'accent', 'soft'].includes(second) ? second : 'highlight';
  const two_color = CLASH[block]?.[pick] ?? pick;
  const to = { link: link_label ? safeUrl(link_href) : undefined };
  const center = align === 'center';
  const max = size === 'large' ? 'clamp(40px, 6.4vw, 104px)' : 'clamp(48px, 9vw, 150px)';
  return (
    <section className={`sb sb-${block} sb-2-${two_color}${sticker ? ' sb--sticker' : ''}`} style={{ ...sectionColours(colours) }}>
      <span className="sb-ring" aria-hidden="true" />
      {sticker ? <p className="sb-sticker">{sticker}</p> : null}
      <div className="uk-container uk-container--wide sb-in" style={{ position: 'relative', textAlign: center ? 'center' : 'left' }}>
        {eyebrow ? <p className="sb-eyebrow">{eyebrow}</p> : null}
        <h2 className="sb-words" style={{ fontSize: fit(`${one} ${two}`, max), maxWidth: center ? undefined : '13ch', marginInline: center ? 'auto' : undefined }}>
          {one ? <span>{one}</span> : null}
          {two ? <span className="sb-two">{two}</span> : null}
        </h2>
        {to.link ? <a className="sb-cta" href={to.link}>{link_label}</a> : null}
      </div>
    </section>
  );
}
