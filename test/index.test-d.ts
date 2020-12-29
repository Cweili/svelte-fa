import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { SvelteComponent } from 'svelte'
import { expectAssignable, expectNotType, expectType } from 'tsd'
import Fa from '../src'

const fa = new Fa({})

expectAssignable<SvelteComponent>(fa)

expectNotType<undefined>(fa.$$prop_def.icon)
expectNotType<string>(fa.$$prop_def.flip)
expectNotType<string>(fa.$$prop_def.pull)
expectNotType<string>(fa.$$prop_def.size)

expectType<string | undefined>(fa.$$prop_def.class)
expectType<string | undefined>(fa.$$prop_def.id)
expectType<string | undefined>(fa.$$prop_def.style)
expectType<IconDefinition>(fa.$$prop_def.icon)
expectType<'both' | 'horizontal' | 'vertical' | undefined>(fa.$$prop_def.flip)
expectType<'left' | 'right' | undefined>(fa.$$prop_def.pull)
expectType<string | number | undefined>(fa.$$prop_def.rotate)
expectType<
  | 'xs'
  | 'sm'
  | 'lg'
  | '1x'
  | '2x'
  | '3x'
  | '4x'
  | '5x'
  | '6x'
  | '7x'
  | '8x'
  | '9x'
  | '10x'
  | undefined
>(fa.$$prop_def.size)
expectType<boolean | undefined>(fa.$$prop_def.fw)
expectType<string | undefined>(fa.$$prop_def.color)
expectType<string | undefined>(fa.$$prop_def.primaryColor)
expectType<string | number | undefined>(fa.$$prop_def.primaryOpacity)
expectType<string | undefined>(fa.$$prop_def.secondaryColor)
expectType<string | number | undefined>(fa.$$prop_def.secondaryOpacity)
expectType<boolean | undefined>(fa.$$prop_def.swapOpacity)

