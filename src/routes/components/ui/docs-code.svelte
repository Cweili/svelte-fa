<script lang="ts">
  import hljs from "highlight.js/lib/core";
  import javascript from "highlight.js/lib/languages/javascript";
  import xml from "highlight.js/lib/languages/xml";
  import "highlight.js/styles/monokai-sublime.css";

  export let code: string;
  export let lang = "html";

  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("html", xml);

  function highlight(code: string, language: string) {
    return hljs.highlight(code, { language }).value;
  }
</script>

<div class="shadow-sm mb-3 rounded overflow-hidden">
  <!-- eslint-disable svelte/no-at-html-tags -->
  <pre class="mb-0"><code class={`language-${lang} hljs`}>{@html highlight(code, lang)}</code></pre>
</div>
