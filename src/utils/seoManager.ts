import type { ToolItem } from '../types';

export const DEFAULT_SEO = {
  title: 'SuperTools — 365+ Free Client-Side Web Utilities & In-RAM AI Tools',
  description: 'Free all-in-one suite of 365+ client-side web tools and offline AI utilities: In-RAM Neural AI with WebGPU acceleration, AI background remover, neural OCR, universal file converter, audio studio, and developer utilities. 100% private, zero backend, works offline.',
  canonical: 'https://the-supertools.web.app/',
  ogImage: 'https://the-supertools.web.app/og-image.png',
  siteName: 'SuperTools'
};

function getOrCreateMeta(name: string, isProperty = false): HTMLMetaElement {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    if (isProperty) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  return meta;
}

function getOrCreateCanonical(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  return link;
}

function updateDynamicJsonLd(tool: ToolItem | null, activeCategory?: string | null) {
  const SCRIPT_ID = 'supertools-dynamic-seo-ld';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!tool) {
    if (activeCategory) {
      const categoryLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': `${activeCategory} — SuperTools Web Utilities`,
        'url': `https://the-supertools.web.app/#/category/${encodeURIComponent(activeCategory)}`,
        'description': `Explore free client-side ${activeCategory} utilities running 100% in your browser.`,
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'SuperTools',
          'url': 'https://the-supertools.web.app/'
        }
      };
      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(categoryLd);
    } else if (script) {
      script.remove();
    }
    return;
  }

  const toolLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        'name': tool.name,
        'description': tool.description,
        'url': `https://the-supertools.web.app/#/${tool.id}`,
        'applicationCategory': 'UtilitiesApplication',
        'operatingSystem': 'All',
        'browserRequirements': 'Requires JavaScript. Requires HTML5.',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'featureList': tool.tags
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'SuperTools',
            'item': 'https://the-supertools.web.app/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': tool.category,
            'item': `https://the-supertools.web.app/#/category/${encodeURIComponent(tool.category)}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': tool.name,
            'item': `https://the-supertools.web.app/#/${tool.id}`
          }
        ]
      }
    ]
  };

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(toolLd);
}

/**
 * Dynamically updates document metadata, OpenGraph, Twitter Cards, and canonical tags for SEO
 */
export function updateDocumentSeo(tool: ToolItem | null, activeCategory?: string | null) {
  if (typeof document === 'undefined') return;

  const canonicalLink = getOrCreateCanonical();
  const descMeta = getOrCreateMeta('description');
  const ogTitle = getOrCreateMeta('og:title', true);
  const ogDesc = getOrCreateMeta('og:description', true);
  const ogUrl = getOrCreateMeta('og:url', true);
  const twitterTitle = getOrCreateMeta('twitter:title');
  const twitterDesc = getOrCreateMeta('twitter:description');

  if (tool) {
    const fullTitle = `${tool.name} — SuperTools (Free & Client-Side)`;
    const fullDesc = `${tool.description} Free, 100% client-side ${tool.category} utility running directly in your browser with zero server uploads.`;
    const toolUrl = `https://the-supertools.web.app/#/${tool.id}`;

    document.title = fullTitle;
    descMeta.content = fullDesc;
    canonicalLink.href = toolUrl;

    ogTitle.content = fullTitle;
    ogDesc.content = fullDesc;
    ogUrl.content = toolUrl;

    twitterTitle.content = fullTitle;
    twitterDesc.content = fullDesc;

    updateDynamicJsonLd(tool);
  } else if (activeCategory) {
    const fullTitle = `${activeCategory} Tools & Utilities — SuperTools`;
    const fullDesc = `Explore free client-side ${activeCategory} utilities running 100% in your browser. Fast, private, zero server roundtrips.`;
    const catUrl = `https://the-supertools.web.app/#/category/${encodeURIComponent(activeCategory)}`;

    document.title = fullTitle;
    descMeta.content = fullDesc;
    canonicalLink.href = catUrl;

    ogTitle.content = fullTitle;
    ogDesc.content = fullDesc;
    ogUrl.content = catUrl;

    twitterTitle.content = fullTitle;
    twitterDesc.content = fullDesc;

    updateDynamicJsonLd(null, activeCategory);
  } else {
    document.title = DEFAULT_SEO.title;
    descMeta.content = DEFAULT_SEO.description;
    canonicalLink.href = DEFAULT_SEO.canonical;

    ogTitle.content = DEFAULT_SEO.title;
    ogDesc.content = DEFAULT_SEO.description;
    ogUrl.content = DEFAULT_SEO.canonical;

    twitterTitle.content = DEFAULT_SEO.title;
    twitterDesc.content = DEFAULT_SEO.description;

    updateDynamicJsonLd(null);
  }
}
