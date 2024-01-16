import type { IconSize } from "./types.js";

export function setCustomFontSize(element: HTMLElement | SVGElement, size?: IconSize): void {
  if (size && size !== "lg" && size !== "sm" && size !== "xs") {
    element.style.fontSize = size.replace("x", "em");
  } else {
    element.style.fontSize = "";
  }
}

export function getTransform(
  scale: number | string,
  translateX: number | string,
  translateY: number | string,
  rotate?: number | string,
  flip?: string | undefined,
  translateTimes = 1,
  translateUnit = "",
  rotateUnit = "",
) {
  let flipX = 1;
  let flipY = 1;

  if (flip) {
    if (flip == "horizontal") {
      flipX = -1;
    } else if (flip == "vertical") {
      flipY = -1;
    } else {
      flipX = flipY = -1;
    }
  }

  if (typeof scale === "string") {
    scale = parseFloat(scale);
  }
  if (typeof translateX === "string") {
    translateX = parseFloat(translateX);
  }
  if (typeof translateY === "string") {
    translateY = parseFloat(translateY);
  }

  const x = `${translateX * translateTimes}${translateUnit}`;
  const y = `${translateY * translateTimes}${translateUnit}`;
  let output = `translate(${x},${y}) scale(${flipX * scale},${flipY * scale})`;
  if (rotate) {
    output += ` rotate(${rotate}${rotateUnit})`;
  }
  return output;
}
