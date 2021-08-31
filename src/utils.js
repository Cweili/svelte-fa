const parseNumber = parseFloat;

export function joinCss(obj, separator = ';') {
  let texts;
  if (Array.isArray(obj)) {
    texts = obj.filter((text) => text);
  } else {
    texts = [];
    for (const prop in obj) {
      if (obj[prop]) {
        texts.push(`${prop}:${obj[prop]}`);
      }
    }
  }
  return texts.join(separator);
}

export function getStyles(style, size, pull, fw) {
  let float;
  let width;
  const height = '1em';
  let lineHeight;
  let fontSize;
  let textAlign;
  let verticalAlign = '-.125em';
  const overflow = 'visible';

  if (fw) {
    textAlign = 'center';
    width = '1.25em';
  }

  if (pull) {
    float = pull;
  }

  if (size) {
    if (size == 'lg') {
      fontSize = '1.33333em';
      lineHeight = '.75em';
      verticalAlign = '-.225em';
    } else if (size == 'xs') {
      fontSize = '.75em';
    } else if (size == 'sm') {
      fontSize = '.875em';
    } else {
      fontSize = size.replace('x', 'em');
    }
  }

  return joinCss([
    joinCss({
      float,
      width,
      height,
      'line-height': lineHeight,
      'font-size': fontSize,
      'text-align': textAlign,
      'vertical-align': verticalAlign,
      'transform-origin': 'center',
      overflow,
    }),
    style,
  ]);
}

export function getTransform(
  scale,
  translateX,
  translateY,
  rotate,
  flip,
  translateTimes = 1,
  translateUnit = '',
  rotateUnit = '',
) {
  let flipX = 1;
  let flipY = 1;

  if (flip) {
    if (flip == 'horizontal') {
      flipX = -1;
    } else if (flip == 'vertical') {
      flipY = -1;
    } else {
      flipX = flipY = -1;
    }
  }

  return joinCss(
    [
      `translate(${parseNumber(translateX) * translateTimes}${translateUnit},${parseNumber(translateY) * translateTimes}${translateUnit})`,
      `scale(${flipX * parseNumber(scale)},${flipY * parseNumber(scale)})`,
      rotate && `rotate(${rotate}${rotateUnit})`,
    ],
    ' ',
  );
}
