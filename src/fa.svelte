<script>
let clazz = '';
export { clazz as class };
export let id = '';
export let style = '';

export let icon;
export let fw = false;
export let flip = false;
export let pull = '';
export let rotate = '';
export let size = '';
export let color = '';

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

$: {
  let float;
  let width;
  const height = '1em';
  let lineHeight;
  let fontSize;
  let textAlign;
  let verticalAlign = '-.125em';
  const overflow = 'visible';

  if (fw) {
    textAlign = 'center';
    width = '1.25em';
  }

  if (pull) {
    float = pull;
  }

  if (size) {
    if (size == 'lg') {
      fontSize = '1.33333em';
      lineHeight = '.75em';
      verticalAlign = '-.225em';
    } else if (size == 'xs') {
      fontSize = '.75em';
    } else if (size == 'sm') {
      fontSize = '.875em';
    } else {
      fontSize = size.replace('x', 'em');
    }
  }

  const styleObj = {
    float,
    width,
    height,
    'line-height': lineHeight,
    'font-size': fontSize,
    'text-align': textAlign,
    'vertical-align': verticalAlign,
    overflow,
  };
  let styleStr = '';
  for (const prop in styleObj) {
    if (styleObj[prop]) {
      styleStr += `${prop}:${styleObj[prop]};`;
    }
  }
  s = styleStr + style;
}

$: {
  let t = '';

  if (flip) {
    let flipX = 1;
    let flipY = 1;
    if (flip == 'horizontal') {
      flipX = -1;
    } else if (flip == 'vertical') {
      flipY = -1;
    } else {
      flipX = flipY = -1;
    }
    t += ` scale(${flipX} ${flipY})`;
  }

  if (rotate) {
    t += ` rotate(${rotate} 0 0)`;
  }

  transform = t;
}
</script>

{#if i[4]}
  <svg
    {id}
    class={clazz}
    style={s}
    viewBox={`0 0 ${i[0]} ${i[1]}`}
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      transform="translate(256 256)"
    >
      <g {transform}>
        {#if typeof i[4] == 'string'}
          <path
            d={i[4]}
            fill={color || primaryColor || 'currentColor'}
            transform="translate(-256 -256)"
          />
        {:else}
          <path
            d={i[4][0]}
            fill={secondaryColor || color || 'currentColor'}
            fill-opacity={swapOpacity != false ? primaryOpacity : secondaryOpacity}
            transform="translate(-256 -256)"
          />
          <path
            d={i[4][1]}
            fill={primaryColor || color || 'currentColor'}
            fill-opacity={swapOpacity != false ? secondaryOpacity : primaryOpacity}
            transform="translate(-256 -256)"
          />
        {/if}
      </g>
    </g>
  </svg>
{/if}
