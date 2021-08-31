import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { SvelteComponent } from 'svelte'

declare class Fa extends SvelteComponent {
  constructor(options: any)

  $$prop_def: {
    class?: string
    id?: string
    style?: string

    icon: IconDefinition

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

    fw?: boolean
    pull?: 'left' | 'right'

    scale?: number | string
    translateX?: number | string
    translateY?: number | string
    rotate?: number | string
    flip?: 'horizontal' | 'vertical' | 'both'

    spin?: boolean
    pulse?: boolean

    // Duotone Icons
    primaryColor?: string
    secondaryColor?: string
    primaryOpacity?: number | string
    secondaryOpacity?: number | string
    swapOpacity?: boolean
  }
}

export default Fa
