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
import DocsImg from './docs-img.svelte';
import DocsTitle from './docs-title.svelte';

const codes = {
  installation: [
    'npm install svelte-fa',
    'npm install @fortawesome/free-solid-svg-icons',
    'npm install svelte-fa -D',
    "import Fa from 'svelte-fa/src/fa.svelte'",
  ],
  basicUse: [
    `<\
script>
  import Fa from 'svelte-fa'
  import { faFlag } from '@fortawesome/free-solid-svg-icons'
<\
/script>

<Fa icon={faFlag} /> Flag`,
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
  duotoneIcons: [
    `import {
  faCamera,
  faFireAlt,
  faBusAlt,
  faFillDrip,
} from '@fortawesome/pro-duotone-svg-icons'`,
    `<Fa icon={faCamera} size="3x" />
<Fa icon={faFireAlt} size="3x" />
<Fa icon={faBusAlt} size="3x" />
<Fa icon={faFillDrip} size="3x" />`,
    `<Fa icon={faCamera} size="3x" />
<Fa icon={faCamera} size="3x" swapOpacity />
<Fa icon={faFireAlt} size="3x" />
<Fa icon={faFireAlt} size="3x" swapOpacity />
<Fa icon={faBusAlt} size="3x" />
<Fa icon={faBusAlt} size="3x" swapOpacity />
<Fa icon={faFillDrip} size="3x" />
<Fa icon={faFillDrip} size="3x" swapOpacity />`,
    `<Fa icon={faBusAlt} size="3x" secondaryOpacity={.2} />
<Fa icon={faBusAlt} size="3x" secondaryOpacity={.4} />
<Fa icon={faBusAlt} size="3x" secondaryOpacity={.6} />
<Fa icon={faBusAlt} size="3x" secondaryOpacity={.8} />
<Fa icon={faBusAlt} size="3x" secondaryOpacity={1} />`,
    `<Fa icon={faBusAlt} size="3x" primaryOpacity={.2} />
<Fa icon={faBusAlt} size="3x" primaryOpacity={.4} />
<Fa icon={faBusAlt} size="3x" primaryOpacity={.6} />
<Fa icon={faBusAlt} size="3x" primaryOpacity={.8} />
<Fa icon={faBusAlt} size="3x" primaryOpacity={1} />`,
    `<Fa icon={faBusAlt} size="3x" primaryColor="gold" />
<Fa icon={faBusAlt} size="3x" primaryColor="orangered" />
<Fa icon={faFillDrip} size="3x" secondaryColor="limegreen" />
<Fa icon={faFillDrip} size="3x" secondaryColor="rebeccapurple" />
<Fa icon={faBatteryFull} size="3x" primaryColor="limegreen" secondaryColor="dimgray" />
<Fa icon={faBatteryQuarter} size="3x" primaryColor="orange" secondaryColor="dimgray" />`,
    `<Fa icon={faBook} size="3x" secondaryOpacity={1} primaryColor="lightseagreen" secondaryColor="linen" />
<Fa icon={faBookSpells} size="3x" secondaryOpacity={1} primaryColor="mediumpurple" secondaryColor="linen" />
<Fa icon={faBookMedical} size="3x" secondaryOpacity={1} primaryColor="crimson" secondaryColor="linen" />
<Fa icon={faBookUser} size="3x" secondaryOpacity={1} primaryColor="peru" secondaryColor="linen" />
<Fa icon={faToggleOff} size="3x" secondaryOpacity={1} primaryColor="white" secondaryColor="gray" />
<Fa icon={faToggleOn} size="3x" secondaryOpacity={1} primaryColor="dodgerblue" secondaryColor="white" />
<Fa icon={faFilePlus} size="3x" secondaryOpacity={1} primaryColor="white" secondaryColor="limegreen" />
<Fa icon={faFileExclamation} size="3x" secondaryOpacity={1} primaryColor="white" secondaryColor="gold" />
<Fa icon={faFileTimes} size="3x" secondaryOpacity={1} primaryColor="white" secondaryColor="tomato" />`,
      `<Fa icon={faCrow} size="3x" secondaryOpacity={1} primaryColor="dodgerblue" secondaryColor="gold" />
<Fa icon={faCampfire} size="3x" secondaryOpacity={1} primaryColor="sienna" secondaryColor="red" />
<Fa icon={faBirthdayCake} size="3x" secondaryOpacity={1} primaryColor="pink" secondaryColor="palevioletred" />
<Fa icon={faEar} size="3x" secondaryOpacity={1} primaryColor="sandybrown" secondaryColor="bisque" />
<Fa icon={faCorn} size="3x" secondaryOpacity={1} primaryColor="mediumseagreen" secondaryColor="gold" />
<Fa icon={faCookieBite} size="3x" secondaryOpacity={1} primaryColor="saddlebrown" secondaryColor="burlywood" />`,
      `const themeRavenclaw = {
  secondaryOpacity: 1,
  primaryColor: '#0438a1',
  secondaryColor: '#6c6c6c',
}`,
      `<Fa icon={faHatWizard} size="3x" {...themeRavenclaw} />
<Fa icon={faFlaskPotion} size="3x" {...themeRavenclaw} />
<Fa icon={faWandMagic} size="3x" {...themeRavenclaw} />
<Fa icon={faScarf} size="3x" {...themeRavenclaw} />
<Fa icon={faBookSpells} size="3x" {...themeRavenclaw} />`,
  ]
};
</script>

<div>
  <DocsTitle title="Installation" />
  <DocsCode code={codes.installation[0]} />
  <div class="shadow-sm p-3 mb-3 rounded clearfix">
    Install FontAwesome icons via <a href="https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons" target="_blank">official packages</a>, for example:
  </div>
  <DocsCode code={codes.installation[1]} />
  <div class="shadow-sm p-3 mb-3 rounded clearfix">
    <strong>Notice for <a href="https://sapper.svelte.dev/" target="_blank">Sapper</a> user:</strong> You may need to install the component as a devDependency:
  </div>
  <DocsCode code={codes.installation[2]} />
  <div class="shadow-sm p-3 mb-3 rounded clearfix">
    <strong>Notice for <a href="https://kit.svelte.dev/" target="_blank">Svelte Kit</a> user:</strong> You may need to import the component explicitly as below:
  </div>
  <DocsCode
    code={codes.installation[3]}
    lang="js"
  />
  <DocsTitle title="Basic Use" />
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
  <DocsTitle title="Additional Styling" />
  <DocsTitle title="Icon Sizes" level={5} />
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
  <DocsTitle title="Fixed Width Icons" level={5} />
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
  <DocsTitle title="Pulled Icons" level={5} />
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
  <DocsTitle title="Power Transforms" />
  <DocsTitle title="Rotating &amp; Flipping" level={5} />
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
  <DocsTitle title="Duotone Icons" />
  <DocsTitle title="Basic Use" level={5} />
  <DocsImg src="assets/duotone-0.png" alt="duotone icons basic use" />
  <DocsCode code={codes.duotoneIcons[0]} lang="js" />
  <DocsCode code={codes.duotoneIcons[1]} />
  <DocsTitle title="Swapping Layer Opacity" level={5} />
  <DocsImg src="assets/duotone-1.png" alt="swapping duotone icons layer opacity" />
  <DocsCode code={codes.duotoneIcons[2]} />
  <DocsTitle title="Changing Opacity" level={5} />
  <DocsImg src="assets/duotone-2.png" alt="changing duotone icons opacity" />
  <DocsCode code={codes.duotoneIcons[3]} />
  <DocsImg src="assets/duotone-3.png" alt="changing duotone icons opacity" />
  <DocsCode code={codes.duotoneIcons[4]} />
  <DocsTitle title="Coloring Duotone Icons" level={5} />
  <DocsImg src="assets/duotone-4.png" alt="coloring duotone icons" />
  <DocsCode code={codes.duotoneIcons[5]} />
  <DocsTitle title="Advanced Use" level={5} />
  <DocsImg src="assets/duotone-5.png" alt="duotone icons advanced use" />
  <DocsCode code={codes.duotoneIcons[6]} />
  <DocsImg src="assets/duotone-6.png" alt="duotone icons advanced use" />
  <DocsCode code={codes.duotoneIcons[7]} />
  <DocsImg src="assets/duotone-7.png" alt="duotone icons advanced use" />
  <DocsCode code={codes.duotoneIcons[8]} lang="js" />
  <DocsCode code={codes.duotoneIcons[9]} />
</div>
