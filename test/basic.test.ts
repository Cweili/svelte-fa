import type { ComponentProps } from "svelte";
import { describe, expect, test, afterEach } from "vitest";
// @ts-expect-error No typings available
import { fasFlag, fasInfo } from "@cweili/fa-test-util";
import { render, screen, cleanup } from "@testing-library/svelte";
import Fa from "../src/lib/index.js";

function mountFa(props: Partial<ComponentProps<Fa>>) {
  cleanup();

  render(Fa, {
    props: { icon: fasFlag, ...props },
  });
}

function getFa() {
  return screen.getByRole("img", { hidden: true });
}

afterEach(cleanup);

test("basic", async () => {
  mountFa({
    icon: undefined,
  });
  expect(screen.queryByRole("img")).toBeNull();

  mountFa({
    id: "a",
    class: "class-a",
    style: "color:red",
    icon: fasFlag,
  });

  expect(getFa().getAttribute("id")).toBe("a");
  expect(getFa().getAttribute("class")).toContain("class-a");
  expect(getFa().getAttribute("style")).toContain("color:red");
  expect(getFa().querySelector("path")?.getAttribute("d")).toBe(fasFlag.icon[4]);

  mountFa({
    id: "b",
    class: "class-b",
    style: "color:blue",
    icon: fasInfo,
  });
  expect(getFa().getAttribute("id")).toBe("b");
  expect(getFa().getAttribute("class")).toContain("class-b");
  expect(getFa().getAttribute("style")).toContain("color:blue");
  expect(getFa().querySelector("path")?.getAttribute("d")).toBe(fasInfo.icon[4]);

  mountFa({
    icon: undefined,
  });
  expect(screen.queryByRole("img")).toBeNull();
});

test("color", async () => {
  mountFa({
    color: "red",
  });
  expect(getFa().querySelector("path")?.getAttribute("fill")).toBe("red");

  mountFa({
    color: "",
  });
  expect(getFa().querySelector("path")?.getAttribute("fill")).toBe("currentColor");
});

test("fw", async () => {
  mountFa({
    fw: true,
  });
  expect(getFa().classList.contains("svelte-fa-fw")).toBeTruthy();

  mountFa({
    fw: undefined,
  });
  expect(getFa().classList.contains("svelte-fa-fw")).toBeFalsy();
});

test("pull", async () => {
  mountFa({
    pull: "left",
  });
  expect(getFa().classList.contains("svelte-fa-pull-left")).toBeTruthy();
  expect(getFa().classList.contains("svelte-fa-pull-right")).toBeFalsy();

  mountFa({
    pull: "right",
  });
  expect(getFa().classList.contains("svelte-fa-pull-right")).toBeTruthy();
  expect(getFa().classList.contains("svelte-fa-pull-left")).toBeFalsy();
});

describe("size", () => {
  test("2x", async () => {
    mountFa({
      size: "2x",
    });
    const style = getComputedStyle(getFa());
    expect(style.getPropertyValue("font-size")).toBe("2em");
  });

  test("lg", async () => {
    mountFa({
      size: "lg",
    });
    expect(getFa().classList.contains("svelte-fa-size-lg")).toBeTruthy();
  });

  test("xs", async () => {
    mountFa({
      size: "xs",
    });
    expect(getFa().classList.contains("svelte-fa-size-xs")).toBeTruthy();
  });

  test("sm", async () => {
    mountFa({
      size: "sm",
    });
    expect(getFa().classList.contains("svelte-fa-size-sm")).toBeTruthy();
  });
});

test("scale", async () => {
  mountFa({
    scale: "0.5",
  });
  let transform = getFa().querySelector("g > g")?.getAttribute("transform");
  expect(transform).toContain("scale(0.5,0.5)");

  mountFa({
    scale: 2,
  });
  transform = getFa().querySelector("g > g")?.getAttribute("transform");
  expect(transform).toContain("scale(2,2)");
});

test("translate", async () => {
  mountFa({
    translateX: "1",
    translateY: "0",
  });
  let transform = getFa().querySelector("g > g")?.getAttribute("transform");
  expect(transform).toContain("translate(512,0)");

  mountFa({
    translateX: 0,
    translateY: 1,
  });
  transform = getFa().querySelector("g > g")?.getAttribute("transform");
  expect(transform).toContain("translate(0,512)");
});

test("flip", async () => {
  mountFa({
    flip: "both",
  });
  let transform = getFa().querySelector("g > g")?.getAttribute("transform");
  expect(transform).toContain("scale(-1,-1)");

  mountFa({
    flip: "horizontal",
  });
  transform = getFa().querySelector("g > g")?.getAttribute("transform");
  expect(transform).toContain("scale(-1,1)");

  mountFa({
    flip: "vertical",
  });
  transform = getFa().querySelector("g > g")?.getAttribute("transform");
  expect(transform).toContain("scale(1,-1)");
});

test("rotate", async () => {
  mountFa({
    rotate: 90,
  });
  let transform = getFa().querySelector("g > g")?.getAttribute("transform");
  expect(transform).toContain("rotate(90)");

  mountFa({
    rotate: undefined,
  });
  transform = getFa().querySelector("g > g")?.getAttribute("transform");
  expect(transform).not.toContain("rotate");
});

test("spin", async () => {
  mountFa({
    spin: true,
    pulse: true,
  });

  const classList = getFa().classList;
  expect(classList.contains("spin")).toBeTruthy();
  expect(classList.contains("pulse")).toBeTruthy();
});
