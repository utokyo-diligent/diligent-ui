import type { ImageMetadata } from 'astro';

export function responsiveImage(
  image: ImageMetadata,
  maxWidth: number,
  candidateWidths: readonly number[],
) {
  const width = Math.min(image.width, maxWidth);
  return {
    width,
    widths: [...candidateWidths.filter(candidate => candidate < width), width],
    format: image.format === 'svg' ? 'svg' as const : 'webp' as const,
  };
}
