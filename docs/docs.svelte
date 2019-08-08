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

import {
  faCamera as fadCamera,
  faFireAlt as fadFireAlt,
  faBusAlt as fadBusAlt,
  faFillDrip as fadFillDrip,
  faBatteryFull as fadBatteryFull,
  faBatteryQuarter as fadBatteryQuarter,
  faBook as fadBook,
  faBookSpells as fadBookSpells,
  faBookMedical as fadBookMedical,
  faBookUser as fadBookUser,
  faToggleOff as fadToggleOff,
  faToggleOn as fadToggleOn,
  faFilePlus as fadFilePlus,
  faFileExclamation as fadFileExclamation,
  faFileTimes as fadFileTimes,
  faCrow as fadCrow,
  faCampfire as fadCampfire,
  faBirthdayCake as fadBirthdayCake,
  faEar as fadEar,
  faCorn as fadCorn,
  faCookieBite as fadCookieBite,
  faHatWizard as fadHatWizard,
  faFlaskPotion as fadFlaskPotion,
  faWandMagic as fadWandMagic,
  faScarf as fadScarf,
} from '@fortawesome/pro-duotone-svg-icons';

import DocsCode from './docs-code.svelte';

const themeRavenclaw = {
  secondaryOpacity: 1,
  primaryColor: '#0438a1',
  secondaryColor: '#6c6c6c',
};

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
  duotoneIcons: [
    `import {
  faCamera,
  faFireAlt,
  faBusAlt,
  faFillDrip,
} from '@fortawesome/pro-duotone-svg-icons';`,
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
};`,
      `<Fa icon={faHatWizard} size="3x" {...themeRavenclaw} />
<Fa icon={faFlaskPotion} size="3x" {...themeRavenclaw} />
<Fa icon={faWandMagic} size="3x" {...themeRavenclaw} />
<Fa icon={faScarf} size="3x" {...themeRavenclaw} />
<Fa icon={faBookSpells} size="3x" {...themeRavenclaw} />`,
  ]
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
  <h4>Duotone Icons</h4>
  <h5>Basic Use</h5>
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa icon={fadCamera} size="3x" />
    <Fa icon={fadFireAlt} size="3x" />
    <Fa icon={fadBusAlt} size="3x" />
    <Fa icon={fadFillDrip} size="3x" />
  </div>
  <DocsCode code={codes.duotoneIcons[0]} lang="js" />
  <DocsCode code={codes.duotoneIcons[1]} />
  <h5>Swapping Layer Opacity</h5>
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa icon={fadCamera} size="3x" />
    <Fa icon={fadCamera} size="3x" swapOpacity />
    <Fa icon={fadFireAlt} size="3x" />
    <Fa icon={fadFireAlt} size="3x" swapOpacity />
    <Fa icon={fadBusAlt} size="3x" />
    <Fa icon={fadBusAlt} size="3x" swapOpacity />
    <Fa icon={fadFillDrip} size="3x" />
    <Fa icon={fadFillDrip} size="3x" swapOpacity />
  </div>
  <DocsCode code={codes.duotoneIcons[2]} />
  <h5>Changing Opacity</h5>
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa icon={fadBusAlt} size="3x" secondaryOpacity={.2} />
    <Fa icon={fadBusAlt} size="3x" secondaryOpacity={.4} />
    <Fa icon={fadBusAlt} size="3x" secondaryOpacity={.6} />
    <Fa icon={fadBusAlt} size="3x" secondaryOpacity={.8} />
    <Fa icon={fadBusAlt} size="3x" secondaryOpacity={1} />
  </div>
  <DocsCode code={codes.duotoneIcons[3]} />
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa icon={fadBusAlt} size="3x" primaryOpacity={.2} />
    <Fa icon={fadBusAlt} size="3x" primaryOpacity={.4} />
    <Fa icon={fadBusAlt} size="3x" primaryOpacity={.6} />
    <Fa icon={fadBusAlt} size="3x" primaryOpacity={.8} />
    <Fa icon={fadBusAlt} size="3x" primaryOpacity={1} />
  </div>
  <DocsCode code={codes.duotoneIcons[4]} />
  <h5>Coloring Duotone Icons</h5>
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa icon={fadBusAlt} size="3x" primaryColor="gold" />
    <Fa icon={fadBusAlt} size="3x" primaryColor="orangered" />
    <Fa icon={fadFillDrip} size="3x" secondaryColor="limegreen" />
    <Fa icon={fadFillDrip} size="3x" secondaryColor="rebeccapurple" />
    <Fa icon={fadBatteryFull} size="3x" primaryColor="limegreen" secondaryColor="dimgray" />
    <Fa icon={fadBatteryQuarter} size="3x" primaryColor="orange" secondaryColor="dimgray" />
  </div>
  <DocsCode code={codes.duotoneIcons[5]} />
  <h5>Advanced Use</h5>
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa icon={fadBook} size="3x" secondaryOpacity={1} primaryColor="lightseagreen" secondaryColor="linen" />
    <Fa icon={fadBookSpells} size="3x" secondaryOpacity={1} primaryColor="mediumpurple" secondaryColor="linen" />
    <Fa icon={fadBookMedical} size="3x" secondaryOpacity={1} primaryColor="crimson" secondaryColor="linen" />
    <Fa icon={fadBookUser} size="3x" secondaryOpacity={1} primaryColor="peru" secondaryColor="linen" />
    <Fa icon={fadToggleOff} size="3x" secondaryOpacity={1} primaryColor="white" secondaryColor="gray" />
    <Fa icon={fadToggleOn} size="3x" secondaryOpacity={1} primaryColor="dodgerblue" secondaryColor="white" />
    <Fa icon={fadFilePlus} size="3x" secondaryOpacity={1} primaryColor="white" secondaryColor="limegreen" />
    <Fa icon={fadFileExclamation} size="3x" secondaryOpacity={1} primaryColor="white" secondaryColor="gold" />
    <Fa icon={fadFileTimes} size="3x" secondaryOpacity={1} primaryColor="white" secondaryColor="tomato" />
  </div>
  <DocsCode code={codes.duotoneIcons[6]} />
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa icon={fadCrow} size="3x" secondaryOpacity={1} primaryColor="dodgerblue" secondaryColor="gold" />
    <Fa icon={fadCampfire} size="3x" secondaryOpacity={1} primaryColor="sienna" secondaryColor="red" />
    <Fa icon={fadBirthdayCake} size="3x" secondaryOpacity={1} primaryColor="pink" secondaryColor="palevioletred" />
    <Fa icon={fadEar} size="3x" secondaryOpacity={1} primaryColor="sandybrown" secondaryColor="bisque" />
    <Fa icon={fadCorn} size="3x" secondaryOpacity={1} primaryColor="mediumseagreen" secondaryColor="gold" />
    <Fa icon={fadCookieBite} size="3x" secondaryOpacity={1} primaryColor="saddlebrown" secondaryColor="burlywood" />
  </div>
  <DocsCode code={codes.duotoneIcons[7]} />
  <div class="shadow-sm p-3 mb-3 rounded">
    <Fa icon={fadHatWizard} size="3x" {...themeRavenclaw} />
    <Fa icon={fadFlaskPotion} size="3x" {...themeRavenclaw} />
    <Fa icon={fadWandMagic} size="3x" {...themeRavenclaw} />
    <Fa icon={fadScarf} size="3x" {...themeRavenclaw} />
    <Fa icon={fadBookSpells} size="3x" {...themeRavenclaw} />
  </div>
  <DocsCode code={codes.duotoneIcons[8]} lang="js" />
  <DocsCode code={codes.duotoneIcons[9]} />
</div>
