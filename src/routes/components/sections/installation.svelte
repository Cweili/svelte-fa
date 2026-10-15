<script>
  import DocsCode from "../ui/docs-code.svelte";
  import DocsTitle from "../ui/docs-title.svelte";

  import codes from "./codes.js";
</script>

<DocsTitle title="Installation" />
<DocsCode code={codes.installation[0]} />
<div class="shadow-sm p-3 mb-3 rounded">
  Install FontAwesome icons via <a
    href="https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons"
    target="_blank">official packages</a
  >, for example:
</div>
<DocsCode code={codes.installation[1]} />
<div class="shadow-sm p-3 mb-3 rounded">
  <strong>Notice for <a href="https://sapper.svelte.dev/" target="_blank">Sapper</a> user:</strong> You
  may need to install the component as a devDependency:
</div>
<DocsCode code={codes.installation[2]} />
<div class="shadow-sm p-3 mb-3 rounded">
  <strong
    >Notice for <a href="https://kit.svelte.dev/" target="_blank">SvelteKit</a>/<a
      href="https://www.npmjs.com/package/vite"
      target="_blank">Vite</a
    > user:</strong
  > Import the component and icons from their package entry points:
</div>
<DocsCode code={codes.installation[3]} lang="js" />
<div class="shadow-sm p-3 mb-3 rounded">
  The <code>svelte-fa/dist/fa.svelte</code> subpath is not exported. Use <code>svelte-fa</code>
  instead.
</div>
