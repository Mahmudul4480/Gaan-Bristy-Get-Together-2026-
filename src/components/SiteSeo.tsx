import { useEffect } from 'react';
import {
  buildBreadcrumbJsonLd,
  buildEventJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  SEO_TITLE,
} from '../data/seoData';
import { getSearchConsoleVerification, installAnalytics, trackPageView } from '../utils/analytics';

function upsertJsonLd(id: string, data: Record<string, unknown>): void {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export default function SiteSeo() {
  useEffect(() => {
    document.title = SEO_TITLE;
    upsertJsonLd('jsonld-website', buildWebSiteJsonLd());
    upsertJsonLd('jsonld-organization', buildOrganizationJsonLd());
    upsertJsonLd('jsonld-event', buildEventJsonLd());
    upsertJsonLd('jsonld-breadcrumb', buildBreadcrumbJsonLd());

    const verification = getSearchConsoleVerification();
    if (verification && !document.querySelector('meta[name="google-site-verification"]')) {
      const meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      meta.content = verification;
      document.head.appendChild(meta);
    }

    installAnalytics();
    trackPageView();

    const onHashChange = () => trackPageView();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return null;
}
