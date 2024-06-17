# svelte-fa

[![npm][badge-version]][npm]
[![bundle size][badge-size]][bundlephobia]
[![npm downloads][badge-downloads]][npm]
[![license][badge-license]][license]


[![github][badge-issues]][github]
[![build][badge-build]][workflows]
[![coverage][badge-coverage]][coveralls]

Tiny [FontAwesome][fontawesome] component for [Svelte][svelte].

* FontAwesome version 5 and 6
* FontAwesome svg icons
* Tree-shakable, only import used icons
* No CSS file required
* FontAwesome layering
* FontAwesome duotone icons

[Documents and examples][doc].

## Installation

```shell
npm install svelte-fa
```

Install FontAwesome icons via [official packages][fontawesome-npm], for example:

```shell
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/free-brands-svg-icons
```

Icons gallery: [FontAwesome icons][fontawesome-icons]

### Work with [Sapper][sapper]

You may need to install the component as a devDependency:

```shell
npm install svelte-fa -D
```

### Work with [SvelteKit][sveltekit]/[Vite][vite]

You may need to import the component explicitly as below:

```js
import Fa from 'svelte-fa/dist/fa.svelte'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons/index.es'
```

When using typescript with SvelteKit/Vite, you may also needed to add type definitions that redirect to the non-`index.es` export:

```ts
// app.d.ts
declare module '@fortawesome/pro-solid-svg-icons/index.es' {
  export * from '@fortawesome/pro-solid-svg-icons';
}
```

## Usage

```html
<script>
import Fa from 'svelte-fa'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<Fa icon={faFlag} />
<Fa icon={faGithub} />
```

## `Fa` Properties

```html
<Fa
  icon={faFlag}
  class="bg-gold"
  size="2x"
  color="#ff0000"
  fw
  pull="left"
  scale={1.2}
  translateX={0.2}
  translateY={0.2}
  rotate={90}
  flip="horizontal"
  spin
  pulse
/>
```

* `icon`: icon from [FontAwesome packages][fontawesome-npm], for example: `@fortawesome/free-solid-svg-icons`, icons gallery: [FontAwesome icons][fontawesome-icons]
* `class`: `string` values `${your preffered any css class}`
* `size`: `string` values `xs`, `sm`, `lg` or `2x`, `3x`, `4x`, ..., `${number}x`
* `color`: `string` icon color, default `currentColor`
* `fw`: `boolean` fixed width
* `pull`: `string` values `left`, `right`
* `scale`: `number | string` transform scale, unit is `em`, default `1`
* `translateX`: `number | string` transform position X, unit is `em`, default `0`
* `translateY`: `number | string` transform position Y, unit is `em`, default `0`
* `flip`: `string` values `horizontal`, `vertical`, `both`
* `rotate`: `number | string` values `90`, `180`, `270`, `30`, `-30` ...
* `spin`: `boolean` spin icons
* `pulse`: `boolean` pulse spin icons

## Layering &amp; Text

```js
import Fa, {
  FaLayers,
  FaLayersText,
} from 'svelte-fa';
```

```html
<FaLayers
  size="4x"
  pull="left"
>
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
```

### `FaLayers` Properties

* `size`: `string` values `xs`, `sm`, `lg` or `2x`, `3x`, `4x`, ..., `${number}x`
* `pull`: `string` values `left`, `right`

### `FaLayersText` Properties

* `size`: `string` values `xs`, `sm`, `lg` or `2x`, `3x`, `4x`, ..., `${number}x`
* `color`: `string` icon color, default `currentColor`
* `scale`: `number | string` transform scale, unit is `em`, default `1`
* `translateX`: `number | string` transform position X, unit is `em`, default `0`
* `translateY`: `number | string` transform position Y, unit is `em`, default `0`
* `flip`: `string` values `horizontal`, `vertical`, `both`
* `rotate`: `number | string` values `90`, `180`, `270`, `30`, `-30` ...

## Duotone Icons

```html
<script>
import Fa from 'svelte-fa'
import { faFlag } from '@fortawesome/pro-duotone-svg-icons'
</script>

<Fa
  icon={faFlag}
  primaryColor="red"
  secondaryColor="#000000"
  primaryOpacity={0.8}
  secondaryOpacity={0.6}
  swapOpacity
/>
```

### Duotone Icons Theme

```html
<script>
import Fa from 'svelte-fa'
import { faFlag } from '@fortawesome/pro-duotone-svg-icons'

const theme = {
  primaryColor: 'red',
  secondaryColor: '#000000',
  primaryOpacity: 0.8,
  secondaryOpacity: 0.6,
}
</script>

<Fa
  icon={faFlag}
  {...theme}
/>
```

