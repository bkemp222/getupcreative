/** Circular indices stay separate from the continuous wheel position. */
export const wrapIndex = (index, count) => ((index % count) + count) % count;
export function nearestPosition(position, index, count) {
  return Math.round(position) + wrapIndex(index - wrapIndex(Math.round(position), count) + count / 2, count) - count / 2;
}
export function releasePosition(position, velocity) {
  // Project a short coast, capped at one additional card even after a fast flick.
  return Math.round(position + Math.max(-1, Math.min(1, velocity * 170)));
}
