import { SvelteComponent } from 'svelte'

declare class FaLayersText extends SvelteComponent {
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
    color?: string

    scale?: number | string
    translateX?: number | string
    translateY?: number | string
    rotate?: number | string
    flip?: 'horizontal' | 'vertical' | 'both'
  }
}

export default FaLayersText
