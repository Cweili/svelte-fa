<script>
import {
  joinCss,
  getStyles,
} from './utils';

let clazz = '';
export { clazz as class };
export let id = '';
export let style = '';

export let size = '';
export let pull = '';

let c;
let s;

$: c = joinCss(
  [
    clazz,
    'svelte-fa-layers',
  ],
  ' ',
);

$: s = getStyles(style, size, pull, true);
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
</style>

<span
  id={id}
  class={c}
  style={s}
>
  <slot></slot>
</span>
