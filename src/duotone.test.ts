import type { ComponentProps } from "svelte";
import { expect, test, afterEach } from "vitest";
// @ts-expect-error No typings available
import { fasFlag, fadFlag, fadInfo } from "@cweili/fa-test-util";
import { render, screen, cleanup } from "@testing-library/svelte";
import Fa from "./lib/index.js";

function mountFa(props: Partial<ComponentProps<Fa>>) {
  cleanup();

  render(Fa, {
    props: { icon: fadFlag, ...props },
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
    icon: fadFlag,
  });
  let paths = getFa().querySelectorAll("path");
  expect(paths[0].getAttribute("d")).toBe(fadFlag.icon[4][0]);
  expect(paths[1].getAttribute("d")).toBe(fadFlag.icon[4][1]);

  mountFa({
    icon: fadInfo,
  });
  paths = getFa().querySelectorAll("path");
  expect(paths[0].getAttribute("d")).toBe(fadInfo.icon[4][0]);
  expect(paths[1].getAttribute("d")).toBe(fadInfo.icon[4][1]);

  mountFa({
    icon: fasFlag,
  });
  expect(getFa().querySelector("path")?.getAttribute("d")).toBe(fasFlag.icon[4]);

  mountFa({
    icon: fadFlag,
  });
  paths = getFa().querySelectorAll("path");
  expect(paths[0].getAttribute("d")).toBe(fadFlag.icon[4][0]);
  expect(paths[1].getAttribute("d")).toBe(fadFlag.icon[4][1]);
});

test("colors", async () => {
  mountFa({});
  let paths = getFa().querySelectorAll("path");
  expect(paths[0].getAttribute("fill")).toBe("currentColor");
  expect(paths[1].getAttribute("fill")).toBe("currentColor");
  expect(paths[0].getAttribute("fill-opacity")).toBe("0.4");
  expect(paths[1].getAttribute("fill-opacity")).toBe("1");

  mountFa({
    primaryColor: "red",
    secondaryColor: "blue",
    primaryOpacity: 0.2,
    secondaryOpacity: 0.6,
  });
  paths = getFa().querySelectorAll("path");
  expect(paths[0].getAttribute("fill")).toBe("blue");
  expect(paths[1].getAttribute("fill")).toBe("red");
  expect(paths[0].getAttribute("fill-opacity")).toBe("0.6");
  expect(paths[1].getAttribute("fill-opacity")).toBe("0.2");

  mountFa({
    color: "green",
  });
  paths = getFa().querySelectorAll("path");
  expect(paths[0].getAttribute("fill")).toBe("green");
  expect(paths[1].getAttribute("fill")).toBe("green");

  mountFa({
    color: "green",
    primaryOpacity: 0.2,
    secondaryOpacity: 0.6,
    swapOpacity: true,
  });
  paths = getFa().querySelectorAll("path");
  expect(paths[0].getAttribute("fill-opacity")).toBe("0.2");
  expect(paths[1].getAttribute("fill-opacity")).toBe("0.6");
});
