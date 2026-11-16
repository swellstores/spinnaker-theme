import type { CollectionData } from 'ui-kit';
import { Icon, Image, safeUrl } from 'ui-kit';

// The store's categories as big tiles of flat color, each with its name set large, a round arrow and the category's own
// photo in a circle (or filling the tile below the name). The name has its own band at the top, as large as its longest
// word allows, at most three lines; the photo takes the room under it, so a long name never runs over the photo. Mixed
// colors take turns through the theme's block colors; one color paints every tile. Nothing without categories.
export const schema = {
  label: 'Category tiles',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Pick a category' },
    { id: 'link_label', type: 'text', label: 'Link label', default: 'See them all' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/categories' },
    { id: 'collections', type: 'collection_list', label: 'Store categories', max: 8, default: { from: 'top', limit: 4 } },
    { id: 'colors', type: 'select', label: 'Tile colors', options: ['mixed', 'accent', 'highlight', 'dark', 'soft', 'sand'], default: 'mixed' },
    { id: 'photo', type: 'select', label: 'Category photo', options: ['circle', 'fill', 'none'], default: 'circle' },
    { id: 'shape', type: 'select', label: 'Tile shape', options: ['tall', 'square', 'wide'], default: 'tall' },
  ],
} as const;

type Props = {
  eyebrow?: string; heading?: string; link_label?: string; link_href?: string; collections?: CollectionData[] | null; colors?: string; photo?: string; shape?: string;
};

