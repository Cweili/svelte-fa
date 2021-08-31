# svelte-fa

[![npm][badge-version]][npm]
[![bundle size][badge-size]][bundlephobia]
[![npm downloads][badge-downloads]][npm]
[![license][badge-license]][license]


[![github][badge-issues]][github]
[![build][badge-build]][travis]
[![coverage][badge-coverage]][coveralls]

Tiny [FontAwesome 5][fontawesome] component for [Svelte][svelte].

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
```

**Notice for [Sapper][sapper] user:** You may need to install the component as a devDependency:

```shell
npm install svelte-fa -D
```

**Notice for [Svelte Kit][sveltekit] user:** You may need to import the component explicitly as below:

```js
import Fa from 'svelte-fa/src/fa.svelte'
```

## Usage

```html
<script>
import Fa from 'svelte-fa'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
</script>

<Fa icon={faFlag} />
```

## `Fa` Properties

```html
<Fa
  icon={faFlag}
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

* `icon`: icon from FontAwesome packages, for example: `@fortawesome/free-solid-svg-icons`
* `size`: `string` values `xs`, `sm`, `lg` or `2x`, `3x`, `4x`, ..., `10x`
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

* `size`: `string` values `xs`, `sm`, `lg` or `2x`, `3x`, `4x`, ..., `10x`
* `pull`: `string` values `left`, `right`

### `FaLayersText` Properties

* `size`: `string` values `xs`, `sm`, `lg` or `2x`, `3x`, `4x`, ..., `10x`
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

[fontawesome]: https://fontawesome.com/
[fontawesome-npm]: https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons
[svelte]: https://svelte.dev/
[sapper]: https://sapper.svelte.dev/
[sveltekit]: https://kit.svelte.dev/

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

[badge-build]: https://img.shields.io/travis/com/Cweili/svelte-fa/master.svg
[travis]: https://travis-ci.com/Cweili/svelte-fa

[badge-coverage]: https://img.shields.io/coveralls/github/Cweili/svelte-fa/master.svg
[coveralls]: https://coveralls.io/github/Cweili/svelte-fa?branch=master
