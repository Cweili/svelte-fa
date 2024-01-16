<script lang="ts">
  import { setCustomFontSize } from "./utils.js";
  import type { IconSize, PullDir } from "./types.js";

  let clazz: string | undefined = undefined;
  export { clazz as class };
  export let id: string | undefined = undefined;
  export let style: string | undefined = undefined;
  export let size: IconSize | undefined = undefined;
  export let pull: PullDir | undefined = undefined;

  let containerElement: HTMLElement;
  $: containerElement && size && setCustomFontSize(containerElement, size);
</script>

<!-- eslint-disable svelte/no-inline-styles -- Only styles passed to this component should be included -->
<span
  {id}
  class="svelte-fa-layers svelte-fa-base svelte-fa-fw {clazz}"
  class:svelte-fa-pull-left={pull === "left"}
  class:svelte-fa-pull-right={pull === "right"}
  class:svelte-fa-size-lg={size === "lg"}
  class:svelte-fa-size-sm={size === "sm"}
  class:svelte-fa-size-xs={size === "xs"}
  bind:this={containerElement}
  {style}
>
  <!-- eslint-enable -->
  <slot />
</span>

<style>
  .svelte-fa-layers {
    display: inline-block;
    position: relative;
  }

  .svelte-fa-layers :global(.svelte-fa) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    text-align: center;
  }

  .svelte-fa-layers :global(.svelte-fa-layers-text) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .svelte-fa-layers :global(.svelte-fa-layers-text span) {
    display: inline-block;
  }

  .svelte-fa-pull-left {
    float: left;
  }

  .svelte-fa-pull-right {
    float: right;
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
