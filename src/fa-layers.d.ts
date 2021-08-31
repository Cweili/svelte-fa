import { SvelteComponent } from 'svelte'

declare class FaLayers extends SvelteComponent {
  constructor(options: any)

  $$prop_def: {
    class?: string
    id?: string
    style?: string

    size?:
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
    pull?: 'left' | 'right'
  }
}

export default FaLayers
