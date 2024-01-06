import { describe, expect, test, afterEach } from "vitest";
import { render, screen, cleanup, configure } from "@testing-library/svelte";
import type { ComponentProps } from "svelte";

import { FaLayers, FaLayersText } from "./lib/index.js";

configure({ testIdAttribute: "id" });
afterEach(cleanup);

function mountFaLayers(
  layerProps: Partial<ComponentProps<FaLayers>>,
  textProps: Partial<ComponentProps<FaLayersText>>,
) {
  cleanup();

  render(FaLayers, {
    props: { id: "test-layer", ...layerProps },
  });

  render(
    FaLayersText,
    {
      props: { id: "test-layer-text", ...textProps },
    },
    {
      container: document.querySelector(".svelte-fa-layers") as HTMLElement,
    },
  );
}

function getFaLayers(id = "test-layer") {
  return screen.getByTestId(id);
}

function getFaLayersText(id = "test-layer-text") {
  return screen.getByTestId(id);
}

test("basic", async () => {
  mountFaLayers(
    {
      id: "a",
      class: "class-a",
      style: "color:red",
    },
    {
      id: "b",
      class: "class-b",
      style: "color:blue",
    },
  );

  expect(getFaLayers("a").getAttribute("id")).toBe("a");
  expect(getFaLayers("a").getAttribute("class")).toContain("class-a");
  expect(getFaLayers("a").getAttribute("style")).toContain("color:red");

  expect(getFaLayersText("b").getAttribute("id")).toBe("b");
  expect(getFaLayersText("b").getAttribute("class")).toContain("class-b");
  expect(getFaLayersText("b").querySelector("span")?.getAttribute("style")).toContain("color:blue");
});

test("color", async () => {
  mountFaLayers({}, { color: "red" });
  expect(getFaLayersText().querySelector("span")?.getAttribute("style")).toContain("color:red");
  mountFaLayers({}, { color: undefined });
  expect(getFaLayersText().querySelector("span")?.getAttribute("style")).not.toContain("color:red");
});

test("pull", async () => {
  mountFaLayers({ pull: "left" }, {});
  expect(getFaLayers().classList.contains("svelte-fa-pull-left")).toBeTruthy();
  mountFaLayers({ pull: "right" }, {});
  expect(getFaLayers().classList.contains("svelte-fa-pull-right")).toBeTruthy();
});

describe("size", () => {
  test("2x", async () => {
    mountFaLayers({ size: "2x" }, { size: "2x" });

    const style = getFaLayers().getAttribute("style");
    const styleText = getFaLayersText().querySelector("span")?.getAttribute("style");
    expect(style).toBe("font-size:2em");
    expect(styleText).toContain("font-size:2em");
  });

  test("lg", async () => {
    mountFaLayers({ size: "lg" }, { size: "lg" });
    const layersText = getFaLayersText().querySelector("span");
    expect(getFaLayers().classList.contains("svelte-fa-size-lg")).toBeTruthy();
    expect(layersText?.classList.contains("svelte-fa-size-lg")).toBeTruthy();
  });

  test("xs", async () => {
    mountFaLayers({ size: "xs" }, { size: "xs" });
    const layersText = getFaLayersText().querySelector("span");
    expect(getFaLayers().classList.contains("svelte-fa-size-xs")).toBeTruthy();
    expect(layersText?.classList.contains("svelte-fa-size-xs")).toBeTruthy();
  });

  test("sm", async () => {
    mountFaLayers({ size: "sm" }, { size: "sm" });
    const layersText = getFaLayersText().querySelector("span");
    expect(getFaLayers().classList.contains("svelte-fa-size-sm")).toBeTruthy();
    expect(layersText?.classList.contains("svelte-fa-size-sm")).toBeTruthy();
  });
});

describe("scale", () => {
  test("half", async () => {
    mountFaLayers({}, { scale: 0.5 });
    const style = getFaLayersText().querySelector("span")?.style;
    expect(style?.transform).toContain("scale(0.5,0.5)");
  });

  test("double", async () => {
    mountFaLayers({}, { scale: 2 });
    const style = getFaLayersText().querySelector("span")?.style;
    expect(style?.transform).toContain("scale(2,2)");
  });
});

describe("translate", () => {
  test("X", async () => {
    mountFaLayers({}, { translateX: 1 });
    const style = getFaLayersText().querySelector("span")?.style;
    expect(style?.transform).toContain("translate(1em,0em)");
  });

  test("Y", async () => {
    mountFaLayers({}, { translateX: 0, translateY: 1 });

    const style = getFaLayersText().querySelector("span")?.style;
    expect(style?.transform).toContain("translate(0em,1em)");
  });
});

describe("flip", () => {
  test("both", async () => {
    mountFaLayers({}, { flip: "both" });
    const style = getFaLayersText().querySelector("span")?.style;
    expect(style?.transform).toContain("scale(-1,-1)");
  });
  test("horizontal", async () => {
    mountFaLayers({}, { flip: "horizontal" });
    const style = getFaLayersText().querySelector("span")?.style;
    expect(style?.transform).toContain("scale(-1,1)");
  });

  test("vertical", async () => {
    mountFaLayers({}, { flip: "vertical" });
    const style = getFaLayersText().querySelector("span")?.style;
    expect(style?.transform).toContain("scale(1,-1)");
  });
});

describe("rotate", () => {
  test("90", async () => {
    mountFaLayers({}, { rotate: 90 });
    const style = getFaLayersText().querySelector("span")?.style;
    expect(style?.transform).toContain("rotate(90deg)");
  });

  test("null", async () => {
    mountFaLayers({}, { rotate: "" });
    const style = getFaLayersText().querySelector("span")?.style;
    expect(style?.transform).not.toContain("rotate");
  });
});
