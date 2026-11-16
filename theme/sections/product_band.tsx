import { useId } from 'react';
import type { ProductData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { ActiveFilters, FilterForm, Icon, Image, Pagination, Price, pricesHiddenFor, QuickAdd, safeUrl, SortSelect, SwatchDot } from 'ui-kit';

// Store products on a band of color under a heading set very large. Each product is a card with a thick outline and a
// solid offset shadow: its photo (the second one on hover, when the theme settings say so), a "Save 20%" or "Sold out"
// sticker from Swell's own prices and stock, its name, and its price on a pill. On a category, search or all-products
// page's own list it also has the list's count, sort, filters (folded, the chosen ones as removal links under the fold,
// so a filtered page opens at its products) and page links, and the category's empty text. As a rail, the cards scroll
// sideways in one row. The theme settings (site.theme_settings) choose quick add, color dots and the second photo for
// every card at once.
export const schema = {
  label: 'Product band',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Most loved' },
    { id: 'link_label', type: 'text', label: 'Link label', default: 'Shop everything' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/products' },
    { id: 'products', type: 'product_list', label: 'Store products', max: 24, filters: true, default: { from: 'all', sort: 'best_selling', limit: 8 } },
    { id: 'display', type: 'select', label: 'Show as', options: ['grid', 'rail'], default: 'grid' },
    { id: 'per_row', type: 'select', label: 'Cards per row (wide screens)', options: ['4', '3', '2'], default: '4' },
    { id: 'heading_size', type: 'select', label: 'Heading size', options: ['huge', 'large', 'medium'], default: 'large' },
    { id: 'tone', type: 'select', label: 'Band color', options: ['page', 'sand', 'soft', 'highlight', 'accent', 'dark'], default: 'page' },
    { id: 'numbers', type: 'select', label: 'Number the cards', options: ['no', 'yes'], default: 'no' },
    { id: 'show_count', type: 'select', label: 'Product count (a page\'s own list)', options: ['show', 'hide'], default: 'show' },
    { id: 'show_sort', type: 'select', label: 'Sort (a page\'s own list)', options: ['show', 'hide'], default: 'show' },
    { id: 'show_filters', type: 'select', label: 'Filters (a page\'s own list)', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

type Props = {
  t: Translate; site?: SiteInfo; eyebrow?: string; heading?: string; link_label?: string; link_href?: string; products?: ProductList | null; display?: string;
  per_row?: string; heading_size?: string; tone?: string; numbers?: string; show_count?: string; show_sort?: string; show_filters?: string;
};

const TONES = ['page', 'sand', 'soft', 'highlight', 'accent', 'dark'];
const HEADING: Record<string, string> = { huge: 'clamp(46px, 8vw, 128px)', large: 'clamp(38px, 5.4vw, 84px)', medium: 'clamp(30px, 3.6vw, 52px)' };
const SIZES: Record<string, string> = {
  '4': '(max-width: 560px) 46vw, (max-width: 900px) 44vw, (max-width: 1360px) 22vw, 300px',
  '3': '(max-width: 560px) 46vw, (max-width: 900px) 44vw, (max-width: 1360px) 30vw, 400px',
  '2': '(max-width: 560px) 46vw, (max-width: 900px) 44vw, (max-width: 1360px) 46vw, 620px',
};

// Whole percent a sale takes off, from Swell's two prices; null without a sale.
function percentOff(p: ProductData): number | null {
  const now = p.price?.amount;
  const was = p.compare_at?.amount;
  if (typeof now !== 'number' || typeof was !== 'number' || was <= now || was <= 0) return null;
  const off = Math.round(((was - now) / was) * 100);
  return off >= 1 && off <= 99 ? off : null;
}

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
& .tn-page, & .tn-sand { --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-btn: var(--uk-color-accent); --tn-on: var(--uk-color-on-accent); --tn-link: var(--uk-color-accent-text, var(--uk-color-accent)); --tn-pop: var(--uk-color-highlight); --tn-pop-on: var(--uk-color-heading); }
& .tn-page { --tn-bg: var(--uk-color-bg); }
& .tn-sand { --tn-bg: var(--uk-color-muted-bg); }
& .tn-soft { --tn-bg: var(--uk-color-accent-soft); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-text-muted); --tn-btn: var(--uk-color-accent); --tn-on: var(--uk-color-on-accent); --tn-link: var(--uk-color-accent-strong); --tn-pop: var(--uk-color-highlight); --tn-pop-on: var(--uk-color-heading); }
& .tn-highlight { --tn-bg: var(--uk-color-highlight); --tn-fg: var(--uk-color-heading); --tn-fg2: var(--uk-color-heading); --tn-btn: var(--uk-color-heading); --tn-on: var(--uk-color-bg); --tn-link: var(--uk-color-heading); --tn-pop: var(--uk-color-heading); --tn-pop-on: var(--uk-color-highlight); }
& .tn-accent { --tn-bg: var(--uk-color-accent); --tn-fg: var(--uk-color-on-accent); --tn-fg2: var(--uk-color-on-accent); --tn-btn: var(--uk-color-highlight); --tn-on: var(--uk-color-heading); --tn-link: var(--uk-color-on-accent); --tn-pop: var(--uk-color-highlight); --tn-pop-on: var(--uk-color-heading); }
& .tn-dark { --tn-bg: var(--uk-color-heading); --tn-fg: var(--uk-color-bg); --tn-fg2: color-mix(in srgb, var(--uk-color-bg) 82%, var(--uk-color-heading)); --tn-btn: var(--uk-color-highlight); --tn-on: var(--uk-color-heading); --tn-link: var(--uk-color-highlight); --tn-pop: var(--uk-color-highlight); --tn-pop-on: var(--uk-color-heading); }
& .tn-in { --uk-color-bg: var(--tn-bg); --uk-color-surface: var(--tn-bg); --uk-color-heading: var(--tn-fg); --uk-color-ink: var(--tn-fg); --uk-color-text-muted: var(--tn-fg2); --uk-color-text-subtle: var(--tn-fg2); --uk-color-accent: var(--tn-btn); --uk-color-on-accent: var(--tn-on); --uk-color-accent-text: var(--tn-link); --uk-color-line: color-mix(in srgb, var(--tn-fg) 22%, transparent); --uk-color-line-strong: var(--tn-fg); --uk-color-outline: var(--tn-fg); --uk-color-tile: color-mix(in srgb, var(--tn-fg) 9%, var(--tn-bg)); }
& .pb-root { padding: 0; }
& .pb { padding: var(--uk-section-md) 0; }
& .pb--bare { padding-top: var(--uk-space-6); }
& .pb-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 24px; margin-bottom: var(--uk-space-6); }
& .pb-head > div { container-type: inline-size; flex: 1 1 18em; }
& .pb-heading { margin: 0; font-family: var(--uk-font-heading); font-weight: var(--uk-font-heading-weight, 800); line-height: .95; letter-spacing: -.035em; color: var(--uk-color-heading); text-wrap: balance; hyphens: manual; }
& .pb-more { display: inline-flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 22px; border: var(--uk-border-width, 2px) solid var(--uk-color-line-strong); border-radius: var(--uk-radius-pill); font-weight: 600; color: var(--uk-color-heading); text-decoration: none; }
& .pb-more:focus-visible, & .pb-link:focus-visible { outline: 3px solid var(--uk-color-heading); outline-offset: 3px; }
& .pb-bar { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; padding-bottom: var(--uk-space-4); border-bottom: var(--uk-border-width, 2px) solid var(--uk-color-line-strong); }
& .pb-count { margin: 0; font-family: var(--uk-font-heading); font-size: var(--uk-heading-sm); font-weight: 700; color: var(--uk-color-heading); }
& .pb-grid { display: grid; grid-template-columns: repeat(var(--pb-cols), minmax(0, 1fr)); gap: clamp(18px, 2vw, 28px); margin: var(--uk-space-6) 0 0; padding: 0 6px 6px 0; list-style: none; }
& .pb-head + .pb-grid { margin-top: 0; }
& .pb-rail { grid-auto-flow: column; grid-auto-columns: calc((100% - (var(--pb-cols) - 1) * clamp(18px, 2vw, 28px)) / var(--pb-cols)); grid-template-columns: none; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 14px; }
& .pb-rail > li { scroll-snap-align: start; }
& .pb-card { position: relative; display: flex; flex-direction: column; gap: 12px; height: 100%; padding: 10px 10px 14px; border: var(--uk-border-width, 2px) solid var(--uk-color-line-strong); border-radius: var(--uk-radius-lg); background: var(--uk-color-bg); box-shadow: 6px 6px 0 var(--uk-color-line-strong); }
& .pb-link { display: flex; flex-direction: column; gap: 12px; flex: 1 1 auto; color: inherit; text-decoration: none; border-radius: var(--uk-radius-md); }
& .pb-photo { position: relative; aspect-ratio: 1 / 1; border-radius: var(--uk-radius-md); }
& .pb-alt { position: absolute; inset: 0; opacity: 0; }
& .pb-alt > img { width: 100%; height: 100%; object-fit: cover; }
& .pb-link:hover .pb-alt, & .pb-link:focus-visible .pb-alt { opacity: 1; }
& .pb-sticker { position: absolute; top: 10px; left: 10px; padding: 6px 12px; border-radius: var(--uk-radius-pill); background: var(--tn-pop); color: var(--tn-pop-on); font-size: 13px; font-weight: 700; line-height: 1.2; }
& .pb-sticker--out { background: var(--uk-color-heading); color: var(--uk-color-bg); }
& .pb-num { position: absolute; right: 10px; bottom: 6px; font-family: var(--uk-font-heading); font-weight: 800; font-size: 44px; line-height: 1; letter-spacing: -.04em; color: var(--uk-color-bg); }
& .pb-meta { display: grid; gap: 10px; padding: 0 4px; }
& .pb-name { margin: 0; font-family: var(--uk-font-heading); font-size: clamp(16px, 1.35vw, 19px); font-weight: 700; line-height: 1.2; letter-spacing: -.01em; color: var(--uk-color-heading); }
& .pb-price { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 6px; justify-self: start; margin: 0; padding: 5px 12px; border-radius: var(--uk-radius-pill); background: var(--uk-color-accent); color: var(--uk-color-on-accent); font-size: var(--uk-text-sm); font-weight: 600; }
& .pb-price .uk-price { flex-wrap: nowrap; gap: 6px; white-space: nowrap; }
& .pb-price .uk-price-was, & .pb-price .uk-price-now { color: inherit; }
& .pb-price .uk-price-was { opacity: .78; }
& .pb-dots { display: flex; gap: 6px; margin: 0; padding: 0; list-style: none; }
& .pb-card .uk-sell-add { padding: 0 4px; }
& .pb-card .uk-prices-hidden { font-size: var(--uk-text-sm); }
& .pb-note { margin: var(--uk-space-6) 0 0; font-size: var(--uk-text-md); color: var(--uk-color-text-muted); }
& .pb-pages { margin-top: var(--uk-space-7); }
@media (prefers-reduced-motion: no-preference) {
  & .pb-card { transition: transform .2s ease, box-shadow .2s ease; }
  & .pb-card:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 var(--uk-color-line-strong); }
  & .pb-alt { transition: opacity .3s ease; }
}
@media (max-width: 900px) {
  & .pb-grid:not(.pb-rail) { --pb-cols: 2 !important; }
  & .pb-rail { --pb-cols: 2.3 !important; }
}
@media (max-width: 560px) {
  & .pb-grid { gap: 14px; }
  & .pb-rail { --pb-cols: 1.6 !important; }
  & .pb-card { padding: 7px 7px 10px; box-shadow: 4px 4px 0 var(--uk-color-line-strong); border-radius: var(--uk-radius-md); }
  & .pb-num { font-size: 30px; }
  & .pb-sticker { top: 6px; left: 6px; padding: 4px 8px; font-size: 12px; }
  & .pb-price { padding: 4px 10px; font-size: 14px; }
}
`;

export default function ProductBand(p: Props) {
  const { t } = p;
  const anchor = useId();
  const list = p.products && typeof p.products === 'object' ? p.products : null;
  const items = Array.isArray(list?.items) ? list.items.filter((x) => x && typeof x.id === 'string') : [];
  const main = !!list && Array.isArray(list.sort_options) && list.sort_options.length > 0;
  const chosen = main && Array.isArray(list.active_filters) ? list.active_filters.length : 0;
  if (!items.length && !chosen && !(main && t('collection.empty'))) return null;
  const tone = TONES.includes(p.tone ?? '') ? p.tone : 'page';
  const cols = ['2', '3', '4'].includes(p.per_row ?? '') ? p.per_row! : '4';
  const rail = p.display === 'rail' && !main;
  const to = { link: p.link_label ? safeUrl(p.link_href) : undefined };
  const head = p.eyebrow || p.heading || to.link;
  const size = p.heading_size ?? 'large';
  const headingSize = HEADING[size] ?? HEADING.large;
  const ts = p.site?.theme_settings ?? {};
  const settings = {
    quick: ts.card_quick_add !== false,
    second: ts.card_photo_swap !== false,
    dots: typeof ts.card_swatches === 'number' ? Math.max(0, Math.min(8, Math.round(ts.card_swatches))) : 4,
  };
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page });
  const filters = main && items.length + chosen > 0 && p.show_filters !== 'hide' && (list.filters.length > 0 || chosen > 0) && !!t('filter.button');
  const countText = main && p.show_count !== 'hide' && items.length ? t('collection.count', { count: list.total }) : '';
  const sort = main && p.show_sort !== 'hide' && items.length ? (
    <SortSelect
      list={list} anchor={anchor}
      labels={{ label: t('sort.label'), apply: t('common.apply'), featured: t('sort.featured'), best_selling: t('sort.best_selling'), newest: t('sort.newest'), price_asc: t('sort.price_low'), price_desc: t('sort.price_high'), name: t('sort.name') }}
    />
  ) : null;
  const card = (x: ProductData, i: number) => {
    const off = percentOff(x);
    const sold = !!x.price && !x.available;
    const alt = settings.second && x.image ? (x.images ?? []).find((im) => im && im.url && im.url !== x.image!.url) : undefined;
    const swatches = settings.dots ? ((x.options ?? []).find((o) => o.choices?.some((c) => c.swatch))?.choices ?? []).filter((c) => c.swatch).slice(0, settings.dots) : [];
    return (
      <li key={x.id}>
        <div className="pb-card">
          <a className="pb-link" href={x.url}>
            <div className="uk-media pb-photo">
              {x.image ? <Image image={x.image} alt="" sizes={SIZES[cols]} priority={main && i < Number(cols)} /> : <span style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={44} /></span>}
              {alt ? <span className="pb-alt"><Image image={alt} alt="" sizes={SIZES[cols]} /></span> : null}
              {sold && t('product.sold_out') ? <span className="pb-sticker pb-sticker--out">{t('product.sold_out')}</span> : off && t('product.save', { percent: off }) ? <span className="pb-sticker">{t('product.save', { percent: off })}</span> : null}
              {p.numbers === 'yes' ? <span className="pb-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span> : null}
            </div>
            <div className="pb-meta">
              {p.heading ? <h3 className="pb-name">{x.name}</h3> : <h2 className="pb-name">{x.name}</h2>}
              {hidden ? <span className="uk-prices-hidden">{hidden.label}</span> : x.price ? <p className="pb-price"><Price price={x.price} compare={x.compare_at} labels={{ was: t('product.was'), now: t('product.now') }} /></p> : null}
              {swatches.length ? <ul className="pb-dots" aria-label={swatches.map((c) => c.name).join(', ')}>{swatches.map((c) => <li key={c.id}><SwatchDot swatch={c.swatch} /></li>)}</ul> : null}
            </div>
          </a>
          {settings.quick ? <QuickAdd product={x} full pricesHidden={hidden} labels={{ add: t('product.quick_add'), choose: t('product.choose') }} /> : null}
        </div>
      </li>
    );
  };
  return (
    <section id={main ? anchor : undefined} className={`tn tn-${tone} pb-root`}>
      <div className={head ? 'tn-in pb' : 'tn-in pb pb--bare'}>
        <div className="uk-container uk-container--wide">
          {head ? (
            <div className="pb-head">
              <div>
                {p.eyebrow ? <p className="uk-eyebrow">{p.eyebrow}</p> : null}
                {p.heading ? <h2 className="pb-heading" style={{ fontSize: fit(p.heading, headingSize) }}>{p.heading}</h2> : null}
              </div>
              {to.link ? <a className="pb-more" href={to.link}>{p.link_label}<Icon name="arrow" size={18} /></a> : null}
            </div>
          ) : null}
          {main && (countText || sort) ? (
            <div className="pb-bar">
              {countText ? <p className="pb-count">{countText}</p> : <span />}
              {sort}
            </div>
          ) : null}
          {filters ? (
            <>
              <details className="uk-disclosure">
                <summary>
                  {chosen ? `${t('filter.button')} (${chosen})` : t('filter.button')}
                  <Icon name="chevron" size={18} />
                </summary>
                <div style={{ maxWidth: 560 }}>
                  <FilterForm list={list} anchor={anchor} active={false} labels={{ apply: t('common.apply'), min: t('filter.min'), max: t('filter.max'), count: t('filter.count_word'), remove: t('filter.remove') }} />
                </div>
              </details>
              <ActiveFilters list={list} labels={{ remove: t('filter.remove') }} anchor={anchor} />
            </>
          ) : null}
          {items.length ? (
            <ul className={rail ? 'pb-grid pb-rail' : 'pb-grid'} style={{ '--pb-cols': cols }}>{items.map(card)}</ul>
          ) : chosen ? (
            t('filter.empty') ? <p className="pb-note">{t('filter.empty')}</p> : null
          ) : (
            <p className="pb-note">{t('collection.empty')}</p>
          )}
          {main && list.pages > 1 && (list.prev_url || list.next_url) ? (
            <div className="pb-pages">
              <Pagination list={list} prev={t('pagination.previous')} next={t('pagination.next')} label={t('pagination.label')} page={t('pagination.page')} of={t('pagination.of')} anchor={anchor} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
