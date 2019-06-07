# svelte-fa

[![npm][badge-version]][npm]
[![bundle size][badge-size]][bundlephobia]
[![npm downloads][badge-downloads]][npm]
[![license][badge-license]][license]


[![github][badge-issues]][github]
[![build][badge-build]][travis]
[![coverage][badge-coverage]][codecov]

Tiny [FontAwesome 5][fontawesome] component for [Svelte][svelte].

[Documents and examples][doc].

## Installation

```shell
npm install svelte-fa --save
```

## Usage

```html
<template>
  <div>
    <fa icon={faFlag}/>
  </div>
</template>

<script>
  import Fa from 'svelte-fa'
  import { faFlag } from '@fortawesome/free-solid-svg-icons'

  export default {
    components: {
      Fa
    },

    data() {
      return {
        faFlag
      }
    }
  }
</script>
```

## Properties

```html
<fa
  icon={faFlag}
  fw
  flip="horizontal"
  pull="left"
  rotate={90}
  size="2x"/>
```

* `fw`: fixed width
* `flip`: `string` values `horizontal`, `vertical`, `both`
* `pull`: `string` values `left`, `right`
* `rotate`: `number or string` values `90`, `180`, `270`, `30`, `-30` ...
* `size`: `string` values `xs`, `sm`, `lg` or `2x`, `3x`, `4x` ...

[fontawesome]: https://fontawesome.com/
[svelte]: https://svelte.dev/

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

[badge-build]: https://img.shields.io/travis/Cweili/svelte-fa/master.svg
[travis]: https://travis-ci.org/Cweili/svelte-fa

[badge-coverage]: https://img.shields.io/codecov/c/github/Cweili/svelte-fa.svg
[codecov]: https://codecov.io/gh/Cweili/svelte-fa
