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

<Fa icon={faFlag}/>
```

## Properties

```html
<Fa
  icon={faFlag}
  fw
  flip="horizontal"
  pull="left"
  rotate={90}
  size="2x"
  color="#ff0000"/>
```

* `fw`: fixed width
* `flip`: `string` values `horizontal`, `vertical`, `both`
* `pull`: `string` values `left`, `right`
* `rotate`: `number or string` values `90`, `180`, `270`, `30`, `-30` ...
* `size`: `string` values `xs`, `sm`, `lg` or `2x`, `3x`, `4x`, ..., `10x`
* `color`: icon color, default `currentColor`

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
  swapOpacity/>
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
  {...theme}/>
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
