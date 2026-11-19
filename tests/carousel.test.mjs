import test from 'node:test';
import assert from 'node:assert/strict';
import { wrapIndex, nearestPosition, releasePosition } from '../src/lib/carousel.mjs';

test('wheel repeats all twelve photographs in both directions without resetting position', () => {
  for (let position = -120; position <= 120; position++) {
    assert.equal(wrapIndex(position + 12, 12), wrapIndex(position, 12));
    assert.equal(wrapIndex(position - 1, 12), (wrapIndex(position, 12) + 11) % 12);
    assert.equal(wrapIndex(position + 1, 12), (wrapIndex(position, 12) + 1) % 12);
  }
});
test('indicator navigation chooses the nearest equivalent slot across the seam', () => {
  assert.equal(nearestPosition(11, 0, 12), 12);
  assert.equal(nearestPosition(0, 11, 12), -1);
  for (let position = -36; position <= 36; position++) for (let index = 0; index < 12; index++) {
    const target = nearestPosition(position, index, 12);
    assert.equal(wrapIndex(target, 12), index);
    assert.ok(Math.abs(target - position) <= 6);
  }
});
test('release snaps to a card and bounds flick momentum in either direction', () => {
  assert.equal(releasePosition(11.8, .01), 13);
  assert.equal(releasePosition(.2, -.01), -1);
  assert.equal(releasePosition(2.3, 0), 2);
  assert.equal(releasePosition(2.3, 100), 3);
  assert.equal(releasePosition(2.3, -100), 1);
});