const MIXED = ['accent', 'highlight', 'dark', 'soft'];
const ONE = ['accent', 'highlight', 'dark', 'soft', 'sand'];
// Syne ExtraBold's letter widths in hundredths of an em (measured in Chrome); any other character counts 1.2em (more than
// its widest digit), punctuation .6. ems(): a text's longest word in ems, a little over (the face's tight tracking isn't
// taken off). fit(): a display heading's size, the size asked for but never so big that its longest word overflows its
// column, the nearest element with container-type: inline-size (100cqi). Headings wrap only between words.
const GLYPHS = 'a106b110c99d110e99f67g97h101i36j36k94l36m165n100o102p106q110r56s84t63u100v92w146x98y93z90A116B114C132D130E114F113G134H128I42J100K122L94M158N130O133P118Q133R123S106T110U129V116W188X114Y107Z120';
const WIDTH = new Map((GLYPHS.match(/[A-Za-z]\d+/g) ?? []).map((g) => [g[0], Number(g.slice(1)) / 100]));
const ems = (text: string) => Math.max(4, ...text.split(/\s+/).map((w) => [...w].reduce((n, c) => n + (WIDTH.get(c) ?? (/[.,:;'!-]/.test(c) ? 0.6 : 1.2)), 0))) * 1.03;
const fit = (text: string, size: string) => `min(${size}, calc(100cqi / ${ems(text).toFixed(2)}))`;
const RATIO: Record<string, string> = { tall: '4 / 5', square: '1 / 1', wide: '4 / 3' };

export const styles = `
& .tn { background: var(--tn-bg); color: var(--tn-fg); }
& .tn-sand { --tn-bg: var(--uk-color-muted-bg); --tn-fg: var(--uk-color-heading); --tn-ring: var(--uk-color-accent); }
& .tn-soft { --tn-bg: var(--uk-color-accent-soft); --tn-fg: var(--uk-color-heading); --tn-ring: var(--uk-color-accent); }
& .tn-highlight { --tn-bg: var(--uk-color-highlight); --tn-fg: var(--uk-color-heading); --tn-ring: var(--uk-color-heading); }
& .tn-accent { --tn-bg: var(--uk-color-accent); --tn-fg: var(--uk-color-on-accent); --tn-ring: var(--uk-color-highlight); }
& .tn-dark { --tn-bg: var(--uk-color-heading); --tn-fg: var(--uk-color-bg); --tn-ring: var(--uk-color-highlight); }
& .ct { padding: var(--uk-section-md) 0; }
& .ct-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 24px; margin-bottom: var(--uk-space-6); }
& .ct-head > div { container-type: inline-size; flex: 1 1 18em; }
& .ct-heading { margin: 0; font-family: var(--uk-font-heading); font-weight: var(--uk-font-heading-weight, 800); line-height: .95; letter-spacing: -.035em; color: var(--uk-color-heading); text-wrap: balance; hyphens: manual; }
& .ct-grid { display: grid; grid-template-columns: repeat(var(--ct-cols), minmax(0, 1fr)); gap: clamp(12px, 1.6vw, 20px); margin: 0; padding: 0; list-style: none; }
& .ct-tile { --ct-pad: clamp(18px, 2.2vw, 30px); container-type: inline-size; position: relative; display: grid; grid-template-rows: auto minmax(0, 1fr); gap: 16px; aspect-ratio: var(--ct-ratio); padding: var(--ct-pad); overflow: hidden; border-radius: var(--uk-radius-lg); text-decoration: none; isolation: isolate; }
& .ct-name { margin: 0; max-width: 11ch; font-family: var(--uk-font-heading); font-weight: var(--uk-font-heading-weight, 800); line-height: .95; letter-spacing: -.035em; color: inherit; hyphens: manual; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; padding-bottom: .12em; }
& .ct-go { position: absolute; z-index: 1; right: var(--ct-pad); bottom: var(--ct-pad); display: inline-grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: var(--tn-fg); color: var(--tn-bg); }
& .ct-circle { grid-row: 2; justify-self: end; align-self: center; height: min(100%, 72cqi); aspect-ratio: 1; margin-right: calc(-1 * var(--ct-pad) - 10cqi); border-radius: 50%; overflow: hidden; box-shadow: 0 0 0 8px var(--tn-ring); }
& .ct-circle > img, & .ct-fill > img { width: 100%; height: 100%; object-fit: cover; }
& .ct-fill { grid-row: 2; margin: 0 calc(-1 * var(--ct-pad)) calc(-1 * var(--ct-pad)); overflow: hidden; }
& .ct-tile:focus-visible { outline: 3px solid var(--uk-color-heading); outline-offset: 4px; }
@media (prefers-reduced-motion: no-preference) {
  & .ct-go { transition: transform .25s ease; }
  & .ct-tile:hover .ct-go { transform: rotate(-45deg) scale(1.06); }
  & .ct-circle { transition: transform .5s cubic-bezier(.2, .7, .2, 1); }
  & .ct-tile:hover .ct-circle { transform: scale(1.05); }
}
@media (max-width: 900px) {
  & .ct-grid { --ct-cols: 2 !important; }
}
@media (max-width: 560px) {
  & .ct-grid { --ct-cols: 1 !important; }
  & .ct-tile { aspect-ratio: 16 / 10; }
  & .ct-circle { align-self: start; height: 48cqi; margin-right: calc(-1 * var(--ct-pad) - 5cqi); }
}
`;

export default function CategoryTiles({ eyebrow, heading, link_label, link_href, collections, colors = 'mixed', photo = 'circle', shape = 'tall' }: Props) {
  const items = (Array.isArray(collections) ? collections : []).filter((c) => c && c.url);
  if (!items.length) return null;
  const cols = Math.min(items.length, 4);
  const to = { link: link_label ? safeUrl(link_href) : undefined };
  const size = `clamp(28px, ${cols > 3 ? '3.4vw' : '4.4vw'}, 64px)`;
  const toneAt = (i: number) => (colors === 'mixed' || !ONE.includes(colors) ? MIXED.at(i % MIXED.length) : colors);
  return (
    <section className="ct">
      <div className="uk-container uk-container--wide">
        {eyebrow || heading || to.link ? (
          <div className="ct-head">
            <div>
              {eyebrow ? <p className="uk-eyebrow">{eyebrow}</p> : null}
              {heading ? <h2 className="ct-heading" style={{ fontSize: fit(heading, 'clamp(38px, 5.4vw, 84px)') }}>{heading}</h2> : null}
            </div>
            {to.link ? <a className="uk-link" href={to.link}>{link_label}</a> : null}
          </div>
        ) : null}
        <ul className="ct-grid" style={{ '--ct-cols': String(cols), '--ct-ratio': RATIO[shape] ?? RATIO.tall }}>
          {items.map((c, i) => (
            <li key={c.id}>
              <a className={`tn tn-${toneAt(i)} ct-tile`} href={c.url}>
                {heading ? <h3 className="ct-name" style={{ fontSize: fit(c.name, size) }}>{c.name}</h3> : <h2 className="ct-name" style={{ fontSize: fit(c.name, size) }}>{c.name}</h2>}
                {c.image && photo === 'fill' ? <span className="ct-fill"><Image image={c.image} alt="" sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw" /></span> : null}
                {c.image && photo === 'circle' ? <span className="ct-circle"><Image image={c.image} alt="" sizes="(max-width: 560px) 52vw, (max-width: 900px) 36vw, 18vw" /></span> : null}
                <span className="ct-go" aria-hidden="true"><Icon name="arrow" size={22} /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
