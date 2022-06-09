<script>
import {
  joinCss,
  getStyles,
  getTransform,
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

$: s = getStyles(
  joinCss([
    joinCss({
      color,
      display: 'inline-block',
      height: 'auto',
      transform: getTransform(scale, translateX, translateY, rotate, flip, undefined, 'em', 'deg'),
    }),
    style,
  ]),
  size,
);
</script>

<span id={id} class="svelte-fa-layers-text {clazz}">
  <span style={s}>
    <slot></slot>
  </span>
</span>
