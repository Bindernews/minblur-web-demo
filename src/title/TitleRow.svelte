<script>
  export let classes = "";
</script>

<div class="title-row {classes}">
  <slot></slot>
</div>


<style>
  .title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 0.2em;
    padding-right: 0.2em;
    width: 100%;
    height: 100%;
  }
  .title-row > :global(.spacer-h) {
    flex-basis: 1;
    flex-grow: 1;
    flex-shrink: 1;
  }
</style>
