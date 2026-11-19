import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import * as math from '../src/lib/carousel.mjs';

const require = createRequire(import.meta.url);
const source = await readFile(new URL('../src/components/portfolio/HomeCarousel.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
function harness() {
  const states = [], frames = [];
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, Date, performance: { now: () => 0 },
    cancelAnimationFrame() {}, requestAnimationFrame(fn) { frames.push(fn); return frames.length; },
    require(name) {
      if (name === 'react') return { useRef: current => ({ current }), useState: initial => [initial, value => states.push(value)], useEffect() {}, useCallback: fn => fn };
      if (name === '@/lib/carousel.mjs') return math;
      if (name.endsWith('.css')) return { default: {} };
      if (name === 'next/image') return { default: 'img' };
      return require(name);
    },
  });
  const tree = exports.HomeCarousel({ slides: Array.from({length:12}, (_,i)=>({slug:String(i),cover:{},alt:'Photo'})) });
  function find(node) {
    if (!node || typeof node !== 'object') return;
    if (node.props?.onPointerDown) return node;
    return [node.props?.children].flat(Infinity).map(find).find(Boolean);
  }
  const wheel = find(tree);
  let capture = false;
  const element = { getBoundingClientRect: () => ({width:300}), setPointerCapture: () => {capture=true;}, hasPointerCapture: () => capture, releasePointerCapture: () => {capture=false;} };
  wheel.props.ref.current = element;
  const child = {};
  const event = (x,y,time,type='pointermove',target=child) => ({pointerId:1,isPrimary:true,button:0,pointerType:'touch',clientX:x,clientY:y,timeStamp:time,type,target,currentTarget:element});
  return { states, frames, wheel:wheel.props, element, event };
}
test('touch swipe survives implicit child capture transferring to the wheel', () => {
  const h=harness();
  h.wheel.onPointerDown(h.event(250,100,0,'pointerdown'));
  h.wheel.onPointerMove(h.event(230,102,20));
  h.wheel.onLostPointerCapture(h.event(230,102,21,'lostpointercapture'));
  assert.equal(h.frames.length,0, 'handoff must not start a snap animation');
  h.wheel.onPointerMove(h.event(90,106,80));
  assert.ok(h.states.some(value => typeof value==='number' && value>3.8), 'finger movement continues updating the wheel');
  h.wheel.onPointerUp(h.event(90,106,90,'pointerup'));
  assert.equal(h.frames.length,1, 'snap only starts after release');
});
test('vertical touch yields to page scrolling without moving the wheel', () => {
  const h=harness();
  h.wheel.onPointerDown(h.event(200,100,0,'pointerdown'));
  h.wheel.onPointerMove(h.event(203,130,20));
  h.wheel.onPointerMove(h.event(90,180,60));
  assert.equal(h.states.some(value=>typeof value==='number'),false);
  assert.equal(h.element.hasPointerCapture(),false);
});
test('touch cancellation settles the wheel and ignores subsequent movement', () => {
  const h=harness();
  h.wheel.onPointerDown(h.event(250,100,0,'pointerdown'));
  h.wheel.onPointerMove(h.event(190,100,20));
  h.wheel.onPointerCancel(h.event(190,100,30,'pointercancel'));
  const length=h.states.length;
  h.wheel.onPointerMove(h.event(90,100,60));
  assert.equal(h.states.length,length);
  assert.equal(h.frames.length,1);
  assert.equal(h.element.hasPointerCapture(),false);
});
