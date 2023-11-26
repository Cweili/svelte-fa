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
  const style = getComputedStyle(getFaLayersText().querySelector('span'));
  expect(style.color).toBe('red');

  await setProps(faLayersText, {
    color: undefined,
  });
  expect(getFaLayersText().querySelector('span').getAttribute('style')).not.toContain('color:red');
});

test('pull', async () => {
  mountFaLayers({
    pull: 'left',
  });
  let style = getComputedStyle(getFaLayers());
  expect(style.float).toBe('left');

  await setProps(faLayers, {
    pull: 'right',
  });
  style = getComputedStyle(getFaLayers());
  expect(style.float).toBe('right');
});

describe('size', () => {
  test('2x', async () => {
    mountFaLayers(
      {
        size: '2x',
      },
      {
        size: '2x',
      },
    );
    const style = getComputedStyle(getFaLayers());
    const styleText = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style['font-size']).toBe('2em');
    expect(style['line-height']).toBe('');
    expect(style['vertical-align']).toBe('');
    expect(styleText['font-size']).toBe('2em');
    expect(styleText['line-height']).toBe('');
    expect(styleText['vertical-align']).toBe('');
  });

  test('lg', async () => {
    mountFaLayers(
      {
        size: 'lg',
      },
      {
        size: 'lg',
      },
    );
    const style = getComputedStyle(getFaLayers());
    const styleText = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style['font-size']).toBe('1.33333em');
    expect(style['line-height']).toBe('.75em');
    expect(style['vertical-align']).toBe('-.225em');
    expect(styleText['font-size']).toBe('1.33333em');
    expect(styleText['line-height']).toBe('.75em');
    expect(styleText['vertical-align']).toBe('-.225em');
  });

  test('xs', async () => {
    mountFaLayers(
      {
        size: 'xs',
      },
      {
        size: 'xs',
      },
    );
    const style = getComputedStyle(getFaLayers());
    const styleText = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style['font-size']).toBe('.75em');
    expect(style['line-height']).toBe('');
    expect(style['vertical-align']).toBe('');
    expect(styleText['font-size']).toBe('.75em');
    expect(styleText['line-height']).toBe('');
    expect(styleText['vertical-align']).toBe('');
  });

  test('sm', async () => {
    mountFaLayers(
      {
        size: 'sm',
      },
      {
        size: 'sm',
      },
    );
    const style = getComputedStyle(getFaLayers());
    const styleText = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style['font-size']).toBe('.875em');
    expect(style['line-height']).toBe('');
    expect(style['vertical-align']).toBe('');
    expect(styleText['font-size']).toBe('.875em');
    expect(styleText['line-height']).toBe('');
    expect(styleText['vertical-align']).toBe('');
  });
});

describe('scale', () => {
  test('half', async () => {
    mountFaLayers(
      {},
      {
        scale: 0.5,
      },
    );
    const style = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style.transform).toContain('scale(0.5,0.5)');
  });

  test('double', async () => {
    mountFaLayers(
      {},
      {
        scale: 2,
      },
    );
    const style = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style.transform).toContain('scale(2,2)');
  });
});

describe('translate', () => {
  test('X', async () => {
    mountFaLayers(
      {},
      {
        translateX: 1,
      },
    );
    const style = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style.transform).toContain('translate(1em,0em)');
  });

  test('Y', async () => {
    mountFaLayers(
      {},
      {
        translateX: 0,
        translateY: 1,
      },
    );

    const style = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style.transform).toContain('translate(0em,1em)');
  });
});

describe('flip', () => {
  test('both', async () => {
    mountFaLayers(
      {},
      {
        flip: 'both',
      },
    );
    const style = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style.transform).toContain('scale(-1,-1)');
  });
  test('horizontal', async () => {
    mountFaLayers(
      {},
      {
        flip: 'horizontal',
      },
    );
    const style = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style.transform).toContain('scale(-1,1)');
  });

  test('vertical', async () => {
    mountFaLayers(
      {},
      {
        flip: 'vertical',
      },
    );
    const style = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style.transform).toContain('scale(1,-1)');
  });
});

describe('rotate', () => {
  test('90', async () => {
    mountFaLayers(
      {},
      {
        rotate: 90,
      },
    );
    const style = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style.transform).toContain('rotate(90deg)');
  });

  test('null', async () => {
    mountFaLayers(
      {},
      {
        rotate: null,
      },
    );
    const style = getComputedStyle(getFaLayersText().querySelector('span'));
    expect(style.transform).not.toContain('rotate');
  });
});
