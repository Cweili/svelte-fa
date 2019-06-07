import { faFlag } from '@fortawesome/free-solid-svg-icons';
import Fa from '..';

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
    props: Object.assign({
      icon: faFlag,
    }, props),
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
    icon: faFlag,
  });
  expect(getFa().querySelector('path').getAttribute('d')).toBe(faFlag.icon[4]);
});

test('fw', () => {
  mountFa({
    fw: true,
  });
  const style = getFa().getAttribute('style');
  expect(style).toContain('text-align:center');
  expect(style).toContain('width');
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

test('rotate', () => {
  mountFa({
    rotate: 90,
  });
  const transform = getFa().querySelector('g > g').getAttribute('transform');
  expect(transform).toContain('rotate(90 0 0)');
});
