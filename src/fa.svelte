<script>
import {
  getStyles,
  getTransform,
} from './utils';

let clazz = '';
export { clazz as class };
export let id = '';
export let style = '';

export let icon;

export let size = '';
export let color = '';

export let fw = false;
export let pull = '';

export let scale = 1;
export let translateX = 0;
export let translateY = 0;
export let rotate = '';
export let flip = false;

export let spin = false;
export let pulse = false;

// Duotone Icons
export let primaryColor = '';
export let secondaryColor = '';
export let primaryOpacity = 1;
export let secondaryOpacity = 0.4;
export let swapOpacity = false;

let i;
let s;
let transform;

$: i = (icon && icon.icon) || [0, 0, '', [], ''];

$: s = getStyles(style, size, pull, fw);

$: transform = getTransform(scale, translateX, translateY, rotate, flip, 512);
</script>

<style>
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

{#if i[4]}
  <svg
    id={id || undefined}
    class="svelte-fa {clazz}"
    class:pulse
    class:spin
    style={s}
    viewBox="0 0 {i[0]} {i[1]}"
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      transform="translate({i[0] / 2} {i[1] / 2})"
      transform-origin="{i[0] / 4} 0"
    >
      <g {transform}>
        {#if typeof i[4] == 'string'}
          <path
            d={i[4]}
            fill={color || primaryColor || 'currentColor'}
            transform="translate({i[0] / -2} {i[1] / -2})"
          />
        {:else}
          <!-- Duotone icons -->
          <path
            d={i[4][0]}
            fill={secondaryColor || color || 'currentColor'}
            fill-opacity={swapOpacity != false ? primaryOpacity : secondaryOpacity}
            transform="translate({i[0] / -2} {i[1] / -2})"
          />
          <path
            d={i[4][1]}
            fill={primaryColor || color || 'currentColor'}
            fill-opacity={swapOpacity != false ? secondaryOpacity : primaryOpacity}
            transform="translate({i[0] / -2} {i[1] / -2})"
          />
        {/if}
      </g>
    </g>
  </svg>
{/if}
