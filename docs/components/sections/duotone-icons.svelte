<script>
  import DocsCode from '../ui/docs-code.svelte';
  import DocsImg from '../ui/docs-img.svelte';
  import DocsTitle from '../ui/docs-title.svelte';

  import codes from '../../content/codes';
</script>

<DocsTitle title="Duotone Icons" />
<DocsTitle title="Basic Use" level={3} />
<DocsImg src="assets/duotone-0.png" alt="duotone icons basic use" />
<DocsCode code={codes.duotoneIcons[0]} lang="js" />
<DocsCode code={codes.duotoneIcons[1]} />

<DocsTitle title="Swapping Layer Opacity" level={3} />
<DocsImg
  src="assets/duotone-1.png"
  alt="swapping duotone icons layer opacity"
/>
<DocsCode code={codes.duotoneIcons[2]} />

<DocsTitle title="Changing Opacity" level={3} />
<DocsImg src="assets/duotone-2.png" alt="changing duotone icons opacity" />
<DocsCode code={codes.duotoneIcons[3]} />
<DocsImg src="assets/duotone-3.png" alt="changing duotone icons opacity" />
<DocsCode code={codes.duotoneIcons[4]} />

<DocsTitle title="Coloring Duotone Icons" level={3} />
<DocsImg src="assets/duotone-4.png" alt="coloring duotone icons" />
<DocsCode code={codes.duotoneIcons[5]} />
<DocsTitle title="Advanced Use" level={3} />
<DocsImg src="assets/duotone-5.png" alt="duotone icons advanced use" />
<DocsCode code={codes.duotoneIcons[6]} />
<DocsImg src="assets/duotone-6.png" alt="duotone icons advanced use" />
<DocsCode code={codes.duotoneIcons[7]} />
<DocsImg src="assets/duotone-7.png" alt="duotone icons advanced use" />
<DocsCode code={codes.duotoneIcons[8]} lang="js" />
<DocsCode code={codes.duotoneIcons[9]} />