## Contributors

<!-- readme: collaborators,contributors -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/Cweili">
            <img src="https://avatars.githubusercontent.com/u/2128450?v=4" width="100;" alt="Cweili"/>
            <br />
            <sub><b>Cweili</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/marekdedic">
            <img src="https://avatars.githubusercontent.com/u/3134692?v=4" width="100;" alt="marekdedic"/>
            <br />
            <sub><b>Marek Dědič</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/gtm-nayan">
            <img src="https://avatars.githubusercontent.com/u/50981692?v=4" width="100;" alt="gtm-nayan"/>
            <br />
            <sub><b>Gtmnayan</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/ItzaMi">
            <img src="https://avatars.githubusercontent.com/u/30603437?v=4" width="100;" alt="ItzaMi"/>
            <br />
            <sub><b>Rui Sousa</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/theodorejb">
            <img src="https://avatars.githubusercontent.com/u/3053271?v=4" width="100;" alt="theodorejb"/>
            <br />
            <sub><b>Theodore Brown</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/msanguineti">
            <img src="https://avatars.githubusercontent.com/u/19243840?v=4" width="100;" alt="msanguineti"/>
            <br />
            <sub><b>Mirco Sanguineti</b></sub>
        </a>
    </td></tr>
<tr>
    <td align="center">
        <a href="https://github.com/RealA10N">
            <img src="https://avatars.githubusercontent.com/u/23400213?v=4" width="100;" alt="RealA10N"/>
            <br />
            <sub><b>Alon Krymgand</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/connercsbn">
            <img src="https://avatars.githubusercontent.com/u/65339198?v=4" width="100;" alt="connercsbn"/>
            <br />
            <sub><b>Conner</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/prokawsar">
            <img src="https://avatars.githubusercontent.com/u/9526172?v=4" width="100;" alt="prokawsar"/>
            <br />
            <sub><b>Kawsar Ahmed</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/mvolkmann">
            <img src="https://avatars.githubusercontent.com/u/79312?v=4" width="100;" alt="mvolkmann"/>
            <br />
            <sub><b>Mark Volkmann</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/ModischFabrications">
            <img src="https://avatars.githubusercontent.com/u/25404728?v=4" width="100;" alt="ModischFabrications"/>
            <br />
            <sub><b>Robin Modisch</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/RemiKalbe">
            <img src="https://avatars.githubusercontent.com/u/8604600?v=4" width="100;" alt="RemiKalbe"/>
            <br />
            <sub><b>Rémi Kalbe</b></sub>
        </a>
    </td></tr>
<tr>
    <td align="center">
        <a href="https://github.com/hawk93">
            <img src="https://avatars.githubusercontent.com/u/3786547?v=4" width="100;" alt="hawk93"/>
            <br />
            <sub><b>Null</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: collaborators,contributors -end -->

[fontawesome-icons]: https://fontawesome.com/icons
[fontawesome]: https://fontawesome.com/
[fontawesome-npm]: https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons
[svelte]: https://svelte.dev/
[sapper]: https://sapper.svelte.dev/
[sveltekit]: https://kit.svelte.dev/
[vite]: https://www.npmjs.com/package/vite

[doc]: https://cweili.github.io/svelte-fa/

[badge-version]: https://img.shields.io/npm/v/svelte-fa.svg
[badge-downloads]: https://img.shields.io/npm/dt/svelte-fa.svg
[npm]: https://www.npmjs.com/package/svelte-fa

[badge-size]: https://img.shields.io/bundlephobia/minzip/svelte-fa.svg
[bundlephobia]: https://bundlephobia.com/result?p=svelte-fa

[badge-license]: https://img.shields.io/npm/l/svelte-fa.svg
[license]: https://github.com/Cweili/svelte-fa/blob/master/LICENSE

[badge-issues]: https://img.shields.io/github/issues/Cweili/svelte-fa.svg
[github]: https://github.com/Cweili/svelte-fa

[badge-build]: https://img.shields.io/github/actions/workflow/status/Cweili/svelte-fa/ci.yml?branch=master
[workflows]: https://github.com/Cweili/svelte-fa/actions/workflows/ci.yml?query=branch%3Amaster

[badge-coverage]: https://img.shields.io/coveralls/github/Cweili/svelte-fa/master.svg
[coveralls]: https://coveralls.io/github/Cweili/svelte-fa?branch=master
