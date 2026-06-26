/** wport brand assets for standalone HTML output (same as wport.me). */

export const WPORT_FAVICON_URL = 'https://wport.me/favicon.ico';

export function wportFaviconLink() {
  return `<link rel="icon" type="image/x-icon" href="${WPORT_FAVICON_URL}">`;
}
