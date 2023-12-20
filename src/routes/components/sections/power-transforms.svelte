<script>
  import Fa from "$lib/fa.svelte";
  import { faSeedling } from "@fortawesome/free-solid-svg-icons";

  import DocsCode from "../ui/docs-code.svelte";
  import DocsTitle from "../ui/docs-title.svelte";

  import codes from "./codes.js";
</script>

<DocsTitle title="Power Transforms" />
<DocsTitle title="Scaling" level={3} />
<div class="shadow-sm p-3 mb-3 rounded">
  <Fa icon={faSeedling} size="4x" style="background: mistyrose" />
  <Fa icon={faSeedling} scale={0.5} size="4x" style="background: mistyrose" />
  <Fa icon={faSeedling} scale={1.2} size="4x" style="background: mistyrose" />
</div>
<DocsCode code={codes.powerTransforms[0]} />

<DocsTitle title="Positioning" level={3} />
<div class="shadow-sm p-3 mb-3 rounded">
  <Fa icon={faSeedling} scale={0.5} size="4x" style="background: mistyrose" />
  <Fa icon={faSeedling} scale={0.5} translateX={0.2} size="4x" style="background: mistyrose" />
  <Fa icon={faSeedling} scale={0.5} translateX={-0.2} size="4x" style="background: mistyrose" />
  <Fa icon={faSeedling} scale={0.5} translateY={0.2} size="4x" style="background: mistyrose" />
  <Fa icon={faSeedling} scale={0.5} translateY={-0.2} size="4x" style="background: mistyrose" />
</div>
<DocsCode code={codes.powerTransforms[1]} />

<DocsTitle title="Rotating &amp; Flipping" level={3} />
<div class="shadow-sm p-3 mb-3 rounded">
  <Fa icon={faSeedling} rotate={90} size="4x" style="background: mistyrose" />
  <Fa icon={faSeedling} rotate={180} size="4x" style="background: mistyrose" />
  <Fa icon={faSeedling} size="4x" rotate="270" style="background: mistyrose" />
  <Fa icon={faSeedling} size="4x" rotate="30" style="background: mistyrose" />
  <Fa icon={faSeedling} size="4x" rotate="-30" style="background: mistyrose" />
  <Fa icon={faSeedling} size="4x" flip="vertical" style="background: mistyrose" />
  <Fa icon={faSeedling} size="4x" flip="horizontal" style="background: mistyrose" />
  <Fa icon={faSeedling} size="4x" flip="both" style="background: mistyrose" />
  <Fa icon={faSeedling} size="4x" flip="both" rotate="30" style="background: mistyrose" />
</div>
<DocsCode code={codes.powerTransforms[2]} />
