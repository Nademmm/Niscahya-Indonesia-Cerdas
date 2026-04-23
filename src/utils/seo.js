/**
 * Utility untuk mengelola SEO Meta Tags secara dinamis
 */
export const updateSEO = ({ 
  title, 
  description, 
  keywords, 
  image = '/og-image.png',
  type = 'website'
}) => {
  if (typeof window === 'undefined') return; // SSR Safety

  const siteName = 'Niscahya Indonesia Cerdas';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const url = window.location.href;

  // 1. Update Title
  document.title = fullTitle;

  // 2. Helper untuk update/create meta tag
  const setMeta = (name, content, attr = 'name') => {
    if (!content) return;
    let element = document.querySelector(`meta[${attr}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 3. Standar Meta Tags
  setMeta('description', description);
  setMeta('keywords', keywords);
  setMeta('author', siteName);

  // 4. Open Graph / Facebook
  setMeta('og:title', fullTitle, 'property');
  setMeta('og:description', description, 'property');
  setMeta('og:image', image.startsWith('http') ? image : window.location.origin + image, 'property');
  setMeta('og:url', url, 'property');
  setMeta('og:type', type, 'property');
  setMeta('og:site_name', siteName, 'property');

  // 5. Twitter
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', fullTitle);
  setMeta('twitter:description', description);
  setMeta('twitter:image', image.startsWith('http') ? image : window.location.origin + image);

  // 6. Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};
