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
    class: 'class-a',
    style: 'color:red',
    icon: fasFlag,
  });
  expect(getFa().getAttribute('id')).toBe('a');
  expect(getFa().getAttribute('class')).toContain('class-a');
  expect(getFa().getAttribute('style')).toContain('color:red');
  expect(getFa().querySelector('path').getAttribute('d')).toBe(fasFlag.icon[4]);

  await setProps({
    id: 'b',
    class: 'class-b',
    style: 'color:blue',
    icon: fasInfo,
  });
  expect(getFa().getAttribute('id')).toBe('b');
  expect(getFa().getAttribute('class')).toContain('class-b');
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
  let style = getComputedStyle(getFa());
  expect(style['text-align']).toBe('center');
  expect(style).toContain('width');

  await setProps({
    fw: null,
  });
  style = getFa().getAttribute('style');
  style = getComputedStyle(getFa());
  expect(style).not.toContain('text-align');
  expect(style).not.toContain('width');
});

test('pull', async () => {
  mountFa({
    pull: 'left',
  });
  let style = getComputedStyle(getFa());
  expect(style.float).toBe('left');

  await setProps({
    pull: 'right',
  });
  style = getComputedStyle(getFa());
  expect(style.float).toBe('right');
});

describe('size', () => {
  test('2x', async () => {
    mountFa({
      size: '2x',
    });
    const style = getComputedStyle(getFa());
    expect(style['font-size']).toBe('2em');
    expect(style['line-height']).toBe('');
    expect(style['vertical-align']).toBe('-.125em');
  });

  test('lg', async () => {
    mountFa({
      size: 'lg',
    });
    const style = getComputedStyle(getFa());
    expect(style['font-size']).toBe('1.33333em');
    expect(style['line-height']).toBe('.75em');
    expect(style['vertical-align']).toBe('-.225em');
  });

  test('xs', async () => {
    mountFa({
      size: 'xs',
    });
    const style = getComputedStyle(getFa());
    expect(style['font-size']).toBe('.75em');
    expect(style['line-height']).toBe('');
    expect(style['vertical-align']).toBe('-.125em');
  });

  test('sm', async () => {
    mountFa({
      size: 'sm',
    });
    const style = getComputedStyle(getFa());
    expect(style['font-size']).toBe('.875em');
    expect(style['line-height']).toBe('');
    expect(style['vertical-align']).toBe('-.125em');
  });
});

test('scale', async () => {
  mountFa({
    scale: 0.5,
  });
  let transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('scale(0.5,0.5)');

  await setProps({
    scale: 2,
  });
  transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('scale(2,2)');
});

test('translate', async () => {
  mountFa({
    translateX: 1,
  });
  let transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('translate(512,0)');

  await setProps({
    translateX: 0,
    translateY: 1,
  });
  transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('translate(0,512)');
});

test('flip', async () => {
  mountFa({
    flip: 'both',
  });
  let transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('scale(-1,-1)');

  await setProps({
    flip: 'horizontal',
  });
  transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('scale(-1,1)');

  await setProps({
    flip: 'vertical',
  });
  transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('scale(1,-1)');
});

test('rotate', async () => {
  mountFa({
    rotate: 90,
  });
  let transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('rotate(90)');

  await setProps({
    rotate: null,
  });
  transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).not.toContain('rotate');
});

test('spin', async () => {
  mountFa({
    spin: true,
    pulse: true,
  });

  const clazz = getFa().getAttribute('class');
  expect(clazz).toMatch(/spin/);
  expect(clazz).toMatch(/pulse/);
});
