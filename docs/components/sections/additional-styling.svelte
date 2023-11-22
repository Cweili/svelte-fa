<script>
  import Fa from "../../../src/fa.svelte";
  import {
    faBook,
    faCog,
    faFlag,
    faHome,
    faInfo,
    faPencilAlt,
    faQuoteLeft,
    faQuoteRight,
  } from "@fortawesome/free-solid-svg-icons";

  import DocsCode from "../ui/docs-code.svelte";
  import DocsTitle from "../ui/docs-title.svelte";

  import codes from "../../content/codes";
</script>

<DocsTitle title="Additional Styling" />
<DocsTitle title="Icon Sizes" level={3} />
<div class="shadow-sm p-3 mb-3 rounded">
  <Fa icon={faFlag} size="xs" />
  <Fa icon={faFlag} size="sm" />
  <Fa icon={faFlag} size="lg" />
  <Fa icon={faFlag} size="2x" />
  <Fa icon={faFlag} size="2.5x" />
  <Fa icon={faFlag} size="5x" />
  <Fa icon={faFlag} size="7x" />
  <Fa icon={faFlag} size="10x" />
</div>
<DocsCode code={codes.additionalStyling[0]} />

<DocsTitle title="Fixed Width Icons" level={3} />
<div class="shadow-sm p-3 mb-3 rounded">
  <div>
    <Fa icon={faHome} fw style="background: mistyrose" /> Home
  </div>
  <div>
    <Fa icon={faInfo} fw style="background: mistyrose" /> Info
  </div>
  <div>
    <Fa icon={faBook} fw style="background: mistyrose" /> Library
  </div>
  <div>
    <Fa icon={faPencilAlt} fw style="background: mistyrose" /> Applications
  </div>
  <div>
    <Fa icon={faCog} fw style="background: mistyrose" /> Settings
  </div>
</div>
<DocsCode code={codes.additionalStyling[1]} />

<DocsTitle title="Pulled Icons" level={3} />
<div class="shadow-sm p-3 mb-3 rounded clearfix">
  <Fa icon={faQuoteLeft} pull="left" size="2x" />
  <Fa icon={faQuoteRight} pull="right" size="2x" />
  Gatsby believed in the green light, the orgastic future that year by year recedes
  before us. It eluded us then, but that’s no matter — tomorrow we will run faster,
  stretch our arms further... And one fine morning — So we beat on, boats against
  the current, borne back ceaselessly into the past.
</div>
<DocsCode code={codes.additionalStyling[2]} />
