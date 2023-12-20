<script lang="ts">
  import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
  import { getFontSize, getTransform } from "./utils.js";
  import type { FlipDir, IconSize, PullDir } from "./types.js";

  let clazz = "";
  export { clazz as class };
  export let id = "";
  export let style = "";

  export let icon: IconDefinition;
  export let size: IconSize | "" = "";
  export let color = "";

  export let fw = false;
  export let pull: PullDir | undefined = undefined;

  export let scale: number | string = 1;
  export let translateX: number | string = 0;
  export let translateY: number | string = 0;
  export let rotate: number | string = "";
  export let flip: FlipDir | undefined = undefined;

  export let spin = false;
  export let pulse = false;

  // Duotone Icons
  export let primaryColor = "";
  export let secondaryColor = "";
  export let primaryOpacity: number | string = 1;
  export let secondaryOpacity: number | string = 0.4;
  export let swapOpacity = false;

  $: i = (icon && icon.icon) || [0, 0, "", [], ""];

  $: transform = getTransform(scale, translateX, translateY, rotate, flip, 512);
  $: fontSize = getFontSize(size);
  $: fullStyle = (fontSize ? `font-size:${fontSize}` : "") + (style ? `; ${style}` : "");
</script>

{#if i[4]}
  <svg
    id={id || undefined}
    class="svelte-fa svelte-fa-base {clazz}"
    class:pulse
    class:svelte-fa-size-lg={size === "lg"}
    class:svelte-fa-size-sm={size === "sm"}
    class:svelte-fa-size-xs={size === "xs"}
    class:svelte-fa-fw={fw}
    class:svelte-fa-pull-left={pull === "left"}
    class:svelte-fa-pull-right={pull === "right"}
    class:spin
    style={fullStyle}
    viewBox="0 0 {i[0]} {i[1]}"
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate({i[0] / 2} {i[1] / 2})" transform-origin="{i[0] / 4} 0">
      <g {transform}>
        {#if typeof i[4] == "string"}
          <path
            d={i[4]}
            fill={color || primaryColor || "currentColor"}
            transform="translate({i[0] / -2} {i[1] / -2})"
          />
        {:else}
          <!-- Duotone icons -->
          <path
            d={i[4][0]}
            fill={secondaryColor || color || "currentColor"}
            fill-opacity={swapOpacity != false ? primaryOpacity : secondaryOpacity}
            transform="translate({i[0] / -2} {i[1] / -2})"
          />
          <path
            d={i[4][1]}
            fill={primaryColor || color || "currentColor"}
            fill-opacity={swapOpacity != false ? secondaryOpacity : primaryOpacity}
            transform="translate({i[0] / -2} {i[1] / -2})"
          />
        {/if}
      </g>
    </g>
  </svg>
{/if}

<style>
  :global(.svelte-fa-base) {
    height: 1em;
    overflow: visible;
    transform-origin: center;
    vertical-align: -0.125em;
  }

  :global(.svelte-fa-fw) {
    text-align: center;
    width: 1.25em;
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

  .spin {
    animation: spin 2s 0s infinite linear;
  }

  .pulse {
    animation: spin 1s infinite steps(8);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
