<script>
import Fa from 'svelte-fa';
import {
  faFlag,
  faHome,
  faInfo,
  faBook,
  faPencilAlt,
  faCog,
  faQuoteLeft,
  faQuoteRight,
  faMagic,
} from '@fortawesome/free-solid-svg-icons';

import DocsCode from './docs-code.svelte';

const codes = {
  installation: [
    'npm install svelte-fa --save',
    `import Fa from 'svelte-fa'
import { faFlag } from '@fortawesome/free-solid-svg-icons'`,
  ],
  basicUse: [
    '<Fa icon={faFlag} /> Flag',
    `<div style="font-size: 3em; color: tomato">
  <Fa icon={faFlag} />
</div>`,
  ],
  additionalStyling: [
    `<Fa icon={faFlag} size="xs" />
<Fa icon={faFlag} size="sm" />
<Fa icon={faFlag} size="lg" />
<Fa icon={faFlag} size="2x" />
<Fa icon={faFlag} size="2.5x" />
<Fa icon={faFlag} size="5x" />
<Fa icon={faFlag} size="7x" />
<Fa icon={faFlag} size="10x" />`,
    `<div>
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
  <Fa icon={faCog} fw style="background: mistyrose" /> Settins
</div>`,
    `<Fa icon={faQuoteLeft} pull="left" size="2x" />
<Fa icon={faQuoteRight} pull="right" size="2x" />
Gatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that’s no matter — tomorrow we will run faster, stretch our arms further... And one fine morning — So we beat on, boats against the current, borne back ceaselessly into the past.`,
  ],
  powerTransforms: [
    `<Fa icon={faMagic} size="4x" rotate={90} style="background: mistyrose"/>
<Fa icon={faMagic} size="4x" rotate={180} style="background: mistyrose"/>
<Fa icon={faMagic} size="4x" rotate="270" style="background: mistyrose"/>
<Fa icon={faMagic} size="4x" rotate="30" style="background: mistyrose"/>
<Fa icon={faMagic} size="4x" rotate="-30" style="background: mistyrose"/>
<Fa icon={faMagic} size="4x" flip="vertical" style="background: mistyrose"/>
<Fa icon={faMagic} size="4x" flip="horizontal" style="background: mistyrose"/>
<Fa icon={faMagic} size="4x" flip="both" style="background: mistyrose"/>
<Fa icon={faMagic} size="4x" flip="both" style="background: mistyrose"/>`,
  ],
};
</script>

<div>
  <h4>Installation</h4>
  <DocsCode code={codes.installation[0]} />
  <DocsCode
    code={codes.installation[1]}
    lang="js"
  />
  <h4>Basic Use</h4>
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa icon={faFlag} /> Flag
  </div>
  <DocsCode code={codes.basicUse[0]} />
  <div class="shadow-sm p-3 mb-3 rounded">
    <div style="font-size: 3em; color: tomato">
      <Fa icon={faFlag} />
    </div>
  </div>
  <DocsCode code={codes.basicUse[1]} />
  <h4>Additional Styling</h4>
  <h5>Icon Sizes</h5>
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa
      icon={faFlag}
      size="xs"
    />
    <Fa
      icon={faFlag}
      size="sm"
    />
    <Fa
      icon={faFlag}
      size="lg"
    />
    <Fa
      icon={faFlag}
      size="2x"
    />
    <Fa
      icon={faFlag}
      size="2.5x"
    />
    <Fa
      icon={faFlag}
      size="5x"
    />
    <Fa
      icon={faFlag}
      size="7x"
    />
    <Fa
      icon={faFlag}
      size="10x"
    />
  </div>
  <DocsCode code={codes.additionalStyling[0]} />
  <h5>Fixed Width Icons</h5>
  <div class="shadow-sm p-3 mb-3 rounded">
    <div>
      <Fa
        icon={faHome}
        fw
        style="background: mistyrose"
      /> Home
    </div>
    <div>
      <Fa
        icon={faInfo}
        fw
        style="background: mistyrose"
      /> Info
    </div>
    <div>
      <Fa
        icon={faBook}
        fw
        style="background: mistyrose"
      /> Library
    </div>
    <div>
      <Fa
        icon={faPencilAlt}
        fw
        style="background: mistyrose"
      /> Applications
    </div>
    <div>
      <Fa
        icon={faCog}
        fw
        style="background: mistyrose"
      /> Settins
    </div>
  </div>
  <DocsCode code={codes.additionalStyling[1]} />
  <h5>Pulled Icons</h5>
  <div class="shadow-sm p-3 mb-3 rounded clearfix">
    <Fa
      icon={faQuoteLeft}
      pull="left"
      size="2x"
    />
    <Fa
      icon={faQuoteRight}
      pull="right"
      size="2x"
    />
    Gatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that’s no matter — tomorrow we will run faster, stretch our arms further... And one fine morning — So we beat on, boats against the current, borne back ceaselessly into the past.
  </div>
  <DocsCode code={codes.additionalStyling[2]} />
  <h4>Power Transforms</h4>
  <h5>Rotating &amp; Flipping</h5>
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa
      icon={faMagic}
      rotate={90}
      size="4x"
      style="background: mistyrose"
    />
    <Fa
      icon={faMagic}
      rotate={180}
      size="4x"
      style="background: mistyrose"
    />
    <Fa
      icon={faMagic}
      size="4x"
      rotate="270"
      style="background: mistyrose"
    />
    <Fa
      icon={faMagic}
      size="4x"
      rotate="30"
      style="background: mistyrose"
    />
    <Fa
      icon={faMagic}
      size="4x"
      rotate="-30"
      style="background: mistyrose"
    />
    <Fa
      icon={faMagic}
      size="4x"
      flip="vertical"
      style="background: mistyrose"
    />
    <Fa
      icon={faMagic}
      size="4x"
      flip="horizontal"
      style="background: mistyrose"
    />
    <Fa
      icon={faMagic}
      size="4x"
      flip="both"
      style="background: mistyrose"
    />
    <Fa
      icon={faMagic}
      size="4x"
      flip="both"
      rotate="30"
      style="background: mistyrose"
    />
  </div>
  <DocsCode code={codes.powerTransforms[0]} />
</div>
