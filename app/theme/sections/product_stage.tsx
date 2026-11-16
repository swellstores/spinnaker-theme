import type { ReactElement } from 'react';
import type { IconName, ProductData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { Breadcrumbs, Icon, Image, pricesHiddenFor, ProductForm, RichText, SellList } from 'ui-kit';

// The product page as two blocks: the photos on a tile of color (the chosen variant's photo large, the others as round
// thumbnails that open in its place), and the buy box on a block of color beside it, its name set very large. All of it
// is Swell's: the trail, name, rating (only with a reviews app's), price, options, stock, purchase options and
// subscriptions, quantity (a theme setting), up-sells (Pairs with), description, a bundle's items and the attributes;
// then the merchant's own promises and notes for every product, and up to four text blocks under the buy button. The
// photos stay in view while the buy box scrolls on wide screens; on phones the photos come first. Only the page's own
// product has the page's heading (h1) and the form whose choice goes into the address.
export const schema = {
  label: 'Product stage',
  fields: [
    { id: 'product', type: 'product', label: 'Product', default: 'current' },
    { id: 'pairs', type: 'product_list', label: 'Pairs with (the product\'s up-sells)', max: 4, default: { from: 'up_sells', limit: 3 } },
    { id: 'panel', type: 'select', label: 'Buy box color', options: ['soft', 'highlight', 'sand', 'page', 'dark'], default: 'soft' },
    { id: 'photo_tile', type: 'select', label: 'Photo tile color', options: ['sand', 'highlight', 'soft', 'accent'], default: 'sand' },
    { id: 'show_attributes', type: 'select', label: 'Product attributes', options: ['show', 'hide'], default: 'show' },
    {
      id: 'points', type: 'list', label: 'Promises', max: 4,
      item: [
        { id: 'icon', type: 'select', label: 'Icon', options: ['truck', 'return', 'shield', 'leaf', 'clock', 'check'], default: 'check' },
        { id: 'text', type: 'text', label: 'Text' },
      ],
      default: [],
    },
    {
      id: 'details', type: 'list', label: 'Notes on every product (put product facts in its description or attributes)', max: 6,
      item: [
        { id: 'title', type: 'text', label: 'Title' },
        { id: 'body', type: 'textarea', label: 'Text' },
      ],
      default: [],
    },
  ],
  blocks: { types: ['text'], max: 4 },
} as const;

type Props = {
  blocks?: ReactElement[]; // core text blocks, under the buy box
  t: Translate; site?: SiteInfo; product?: ProductData | null; pairs?: ProductList | null; panel?: string; photo_tile?: string; show_attributes?: string;
  points?: { icon?: IconName; text?: string }[]; details?: { title?: string; body?: string }[];
};

const PANELS = ['soft', 'highlight', 'sand', 'page', 'dark'];
const TILES = ['sand', 'highlight', 'soft', 'accent'];

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
& .tn-page, & .tn-sand { --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-btn: var(--uk-color-accent); --tn-on: var(--uk-color-on-accent); --tn-link: var(--uk-color-accent-text, var(--uk-color-accent)); }
& .tn-page { --tn-bg: var(--uk-color-bg); }
& .tn-sand { --tn-bg: var(--uk-color-muted-bg); }
& .tn-soft { --tn-bg: var(--uk-color-accent-soft); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-btn: var(--uk-color-accent); --tn-on: var(--uk-color-on-accent); --tn-link: var(--uk-color-accent-strong); }
& .tn-highlight { --tn-bg: var(--uk-color-highlight); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-heading); --tn-btn: var(--uk-color-heading); --tn-on: var(--uk-color-bg); --tn-link: var(--uk-color-heading); }
& .tn-accent { --tn-bg: var(--uk-color-accent); --tn-fg: var(--uk-color-on-accent); --tn-fg2: var(--uk-color-on-accent); --tn-btn: var(--uk-color-highlight); --tn-on: var(--uk-color-heading); --tn-link: var(--uk-color-on-accent); }
& .tn-dark { --tn-bg: var(--uk-color-heading); --tn-fg: var(--uk-color-bg); --tn-fg2: color-mix(in srgb, var(--uk-color-bg) 82%, var(--uk-color-heading)); --tn-btn: var(--uk-color-highlight); --tn-on: var(--uk-color-heading); --tn-link: var(--uk-color-highlight); }
& .tn-in { --uk-color-bg: var(--tn-bg); --uk-color-surface: var(--tn-bg); --uk-color-heading: var(--tn-fg); --uk-color-ink: var(--tn-fg); --uk-color-text-muted: var(--tn-fg2); --uk-color-text-subtle: var(--tn-fg2); --uk-color-accent: var(--tn-btn); --uk-color-on-accent: var(--tn-on); --uk-color-accent-text: var(--tn-link); --uk-color-line: color-mix(in srgb, var(--tn-fg) 22%, transparent); --uk-color-line-strong: var(--tn-fg); --uk-color-outline: var(--tn-fg); --uk-color-tile: color-mix(in srgb, var(--tn-fg) 9%, var(--tn-bg)); --uk-color-muted-bg: color-mix(in srgb, var(--tn-fg) 6%, var(--tn-bg)); }
& .ps { --ps-pad: clamp(22px, 3vw, 44px); padding: var(--uk-space-6) 0 var(--uk-section-md); }
& .ps-grid { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr); gap: clamp(16px, 2vw, 28px); align-items: start; }
& .ps-photos { position: sticky; top: calc(var(--uk-header-sticky, 0px) + 20px); display: grid; gap: 14px; padding: clamp(14px, 2vw, 28px); border-radius: var(--uk-radius-lg); }
& .ps-main { aspect-ratio: 1 / 1; border-radius: var(--uk-radius-md); background: var(--uk-color-bg); }
& .ps-thumbs { display: flex; flex-wrap: wrap; gap: 10px; margin: 0; padding: 0; list-style: none; }
& .ps-thumb { display: block; width: 72px; height: 72px; border-radius: 50%; overflow: hidden; border: 3px solid transparent; }
& .ps-thumb[aria-current="true"] { border-color: var(--tn-fg); }
& .ps-thumb > img { width: 100%; height: 100%; object-fit: cover; }
& .ps-thumb:focus-visible { outline: 3px solid var(--tn-fg); outline-offset: 2px; }
& .ps-panel { container-type: inline-size; display: grid; gap: var(--uk-space-5); padding: var(--ps-pad); border-radius: var(--uk-radius-lg); }
& .ps-name { margin: 0; font-family: var(--uk-font-heading); font-weight: var(--uk-font-heading-weight, 800); line-height: .95; letter-spacing: -.04em; color: var(--uk-color-heading); text-wrap: balance; hyphens: manual; }
& .ps-rating { display: flex; align-items: center; gap: 10px; margin: 12px 0 0; font-size: var(--uk-text-sm); }
& .ps-stars { display: inline-flex; gap: 2px; }
& .ps-label { margin: 0 0 var(--uk-space-3); font-family: var(--uk-font-heading); font-size: var(--uk-text-md); font-weight: 800; color: var(--uk-color-heading); }
& .ps-copy { font-size: var(--uk-text-md); line-height: 1.6; color: var(--uk-color-text-muted); }
& .ps-copy > :first-child { margin-top: 0; }
& .ps-bundle { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; font-size: var(--uk-text-sm); }
& .ps-bundle a { color: inherit; text-underline-offset: 3px; }
& .ps-attrs { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin: 0; }
& .ps-attrs > div { padding: 14px 16px; border-radius: var(--uk-radius-md); background: var(--uk-color-bg); box-shadow: inset 0 0 0 2px var(--uk-color-line-strong); }
& .ps-attrs dt { font-size: var(--uk-text-xs); color: var(--uk-color-text-muted); }
& .ps-attrs dd { margin: 4px 0 0; font-weight: 700; color: var(--uk-color-heading); }
& .ps-points { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; font-size: var(--uk-text-sm); }
& .ps-points li { display: flex; align-items: center; gap: 12px; }
& .ps-points span { display: inline-grid; place-items: center; flex: none; width: 34px; height: 34px; border-radius: 50%; background: var(--uk-color-heading); color: var(--uk-color-bg); }
& .ps-notes { border-top: 2px solid var(--uk-color-line-strong); }
& .ps-notes .uk-disclosure { border-bottom: 2px solid var(--uk-color-line-strong); }
& .ps-panel .uk-button--primary { min-height: 60px; font-size: var(--uk-text-md); }
@media (max-width: 900px) {
  & .ps { padding-top: var(--uk-space-4); }
  & .ps-grid { grid-template-columns: minmax(0, 1fr); }
  & .ps-photos { position: static; }
  & .ps-thumb { width: 56px; height: 56px; }
}
`;

export default function ProductStage(p: Props) {
  const { t } = p;
  const item = p.product && typeof p.product === 'object' ? p.product : null;
  if (!item) return <>{p.blocks}</>;
  const own = p.site?.page.kind === 'product' && item.url === p.site.page.path;
  const main = item.selected?.image ?? item.image;
  const photos = Array.isArray(item.images) ? item.images : [];
  const points = (p.points ?? []).filter((pt) => pt && pt.text);
  const details = (p.details ?? []).filter((d) => d && (d.title || d.body));
  const attributes = p.show_attributes === 'hide' ? [] : (item.attributes ?? []).filter((a) => a.values.length);
  const rating = item.rating && t('product.rating') ? item.rating : null;
  const panel = PANELS.includes(p.panel ?? '') ? p.panel : 'soft';
  const tile = TILES.includes(p.photo_tile ?? '') ? p.photo_tile : 'sand';
  const quantity = p.site?.theme_settings?.buy_quantity !== false;
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page });
  const labels = {
    add: t('product.add_to_cart'), sold_out: t('product.sold_out'), unavailable: t('product.unavailable'), preorder: t('product.preorder'), backorder: t('product.backorder'),
    was: t('product.was'), now: t('product.now'), quantity: quantity ? t('common.quantity') : '', purchase: t('product.purchase_options'), one_time: t('product.one_time'),
    subscribe: t('product.subscribe'), trial: t('product.trial'), save: (percent: number) => t('product.save', { percent }),
    delivered: (every: string) => t('product.delivered', { every }), billed: (every: string) => t('product.billed', { every }),
    payments: (count: number) => t('product.payments', { count }), trial_then: (days: string, price: string) => t('product.trial_then', { days, price }),
    promise: t('product.promise'),
  };
  return (
    <section className="ps">
      <div className="uk-container uk-container--wide">
        <div className="ps-grid">
          <div className={`tn tn-${tile} ps-photos`}>
            <div className="uk-media ps-main">
              {main ? (
                <Image image={main} sizes="(max-width: 900px) calc(100vw - 76px), (max-width: 1360px) 48vw, 640px" priority variantImage />
              ) : (
                <span style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={72} /></span>
              )}
            </div>
            {photos.length > 1 ? (
              <ul className="ps-thumbs">
                {photos.map((ph, i) => (
                  <li key={i}>
                    <a className="ps-thumb" href={ph.url} data-site-photo="" aria-current={ph.url === main?.url ? 'true' : undefined}>
                      <Image image={ph} alt={ph.alt && ph.alt !== item.name ? ph.alt : t('product.photo', { number: i + 1 }) || `${item.name} ${i + 1}`} sizes="72px" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className={`tn tn-${panel}`} style={{ borderRadius: 'var(--uk-radius-lg)' }}>
            <div className="tn-in ps-panel">
              <div>
                <div style={{ marginBottom: 'var(--uk-space-4)' }}>
                  <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, item.category, { name: item.name, url: item.url }]} label={t('navigation.breadcrumb')} />
                </div>
                {own ? <h1 className="ps-name" style={{ fontSize: fit(item.name, 'clamp(38px, 5vw, 76px)') }}>{item.name}</h1> : <h2 className="ps-name" style={{ fontSize: fit(item.name, 'clamp(38px, 5vw, 76px)') }}>{item.name}</h2>}
                {rating ? (
                  <p className="ps-rating">
                    <span className="ps-stars" aria-hidden="true">
                      {Array.from({ length: Math.round(Math.min(5, Math.max(0, rating.average))) }, (_, i) => <Icon key={i} name="star" size={16} />)}
                    </span>
                    {t('product.rating', { average: String(Math.round(rating.average * 10) / 10), count: String(rating.count) })}
                  </p>
                ) : null}
              </div>
              <ProductForm product={item} labels={labels} primary={own} locale={p.site?.locale} pricesHidden={hidden} />
              {p.blocks}
              {p.pairs?.items?.length ? (
                <div>
                  {t('product.pairs_with') ? <h2 className="ps-label">{t('product.pairs_with')}</h2> : null}
                  <SellList list={p.pairs} pricesHidden={hidden} labels={{ add: t('product.quick_add'), choose: t('product.choose'), was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }} />
                </div>
              ) : null}
              {item.description.length ? <div className="ps-copy"><RichText value={item.description} /></div> : null}
              {item.bundle.length && t('product.bundle') ? (
                <div>
                  <h2 className="ps-label">{t('product.bundle')}</h2>
                  <ul className="ps-bundle">
                    {item.bundle.map((b, i) => (
                      <li key={i}>
                        {`${b.quantity} × `}
                        {b.url ? <a href={b.url}>{b.name}</a> : b.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {attributes.length ? (
                <dl className="ps-attrs">
                  {attributes.map((a) => (
                    <div key={a.id}>
                      <dt>{a.name}</dt>
                      <dd>{a.values.join(', ')}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {points.length ? (
                <ul className="ps-points">
                  {points.map((pt, i) => (
                    <li key={i}>
                      <span><Icon name={pt.icon ?? 'check'} size={18} /></span>
                      {pt.text}
                    </li>
                  ))}
                </ul>
              ) : null}
              {details.length ? (
                <div className="ps-notes">
                  {details.map((d, i) => (
                    <details key={i} className="uk-disclosure" open={i === 0}>
                      <summary>
                        {d.title}
                        <Icon name="chevron" size={18} />
                      </summary>
                      <p>{d.body}</p>
                    </details>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
