import { safeUrl } from 'ui-kit';

// Up to four short points, each on its own block of color with a big number: what the store stands for, how it ships,
// how to reach it. The merchant's own words; nothing here is read from the store, so write only what's true.
export const schema = {
  label: 'Feature blocks',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading' },
    {
      id: 'items', type: 'list', label: 'Points', max: 4,
      item: [
        { id: 'title', type: 'text', label: 'Title' },
        { id: 'text', type: 'textarea', label: 'Text' },
        { id: 'link_label', type: 'text', label: 'Link label' },
        { id: 'link_href', type: 'url', label: 'Link' },
      ],
      default: [
        { title: 'Made to be used', text: 'Everyday things, chosen to work hard and last.' },
        { title: 'Packed with care', text: 'Every order is checked and packed by hand.' },
        { title: 'Here to help', text: 'Questions about an order? Write to us any time.' },
      ],
    },
    { id: 'colors', type: 'select', label: 'Block colors', options: ['mixed', 'one color'], default: 'mixed' },
    { id: 'numbers', type: 'select', label: 'Numbers', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

type Item = { title?: string; text?: string; link_label?: string; link_href?: string };
type Props = { eyebrow?: string; heading?: string; items?: Item[]; colors?: string; numbers?: string };

const MIXED = ['highlight', 'accent', 'soft', 'dark'];

// Syne ExtraBold's letter widths in hundredths of an em (measured in Chrome); any other character counts 1.2em (more than
// its widest digit), punctuation .6. ems(): a text's longest word in ems, a little over (the face's tight tracking isn't
// taken off). fit(): a display heading's size, the size asked for but never so big that its longest word overflows its
// column, the nearest element with container-type: inline-size (100cqi). Headings wrap only between words.
const GLYPHS = 'a106b110c99d110e99f67g97h101i36j36k94l36m165n100o102p106q110r56s84t63u100v92w146x98y93z90A116B114C132D130E114F113G134H128I42J100K122L94M158N130O133P118Q133R123S106T110U129V116W188X114Y107Z120';
const WIDTH = new Map((GLYPHS.match(/[A-Za-z]\d+/g) ?? []).map((g) => [g[0], Number(g.slice(1)) / 100]));
const ems = (text: string) => Math.max(4, ...text.split(/\s+/).map((w) => [...w].reduce((n, c) => n + (WIDTH.get(c) ?? (/[.,:;'!-]/.test(c) ? 0.6 : 1.2)), 0))) * 1.03;
const TITLE = 'clamp(22px, 2vw, 30px)';
const fit = (text: string, size: string) => `min(${size}, calc(100cqi / ${ems(text).toFixed(2)}))`;

export const styles = `
& .fb { padding: var(--uk-section-md) 0; }
& .fb-head { container-type: inline-size; margin-bottom: var(--uk-space-6); }
& .fb-heading { margin: 0; font-family: var(--uk-font-heading); font-weight: var(--uk-font-heading-weight, 800); line-height: .95; letter-spacing: -.035em; color: var(--uk-color-heading); text-wrap: balance; hyphens: manual; }
& .fb-grid { display: grid; grid-template-columns: repeat(var(--fb-cols), minmax(0, 1fr)); gap: clamp(12px, 1.6vw, 20px); margin: 0; padding: 0; list-style: none; }
& .fb-item { container-type: inline-size; display: flex; flex-direction: column; gap: 12px; height: 100%; min-height: clamp(220px, 22vw, 300px); padding: clamp(22px, 2.6vw, 36px); border-radius: var(--uk-radius-lg); }
& .fb-highlight { background: var(--uk-color-highlight); color: var(--uk-color-heading); --fb-link: var(--uk-color-heading); }
& .fb-accent { background: var(--uk-color-accent); color: var(--uk-color-on-accent); --fb-link: var(--uk-color-on-accent); }
& .fb-soft { background: var(--uk-color-accent-soft); color: var(--uk-color-heading); --fb-link: var(--uk-color-accent-strong); }
& .fb-dark { background: var(--uk-color-heading); color: var(--uk-color-bg); --fb-link: var(--uk-color-highlight); }
& .fb-num { margin: 0 0 auto; font-family: var(--uk-font-heading); font-size: clamp(48px, 5vw, 80px); font-weight: 800; line-height: 1; letter-spacing: -.05em; }
& .fb-title { margin: 0; font-family: var(--uk-font-heading); font-weight: 800; line-height: 1.05; letter-spacing: -.02em; color: inherit; hyphens: manual; }
& .fb-text { margin: 0; font-size: var(--uk-text-md); line-height: 1.45; }
& .fb-link { align-self: flex-start; color: var(--fb-link); font-weight: 700; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }
@media (max-width: 900px) {
  & .fb-grid { --fb-cols: 2 !important; }
}
@media (max-width: 560px) {
  & .fb-grid { --fb-cols: 1 !important; }
  & .fb-item { min-height: 0; }
  & .fb-num { margin-bottom: var(--uk-space-3); }
}
`;

export default function FeatureBlocks({ eyebrow, heading, items, colors = 'mixed', numbers = 'show' }: Props) {
  const list = (Array.isArray(items) ? items : []).filter((x) => x && (x.title || x.text));
  if (!list.length) return null;
  return (
    <section className="fb">
      <div className="uk-container uk-container--wide">
        {eyebrow || heading ? (
          <div className="fb-head">
            {eyebrow ? <p className="uk-eyebrow">{eyebrow}</p> : null}
            {heading ? <h2 className="fb-heading" style={{ fontSize: fit(heading, 'clamp(36px, 4.6vw, 72px)') }}>{heading}</h2> : null}
          </div>
        ) : null}
        <ul className="fb-grid" style={{ '--fb-cols': String(Math.min(list.length, 4)) }}>
          {list.map((x, i) => {
            const to = { link: x.link_label ? safeUrl(x.link_href) : undefined };
            return (
              <li key={i} className={`fb-item fb-${colors === 'one color' ? 'highlight' : MIXED.at(i % MIXED.length)}`}>
                {numbers !== 'hide' ? <p className="fb-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</p> : null}
                {x.title ? (heading ? <h3 className="fb-title" style={{ fontSize: fit(x.title, TITLE) }}>{x.title}</h3> : <h2 className="fb-title" style={{ fontSize: fit(x.title, TITLE) }}>{x.title}</h2>) : null}
                {x.text ? <p className="fb-text">{x.text}</p> : null}
                {to.link ? <a className="fb-link" href={to.link}>{x.link_label}</a> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
