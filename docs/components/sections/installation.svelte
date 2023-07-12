<script>
  import DocsCode from '../ui/docs-code.svelte';
  import DocsTitle from '../ui/docs-title.svelte';

  import codes from '../../content/codes';
</script>

<DocsTitle title="Installation" />
<DocsCode code={codes.installation[0]} />
<div class="shadow-sm p-3 mb-3 rounded clearfix">
  Install FontAwesome icons via <a
    href="https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons"
    target="_blank">official packages</a
  >, for example:
</div>
<DocsCode code={codes.installation[1]} />
<div class="shadow-sm p-3 mb-3 rounded clearfix">
  <strong
    >Notice for <a href="https://sapper.svelte.dev/" target="_blank">Sapper</a> user:</strong
  > You may need to install the component as a devDependency:
</div>
<DocsCode code={codes.installation[2]} />
<div class="shadow-sm p-3 mb-3 rounded clearfix">
  <strong
    >Notice for <a href="https://kit.svelte.dev/" target="_blank">SvelteKit</a
    >/<a href="https://www.npmjs.com/package/vite" target="_blank">Vite</a> user:</strong
  > You may need to import the component explicitly as below:
</div>
<DocsCode code={codes.installation[3]} lang="js" />
<div class="shadow-sm p-3 mb-3 rounded clearfix">
  When using typescript with SvelteKit/Vite, you may also needed to add type
  definitions that redirect to the non-index.es export:
</div>
<DocsCode code={codes.installation[4]} lang="js" />
