import FaLayers from '../src/fa-layers.svelte';
import FaLayersText from '../src/fa-layers-text.svelte';

let faLayers;
let faLayersText;
function unmountFaLayers() {
  if (faLayersText) {
    faLayersText.$destroy();
    faLayersText = undefined;
  }
  if (faLayers) {
    faLayers.$destroy();
    faLayers = undefined;
  }
}

function mountFaLayers(layersProps, textProps) {
  unmountFaLayers();
  faLayers = new FaLayers({
    target: document.body,
    props: layersProps,
  });
  faLayersText = new FaLayersText({
    target: document.querySelector('.svelte-fa-layers'),
    props: textProps,
  });
}

function setProps(comp, props) {
  return new Promise((resolve) => {
    comp.$set(props);
    requestAnimationFrame(resolve);
  });
}

function getFaLayers() {
  return document.querySelector('span');
}

function getFaLayersText() {
  return document.querySelector('span > span');
}

afterEach(unmountFaLayers);

test('basic', async () => {
  mountFaLayers();
  await setProps(faLayers, {
    id: 'a',
    class: 'class-a',
    style: 'color:red',
  });
  await setProps(faLayersText, {
    id: 'b',
    class: 'class-b',
    style: 'color:blue',
  });

  expect(getFaLayers().getAttribute('id')).toBe('a');
  expect(getFaLayers().getAttribute('class')).toContain('class-a');
  expect(getFaLayers().getAttribute('style')).toContain('color:red');

  expect(getFaLayersText().getAttribute('id')).toBe('b');
  expect(getFaLayersText().getAttribute('class')).toContain('class-b');
  expect(getFaLayersText().querySelector('span').getAttribute('style')).toContain('color:blue');
});

test('color', async () => {
  mountFaLayers(
    {},
    {
      color: 'red',
    },
  );
  expect(getFaLayersText().querySelector('span').getAttribute('style')).toContain('color:red');

  await setProps(faLayersText, {
    color: undefined,
  });
  expect(getFaLayersText().querySelector('span').getAttribute('style')).not.toContain('color:red');
});

test('pull', async () => {
  mountFaLayers({
    pull: 'left',
  });
  let style = getFaLayers().getAttribute('style');
  expect(style).toContain('float:left');

  await setProps(faLayers, {
    pull: 'right',
  });
  style = getFaLayers().getAttribute('style');
  expect(style).toContain('float:right');
});

test('size', async () => {
  mountFaLayers(
    {
      size: '2x',
    },
    {
      size: '2x',
    },
  );
  let style = getFaLayers().getAttribute('style');
  let styleText = getFaLayersText().querySelector('span').getAttribute('style');
  expect(style).toContain('font-size:2em');
  expect(styleText).toContain('font-size:2em');

  await setProps(faLayers, {
    size: 'lg',
  });
  await setProps(faLayersText, {
    size: 'lg',
  });
  style = getFaLayers().getAttribute('style');
  styleText = getFaLayersText().querySelector('span').getAttribute('style');
  expect(style).toContain('font-size:1.33333em');
  expect(style).toContain('line-height:.75em');
  expect(style).toContain('vertical-align:-.225em');
  expect(styleText).toContain('font-size:1.33333em');
  expect(styleText).toContain('line-height:.75em');
  expect(styleText).toContain('vertical-align:-.225em');

  await setProps(faLayers, {
    size: 'xs',
  });
  await setProps(faLayersText, {
    size: 'xs',
  });
  style = getFaLayers().getAttribute('style');
  styleText = getFaLayersText().querySelector('span').getAttribute('style');
  expect(style).toContain('font-size:.75em');
  expect(styleText).toContain('font-size:.75em');

  await setProps(faLayers, {
    size: 'sm',
  });
  await setProps(faLayersText, {
    size: 'sm',
  });
  style = getFaLayers().getAttribute('style');
  styleText = getFaLayersText().querySelector('span').getAttribute('style');
  expect(style).toContain('font-size:.875em');
  expect(styleText).toContain('font-size:.875em');
});

test('scale', async () => {
  mountFaLayers(
    {},
    {
      scale: 0.5,
    },
  );
  let transform = getFaLayersText().querySelector('span').getAttribute('style');
  expect(transform).toContain('scale(0.5,0.5)');

  await setProps(faLayersText, {
    scale: 2,
  });
  transform = getFaLayersText().querySelector('span').getAttribute('style');
  expect(transform).toContain('scale(2,2)');
});

test('translate', async () => {
  mountFaLayers(
    {},
    {
      translateX: 1,
    },
  );
  let transform = getFaLayersText().querySelector('span').getAttribute('style');
  expect(transform).toContain('translate(1em,0em)');

  await setProps(faLayersText, {
    translateX: 0,
    translateY: 1,
  });
  transform = getFaLayersText().querySelector('span').getAttribute('style');
  expect(transform).toContain('translate(0em,1em)');
});

test('flip', async () => {
  mountFaLayers(
    {},
    {
      flip: 'both',
    },
  );
  let transform = getFaLayersText().querySelector('span').getAttribute('style');
  expect(transform).toContain('scale(-1,-1)');

  await setProps(faLayersText, {
    flip: 'horizontal',
  });
  transform = getFaLayersText().querySelector('span').getAttribute('style');
  expect(transform).toContain('scale(-1,1)');

  await setProps(faLayersText, {
    flip: 'vertical',
  });
  transform = getFaLayersText().querySelector('span').getAttribute('style');
  expect(transform).toContain('scale(1,-1)');
});

test('rotate', async () => {
  mountFaLayers(
    {},
    {
      rotate: 90,
    },
  );
  let transform = getFaLayersText().querySelector('span').getAttribute('style');
  expect(transform).toContain('rotate(90deg)');

  await setProps(faLayersText, {
    rotate: null,
  });
  transform = getFaLayersText().querySelector('span').getAttribute('style');
  expect(transform).not.toContain('rotate');
});
