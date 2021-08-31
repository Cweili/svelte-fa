import { SvelteComponent } from 'svelte';
import { expectAssignable, expectNotType, expectType } from 'tsd';
import FaLayersText from '../src/fa-layers-text';

const faLayersText = new FaLayersText({});

expectAssignable<SvelteComponent>(faLayersText);

expectType<string | undefined>(faLayersText.$$prop_def.class);
expectType<string | undefined>(faLayersText.$$prop_def.id);
expectType<string | undefined>(faLayersText.$$prop_def.style);

expectNotType<string>(faLayersText.$$prop_def.size);
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
>(faLayersText.$$prop_def.size);
expectType<string | undefined>(faLayersText.$$prop_def.color);

expectType<string | number | undefined>(faLayersText.$$prop_def.scale);
expectType<string | number | undefined>(faLayersText.$$prop_def.translateX);
expectType<string | number | undefined>(faLayersText.$$prop_def.translateY);
expectType<string | number | undefined>(faLayersText.$$prop_def.rotate);
expectNotType<string>(faLayersText.$$prop_def.flip);
expectType<'both' | 'horizontal' | 'vertical' | undefined>(faLayersText.$$prop_def.flip);
