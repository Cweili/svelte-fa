import {
  fasFlag,
  fasInfo,
} from '@cweili/fa-test-util';
import Fa from '../src/fa.svelte';

let fa;
function unmountFa() {
  if (fa) {
    fa.$destroy();
    fa = undefined;
  }
}

function mountFa(props) {
  unmountFa();
  fa = new Fa({
    target: document.body,
    props: { icon: fasFlag, ...props },
  });
}

function setProps(props) {
  return new Promise((resolve) => {
    fa.$set(props);
    requestAnimationFrame(resolve);
  });
}

function getFa() {
  return document.querySelector('svg');
}

afterEach(unmountFa);

test('basic', async () => {
  mountFa({
    icon: undefined,
  });
  expect(getFa()).toBeFalsy();

  await setProps({
    id: 'a',
    class: 'a',
    style: 'color:red',
    icon: fasFlag,
  });
  expect(getFa().getAttribute('id')).toBe('a');
  expect(getFa().getAttribute('class')).toBe('a');
  expect(getFa().getAttribute('style')).toContain('color:red');
  expect(getFa().querySelector('path').getAttribute('d')).toBe(fasFlag.icon[4]);

  await setProps({
    id: 'b',
    class: 'b',
    style: 'color:blue',
    icon: fasInfo,
  });
  expect(getFa().getAttribute('id')).toBe('b');
  expect(getFa().getAttribute('class')).toBe('b');
  expect(getFa().getAttribute('style')).toContain('color:blue');
  expect(getFa().querySelector('path').getAttribute('d')).toBe(fasInfo.icon[4]);

  await setProps({
    icon: null,
  });
  expect(getFa()).toBeFalsy();
});

test('color', async () => {
  mountFa({
    color: 'red',
  });
  expect(getFa().querySelector('path').getAttribute('fill')).toBe('red');

  await setProps({
    color: null,
  });
  expect(getFa().querySelector('path').getAttribute('fill')).toBe('currentColor');
});

test('fw', async () => {
  mountFa({
    fw: true,
  });
  let style = getFa().getAttribute('style');
  expect(style).toContain('text-align:center');
  expect(style).toContain('width');

  await setProps({
    fw: null,
  });
  style = getFa().getAttribute('style');
  expect(style).not.toContain('text-align:center');
  expect(style).not.toContain('width');
});

test('pull', async () => {
  mountFa({
    pull: 'left',
  });
  let style = getFa().getAttribute('style');
  expect(style).toContain('float:left');

  await setProps({
    pull: 'right',
  });
  style = getFa().getAttribute('style');
  expect(style).toContain('float:right');
});

test('size', async () => {
  mountFa({
    size: '2x',
  });
  let style = getFa().getAttribute('style');
  expect(style).toContain('font-size:2em');

  await setProps({
    size: 'lg',
  });
  style = getFa().getAttribute('style');
  expect(style).toContain('font-size:1.33333em');
  expect(style).toContain('line-height:.75em');
  expect(style).toContain('vertical-align:-.225em');

  await setProps({
    size: 'xs',
  });
  style = getFa().getAttribute('style');
  expect(style).toContain('font-size:.75em');

  await setProps({
    size: 'sm',
  });
  style = getFa().getAttribute('style');
  expect(style).toContain('font-size:.875em');
});

test('flip', async () => {
  mountFa({
    flip: 'both',
  });
  let transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('scale(-1 -1)');

  await setProps({
    flip: 'horizontal',
  });
  transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('scale(-1 1)');

  await setProps({
    flip: 'vertical',
  });
  transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('scale(1 -1)');
});

test('rotate', async () => {
  mountFa({
    rotate: 90,
  });
  let transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('rotate(90 0 0)');

  await setProps({
    rotate: null,
  });
  transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).not.toContain('rotate');
});
