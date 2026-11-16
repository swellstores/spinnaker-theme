import type { CollectionData, Translate } from 'ui-kit';
import { Breadcrumbs, Image } from 'ui-kit';

// A category's opening block: a full-width band of color with the trail, the category's name as large as it fits, its
// description, its subcategories as round-edged links and its own photo in a circle on wide screens. On a category page
// it is the page's own category; without one, the heading and text set here, and nothing when they are empty.
export const schema = {
  label: 'Collection masthead',
  fields: [
    { id: 'collection', type: 'collection', label: 'Collection', default: 'current' },
    { id: 'heading', type: 'text', label: 'Heading (when there is no collection)' },
    { id: 'description', type: 'textarea', label: 'Description (when there is no collection)' },
    { id: 'tone', type: 'select', label: 'Band color', options: ['accent', 'highlight', 'dark', 'soft', 'sand'], default: 'accent' },
    { id: 'show_photo', type: 'select', label: 'Category photo', options: ['show', 'hide'], default: 'show' },
    { id: 'show_children', type: 'select', label: 'Subcategories', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

type Props = { t: Translate; collection?: CollectionData | null; heading?: string; description?: string; tone?: string; show_photo?: string; show_children?: string };

const TONES = ['accent', 'highlight', 'dark', 'soft', 'sand'];

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
& .tn-sand { --tn-bg: var(--uk-color-muted-bg); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-pop: var(--uk-color-accent); }
& .tn-soft { --tn-bg: var(--uk-color-accent-soft); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-pop: var(--uk-color-accent); }
& .tn-highlight { --tn-bg: var(--uk-color-highlight); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-heading); --tn-pop: var(--uk-color-accent); }
& .tn-accent { --tn-bg: var(--uk-color-accent); --tn-fg: var(--uk-color-on-accent); --tn-fg2: var(--uk-color-on-accent); --tn-pop: var(--uk-color-highlight); }
& .tn-dark { --tn-bg: var(--uk-color-heading); --tn-fg: var(--uk-color-bg); --tn-fg2: color-mix(in srgb, var(--uk-color-bg) 82%, var(--uk-color-heading)); --tn-pop: var(--uk-color-highlight); }
& .tn-in { --uk-color-heading: var(--tn-fg); --uk-color-ink: var(--tn-fg); --uk-color-text-muted: var(--tn-fg2); --uk-color-text-subtle: var(--tn-fg2); --uk-color-accent-text: var(--tn-fg); --uk-color-outline: var(--tn-fg); --uk-color-line: color-mix(in srgb, var(--tn-fg) 22%, transparent); }
& .cm { position: relative; overflow: hidden; padding: clamp(32px, 5vw, 72px) 0 clamp(40px, 6vw, 88px); }
& .cm-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: end; }
& .cm-grid--photo { grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); }
& .cm-words { container-type: inline-size; }
& .cm-name { margin: var(--uk-space-4) 0 0; font-family: var(--uk-font-heading); font-weight: var(--uk-font-heading-weight, 800); line-height: .9; letter-spacing: -.045em; color: var(--tn-fg); text-wrap: balance; hyphens: manual; }
& .cm-text { margin: var(--uk-space-4) 0 0; max-width: 56ch; font-size: clamp(17px, 1.4vw, 20px); line-height: 1.5; color: var(--tn-fg2); }
& .cm-kids { display: flex; flex-wrap: wrap; gap: 10px; margin: var(--uk-space-6) 0 0; padding: 0; list-style: none; }
& .cm-kid { display: inline-flex; align-items: center; min-height: 44px; padding: 0 20px; border: 2px solid var(--tn-fg); border-radius: var(--uk-radius-pill); color: var(--tn-fg); font-weight: 600; text-decoration: none; }
& .cm-kid:hover { background: var(--tn-fg); color: var(--tn-bg); }
& .cm-kid:focus-visible { outline: 3px solid var(--tn-fg); outline-offset: 3px; }
& .cm-photo { justify-self: end; width: min(100%, 420px); aspect-ratio: 1; border-radius: 50%; overflow: hidden; box-shadow: 0 0 0 clamp(8px, 1vw, 14px) var(--tn-pop); }
& .cm-photo > img { width: 100%; height: 100%; object-fit: cover; }
& .cm-disc { position: absolute; right: -7vw; top: -9vw; width: 30vw; aspect-ratio: 1; border-radius: 50%; background: var(--tn-pop); opacity: .95; }
@media (max-width: 900px) {
  & .cm-grid--photo { grid-template-columns: minmax(0, 1fr); }
  & .cm-photo { display: none; }
  & .cm-disc { width: 44vw; right: -14vw; top: -16vw; }
}
`;

export default function CollectionMasthead({ t, collection, heading, description, tone, show_photo, show_children }: Props) {
  const c = collection && typeof collection === 'object' ? collection : null;
  const title = (c ? c.name : heading) ?? '';
  const text = c ? (Array.isArray(c.description) ? c.description.map((b) => b.text).filter(Boolean) : []) : description ? [description] : [];
  if (!title && !text.length) return null;
  const photo = c?.image && show_photo !== 'hide' ? c.image : null;
  const children = c && show_children !== 'hide' && Array.isArray(c.children) ? c.children : [];
  const band = TONES.includes(tone ?? '') ? tone : 'accent';
  return (
    <section className={`tn tn-${band} cm`}>
      {photo ? null : <span className="cm-disc" aria-hidden="true" />}
      <div className="tn-in uk-container uk-container--wide" style={{ position: 'relative' }}>
        <div className={photo ? 'cm-grid cm-grid--photo' : 'cm-grid'}>
          <div className="cm-words">
            {c ? <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, c.parent, { name: c.name, url: c.url }]} label={t('navigation.breadcrumb')} /> : null}
            {title ? <h1 className="cm-name" style={{ fontSize: fit(title, 'clamp(52px, 9vw, 144px)') }}>{title}</h1> : null}
            {text.slice(0, 3).map((x, i) => <p key={i} className="cm-text">{x}</p>)}
            {children.length ? (
              <nav aria-label={t('collection.subcategories') || undefined}>
                <ul className="cm-kids">
                  {children.map((k) => <li key={k.slug}><a className="cm-kid" href={k.url}>{k.name}</a></li>)}
                </ul>
              </nav>
            ) : null}
          </div>
          {photo ? <div className="cm-photo"><Image image={photo} sizes="(max-width: 900px) 0px, 420px" priority /></div> : null}
        </div>
      </div>
    </section>
  );
}
