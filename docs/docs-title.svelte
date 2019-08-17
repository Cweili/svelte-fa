<script>
import Fa from 'svelte-fa';
import { faLink } from '@fortawesome/free-solid-svg-icons';

export let level = 4;
export let title = '';

let id;
$: id = title.toLowerCase().replace(/[^\w]/g, '-');
</script>

<h4 {id} class="h{level}"><a href="#{id}">{title}</a> <small><Fa icon={faLink} /></small></h4>

<style>
a,
a:visited {
  color: currentColor;
}

small {
  visibility: hidden;
}

a:hover + small {
  visibility: visible;
}
</style>