<script>
  import { Fa } from 'svelte-fa';
  import {
    faCircleNotch,
    faCog,
    faSpinner,
    faStroopwafel,
    faSync,
  } from "@fortawesome/free-solid-svg-icons";

  import DocsCode from '../ui/docs-code.svelte';
  import DocsTitle from '../ui/docs-title.svelte';

  import codes from '../../content/codes';
</script>

<DocsTitle title="Animating Icons" />
<div class="shadow-sm p-3 mb-3 rounded">
  <Fa icon={faSpinner} size="3x" spin />
  <Fa icon={faCircleNotch} size="3x" spin />
  <Fa icon={faSync} size="3x" spin />
  <Fa icon={faCog} size="3x" spin />
  <Fa icon={faSpinner} size="3x" pulse />
  <Fa icon={faStroopwafel} size="3x" spin />
</div>
<DocsCode code={codes.animatingIcons[0]} />
