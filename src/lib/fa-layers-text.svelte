<script lang="ts">
  import { getTransform, setCustomFontSize } from "./utils.js";
  import type { FlipDir, IconSize } from "./types.js";

  let clazz: string | undefined = undefined;
  export { clazz as class };
  export let id: string | undefined = undefined;
  export let style: string | undefined = undefined;
  export let size: IconSize | undefined = undefined;
  export let color = "";

  export let scale: number | string = 1;
  export let translateX: number | string = 0;
  export let translateY: number | string = 0;
  export let rotate: number | undefined = undefined;
  export let flip: FlipDir | undefined = undefined;

  let containerElement: HTMLElement;
  $: containerElement && size && setCustomFontSize(containerElement, size);
  $: containerElement && color && (containerElement.style.color = color);
  $: transform = getTransform(scale, translateX, translateY, rotate, flip, 1, "em", "deg");
  $: containerElement && transform && (containerElement.style.transform = transform);
</script>

<span {id} class="svelte-fa-layers-text {clazz}">
  <!-- eslint-disable svelte/no-inline-styles -- Only styles passed to this component should be included -->
  <span
    class="svelte-fa-base container"
    class:svelte-fa-size-lg={size === "lg"}
    class:svelte-fa-size-sm={size === "sm"}
    class:svelte-fa-size-xs={size === "xs"}
    bind:this={containerElement}
    {style}
  >
    <!-- eslint-enable -->
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
