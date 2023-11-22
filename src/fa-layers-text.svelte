<script>
import { onMount } from 'svelte';

import {
  joinCss,
  getTransform,
  setCustomSize,
} from './utils';

let clazz = '';
export { clazz as class };
export let id = '';
export let style = '';

export let size = '';
export let color = '';

export let scale = 1;
export let translateX = 0;
export let translateY = 0;
export let rotate = '';
export let flip = false;

let s;
let containerElement;

onMount(() => { setCustomSize(containerElement, size); });

$: s = joinCss([
  joinCss({
    color,
    transform: getTransform(scale, translateX, translateY, rotate, flip, undefined, 'em', 'deg'),
  }),
  style,
]);
</script>

<style>
.container {
  display: inline-block;
  height: auto;
}
</style>

<span id={id} class="svelte-fa-layers-text {clazz}">
  <span
    bind:this={containerElement}
    class="svelte-fa-base container"
    class:svelte-fa-size-lg={size === 'lg'}
    class:svelte-fa-size-sm={size === 'sm'}
    class:svelte-fa-size-xs={size === 'xs'}
    style={s}
  >
    <slot></slot>
  </span>
</span>
