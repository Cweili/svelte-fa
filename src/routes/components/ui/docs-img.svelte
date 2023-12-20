<script lang="ts">
  export let src: string;
  export let alt: string;
</script>

<div class="position-relative shadow-sm p-3 mb-3 rounded">
  <img {src} {alt} />
  <small>images &copy; fontawesome.com</small>
</div>

<style>
  img {
    max-width: 100%;
    max-height: 48px;
  }

  small {
    position: absolute;
    right: 1rem;
    bottom: 0.1rem;
    color: #ddd;
    z-index: -1;
  }
</style>
