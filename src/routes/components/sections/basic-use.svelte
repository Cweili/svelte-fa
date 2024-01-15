<script>
  import Fa from "$lib/fa.svelte";
  import { faFlag } from "@fortawesome/free-solid-svg-icons";

  import DocsCode from "../ui/docs-code.svelte";
  import DocsTitle from "../ui/docs-title.svelte";

  import codes from "./codes.js";
</script>

<DocsTitle title="Basic Use" />
<div class="shadow-sm p-3 mb-3 rounded">
  <Fa icon={faFlag} /> Flag
</div>
<DocsCode code={codes.basicUse[0]} />
<div class="shadow-sm p-3 mb-3 rounded">
  Icons import from <a
    href="https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons"
    target="_blank">FontAwesome packages</a
  >, for example: @fortawesome/free-solid-svg-icons.
  <br />
  Icons gallery:
  <a href="https://fontawesome.com/icons" target="_blank">FontAwesome icons</a>
</div>
<div class="shadow-sm p-3 mb-3 rounded">
  <!-- eslint-disable-next-line svelte/no-inline-styles -->
  <div style="font-size: 3em; color: tomato">
    <Fa icon={faFlag} />
  </div>
</div>
<DocsCode code={codes.basicUse[1]} />
