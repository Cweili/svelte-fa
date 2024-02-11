<script lang="ts">
  import { setSymbolStoreCtx } from "./utils.js";

  const store = setSymbolStoreCtx();
</script>

{#each $store as [id, { icon }] (id)}
  {@const i = (icon && icon.icon) || [0, 0, "", [], ""]}
  {#if i[4]}
    <!-- eslint-disable-next-line svelte/no-inline-styles -- Only styles passed to this component should be included -->
    <svg style:display="none">
      <symbol
        {id}
        class="svelte-fa svelte-fa-base"
        viewBox="0 0 {i[0]} {i[1]}"
        aria-hidden="true"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        {#if typeof i[4] == "string"}
          <path
            d={i[4]}
            fill="var(--svelte-fa-primary-color)"
            transform="translate({i[0] / -2} {i[1] / -2})"
          />
        {:else}
          <!-- Duotone icons -->
          <path
            d={i[4][0]}
            fill="var(--svelte-fa-secondary-color)"
            fill-opacity="var(--svelte-fa-secondary-opacity)"
            transform="translate({i[0] / -2} {i[1] / -2})"
          />
          <path
            d={i[4][1]}
            fill="var(--svelte-fa-primary-color)"
            fill-opacity="var(--svelte-fa-primary-opacity)"
            transform="translate({i[0] / -2} {i[1] / -2})"
          />
        {/if}
      </symbol>
    </svg>
  {/if}
{/each}

<slot />
