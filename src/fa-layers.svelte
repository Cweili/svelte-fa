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
    'layers',
  ],
  ' ',
);

$: s = getStyles(style, size, pull, true);
</script>

<style>
.layers {
  display: inline-block;
  position: relative;
}

.layers :global(.fa) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
  text-align: center;
}

.layers :global(.layers-text) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.layers :global(.layers-text span) {
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
