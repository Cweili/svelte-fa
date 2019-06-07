<script>
/* global Prism */

import {
  afterUpdate
} from 'svelte';

export let code;
export let lang = 'html';

let el;

function highlight() {
  Prism.highlightElement(el);
}

$: el && code && highlight();

afterUpdate(highlight);
</script>

<div class="shadow-sm mb-3 rounded">
  <pre><code
    class={`language-${lang}`}
    bind:this={el}
  >{ code }</code></pre>
</div>
