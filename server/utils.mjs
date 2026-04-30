/**
 * Server-side slug utility (ES Module)
 * Convert text to URL-friendly slug
 * @param {string} text - Text to convert
 * @returns {string} URL-friendly slug
 */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
