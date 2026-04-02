const CDN = 'https://cdn.aerialoptic.net';
const PREFIX = 'aerialoptic';

/**
 * Generate a Cloudflare Image Transformation URL.
 * Input: a path like "/images/home/slider-1.jpg" or "images/home/slider-1.jpg"
 * Output: https://cdn.aerialoptic.net/cdn-cgi/image/format=auto,width=1920/aerialoptic/images/home/slider-1.jpg
 */
export function cfImg(
  src: string,
  opts?: { w?: number; q?: number },
): string {
  const path = src.startsWith('/') ? src.slice(1) : src;
  const params = ['format=auto'];
  if (opts?.w) params.push(`width=${opts.w}`);
  if (opts?.q) params.push(`quality=${opts.q}`);
  return `${CDN}/cdn-cgi/image/${params.join(',')}/${PREFIX}/${path}`;
}

/**
 * Generate srcset string for responsive images.
 * Returns srcset with 480w, 768w, 1200w, 1920w breakpoints.
 */
export function cfSrcset(
  src: string,
  opts?: { q?: number; widths?: number[] },
): string {
  const widths = opts?.widths ?? [480, 768, 1200, 1920];
  return widths
    .map((w) => `${cfImg(src, { w, q: opts?.q })} ${w}w`)
    .join(', ');
}
