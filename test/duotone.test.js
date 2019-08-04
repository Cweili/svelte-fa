import {
  faFlag as fasFlag,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFlag,
  faInfo,
} from '@fortawesome/pro-duotone-svg-icons';
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
  let paths = getFa().querySelectorAll('path');
  expect(paths[0].getAttribute('d')).toBe(faFlag.icon[4][0]);
  expect(paths[1].getAttribute('d')).toBe(faFlag.icon[4][1]);

  await setProps({
    icon: faInfo,
  });
  paths = getFa().querySelectorAll('path');
  expect(paths[0].getAttribute('d')).toBe(faInfo.icon[4][0]);
  expect(paths[1].getAttribute('d')).toBe(faInfo.icon[4][1]);

  await setProps({
    icon: fasFlag,
  });
  expect(getFa().querySelector('path').getAttribute('d')).toBe(fasFlag.icon[4]);

  await setProps({
    icon: faFlag,
  });
  paths = getFa().querySelectorAll('path');
  expect(paths[0].getAttribute('d')).toBe(faFlag.icon[4][0]);
  expect(paths[1].getAttribute('d')).toBe(faFlag.icon[4][1]);
});

test('colors', async () => {
  mountFa();
  const pathes = getFa().querySelectorAll('path');
  expect(pathes[0].getAttribute('fill')).toBe('currentColor');
  expect(pathes[1].getAttribute('fill')).toBe('currentColor');
  expect(pathes[0].getAttribute('fill-opacity')).toBe('0.4');
  expect(pathes[1].getAttribute('fill-opacity')).toBe('1');

  await setProps({
    primaryColor: 'red',
    secondaryColor: 'blue',
    primaryOpacity: 0.2,
    secondaryOpacity: 0.6,
  });
  expect(pathes[0].getAttribute('fill')).toBe('blue');
  expect(pathes[1].getAttribute('fill')).toBe('red');
  expect(pathes[0].getAttribute('fill-opacity')).toBe('0.6');
  expect(pathes[1].getAttribute('fill-opacity')).toBe('0.2');

  await setProps({
    color: 'green',
    primaryColor: null,
    secondaryColor: null,
  });
  expect(pathes[0].getAttribute('fill')).toBe('green');
  expect(pathes[1].getAttribute('fill')).toBe('green');

  await setProps({
    swapOpacity: true,
  });
  expect(pathes[0].getAttribute('fill-opacity')).toBe('0.2');
  expect(pathes[1].getAttribute('fill-opacity')).toBe('0.6');
});
