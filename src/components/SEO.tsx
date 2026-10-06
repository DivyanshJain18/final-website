import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  keywords?: string[];
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_ORIGIN = 'https://www.mechafyglobal.com';
const DEFAULT_IMAGE = 'https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg';

export function SEO({
  title,
  description,
  canonicalPath,
  type = 'website',
  image = DEFAULT_IMAGE,
  keywords,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // 1. Format Title
    const formattedTitle = title.includes('Mechafy Global')
      ? title
      : `${title} | Mechafy Global`;
    document.title = formattedTitle;

    // Helper to set or create meta tags
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 2. Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Keywords
    if (keywords && keywords.length > 0) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));
    }

    // 4. OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Mechafy Global');
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);

    // 5. Canonical URL
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : DEFAULT_ORIGIN;
    const currentPath = canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const canonicalUrl = `${origin}${currentPath.startsWith('/') ? currentPath : `/${currentPath}`}`;

    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. Twitter Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // 7. Structured Data (JSON-LD)
    const scriptId = 'mechafy-page-ldjson';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, canonicalPath, type, image, keywords, structuredData]);

  return null;
}
