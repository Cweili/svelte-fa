const parseNumber = parseFloat;

export function setCustomSize(element, size) {
  if (size && size !== 'lg' && size !== 'sm' && size !== 'xs') {
    element.style.fontSize = size.replace('x', 'em');
  }
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

  let output = `translate(${parseNumber(translateX) * translateTimes}${translateUnit},${parseNumber(translateY) * translateTimes}${translateUnit}) scale(${flipX * parseNumber(scale)},${flipY * parseNumber(scale)})`;
  if (rotate) {
    output += ` rotate(${rotate}${rotateUnit})`;
  }
  return output;
}
