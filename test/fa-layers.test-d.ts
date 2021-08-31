import { SvelteComponent } from 'svelte';
import { expectAssignable, expectNotType, expectType } from 'tsd';
import FaLayers from '../src/fa-layers';

const faLayers = new FaLayers({});

expectAssignable<SvelteComponent>(faLayers);

expectType<string | undefined>(faLayers.$$prop_def.class);
expectType<string | undefined>(faLayers.$$prop_def.id);
expectType<string | undefined>(faLayers.$$prop_def.style);

expectNotType<string>(faLayers.$$prop_def.size);
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
>(faLayers.$$prop_def.size);

expectType<'left' | 'right' | undefined>(faLayers.$$prop_def.pull);
expectNotType<string>(faLayers.$$prop_def.pull);
