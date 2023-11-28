<script>
import { onMount } from 'svelte';

import {
  setCustomSize,
} from './utils';

let clazz = '';
export { clazz as class };
export let id = '';
export let style = '';

export let size = '';
export let pull = '';

let containerElement;

onMount(() => { setCustomSize(containerElement, size); });
</script>

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
  line-height: .75em;
  vertical-align: -.225em;
}

.svelte-fa-size-sm {
  font-size: .875em;
}

.svelte-fa-size-xs {
  font-size: .75em;
}
</style>

<span
  id={id}
  bind:this={containerElement}
  class="svelte-fa-layers svelte-fa-base svelte-fa-fw {clazz}"
  class:svelte-fa-pull-left={pull === 'left'}
  class:svelte-fa-pull-right={pull === 'right'}
  class:svelte-fa-size-lg={size === 'lg'}
  class:svelte-fa-size-sm={size === 'sm'}
  class:svelte-fa-size-xs={size === 'xs'}
  style={style !== '' ? style : null}
>
  <slot></slot>
</span>
