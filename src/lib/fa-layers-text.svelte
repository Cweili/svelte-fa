<script lang="ts">
  import { getFontSize, getTransform } from "./utils.js";
  import type { FlipDir, IconSize } from "./types.js";

  let clazz = "";
  export { clazz as class };
  export let id = "";
  export let style = "";
  export let size: IconSize | "" = "";
  export let color = "";

  export let scale: number | string = 1;
  export let translateX: number | string = 0;
  export let translateY: number | string = 0;
  export let rotate: number | string = "";
  export let flip: FlipDir | undefined = undefined;

  $: transform = getTransform(scale, translateX, translateY, rotate, flip, 1, "em", "deg");
  $: fontSize = getFontSize(size);
  $: fullStyle =
    `transform: ${transform}` +
    (color ? `; color:${color}` : "") +
    (fontSize ? `; font-size:${fontSize}` : "") +
    (style ? `; ${style}` : "");
</script>

<span {id} class="svelte-fa-layers-text {clazz}">
  <span
    class="svelte-fa-base container"
    class:svelte-fa-size-lg={size === "lg"}
    class:svelte-fa-size-sm={size === "sm"}
    class:svelte-fa-size-xs={size === "xs"}
    style={fullStyle}
  >
    <slot />
  </span>
</span>

<style>
  .container {
    display: inline-block;
    height: auto;
  }

  .svelte-fa-size-lg {
    font-size: 1.33333em;
    line-height: 0.75em;
    vertical-align: -0.225em;
  }

  .svelte-fa-size-sm {
    font-size: 0.875em;
  }

  .svelte-fa-size-xs {
    font-size: 0.75em;
  }
</style>
