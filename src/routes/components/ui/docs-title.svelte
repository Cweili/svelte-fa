<script>
  import Fa from "$lib/fa.svelte";
  import { faLink } from "@fortawesome/free-solid-svg-icons";

  export let level = 2;
  export let title = "";

  $: id = title.toLowerCase().replace(/[^\w]/g, "-");
  $: marginTop = level === 2 ? 4 : 3;
</script>

<h4 {id} class="h{level} mt-{marginTop}">
  <a href="#{id}">{title}</a> <small><Fa icon={faLink} /></small>
</h4>

<style>
  a,
  a:visited {
    color: currentColor;
    text-decoration: none;
  }

  a:hover,
  a:active {
    text-decoration: underline;
  }

  small {
    visibility: hidden;
  }

  a:hover + small {
    visibility: visible;
  }
</style>
