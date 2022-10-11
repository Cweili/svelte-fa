<script>
  import Fa, { FaLayers, FaLayersText } from "svelte-fa";
  import {
    faBookmark,
    faCalendar,
    faCertificate,
    faCircle,
    faEnvelope,
    faHeart,
    faMoon,
    faPlay,
    faStar,
    faSun,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";

  import DocsCode from "../ui/docs-code.svelte";
  import DocsTitle from "../ui/docs-title.svelte";

  import codes from "../../content/codes";
</script>

<DocsTitle title="Layering &amp; Text" />
<div class="shadow-sm p-3 mb-3 rounded">
  <FaLayers size="4x" style="background: mistyrose">
    <Fa icon={faCircle} color="tomato" />
    <Fa icon={faTimes} scale={0.5} color="white" />
  </FaLayers>
  <FaLayers size="4x" style="background: mistyrose">
    <Fa icon={faBookmark} />
    <Fa icon={faHeart} scale={0.4} translateY={-0.1} color="tomato" />
  </FaLayers>
  <FaLayers size="4x" style="background: mistyrose">
    <Fa icon={faPlay} scale={1.2} rotate={-90} />
    <Fa icon={faSun} scale={0.35} translateY={-0.2} color="white" />
    <Fa
      icon={faMoon}
      scale={0.3}
      translateX={-0.25}
      translateY={0.25}
      color="white"
    />
    <Fa
      icon={faStar}
      scale={0.3}
      translateX={0.25}
      translateY={0.25}
      color="white"
    />
  </FaLayers>
  <FaLayers size="4x" style="background: mistyrose">
    <Fa icon={faCalendar} />
    <FaLayersText
      scale={0.45}
      translateY={0.1}
      color="white"
      style="font-weight: 900"
    >
      27
    </FaLayersText>
  </FaLayers>
  <FaLayers size="4x" style="background: mistyrose">
    <Fa icon={faCertificate} />
    <FaLayersText
      scale={0.25}
      rotate={-30}
      color="white"
      style="font-weight: 900"
    >
      NEW
    </FaLayersText>
  </FaLayers>
  <FaLayers size="4x" style="background: mistyrose">
    <Fa icon={faEnvelope} />
    <FaLayersText
      scale={0.2}
      translateX={0.4}
      translateY={-0.4}
      color="white"
      style="padding: 0 .2em; background: tomato; border-radius: 1em"
    >
      1,419
    </FaLayersText>
  </FaLayers>
</div>
<DocsCode code={codes.layering[0]} lang="js" />
<DocsCode code={codes.layering[1]} />
