import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { SvelteComponent } from 'svelte';
import { expectAssignable, expectNotType, expectType } from 'tsd';
import Fa from '../src/fa';

const fa = new Fa({});

expectAssignable<SvelteComponent>(fa);

expectType<string | undefined>(fa.$$prop_def.class);
expectType<string | undefined>(fa.$$prop_def.id);
expectType<string | undefined>(fa.$$prop_def.style);

expectNotType<undefined>(fa.$$prop_def.icon);
expectType<IconDefinition>(fa.$$prop_def.icon);

expectNotType<string>(fa.$$prop_def.size);
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
  | `${number}x`
  | undefined
>(fa.$$prop_def.size);
expectAssignable<typeof fa.$$prop_def.size>("1.5x");
//@ts-expect-error - this shouldn't be assignable
expectAssignable<typeof fa.$$prop_def.size>("arbitrary-string-x");

expectType<string | undefined>(fa.$$prop_def.color);

expectType<boolean | undefined>(fa.$$prop_def.fw);
expectType<'left' | 'right' | undefined>(fa.$$prop_def.pull);
expectNotType<string>(fa.$$prop_def.pull);

expectType<string | number | undefined>(fa.$$prop_def.scale);
expectType<string | number | undefined>(fa.$$prop_def.translateX);
expectType<string | number | undefined>(fa.$$prop_def.translateY);
expectType<string | number | undefined>(fa.$$prop_def.rotate);
expectNotType<string>(fa.$$prop_def.flip);
expectType<'both' | 'horizontal' | 'vertical' | undefined>(fa.$$prop_def.flip);

expectType<string | undefined>(fa.$$prop_def.primaryColor);
expectType<string | number | undefined>(fa.$$prop_def.primaryOpacity);
expectType<string | undefined>(fa.$$prop_def.secondaryColor);
expectType<string | number | undefined>(fa.$$prop_def.secondaryOpacity);
expectType<boolean | undefined>(fa.$$prop_def.swapOpacity);
