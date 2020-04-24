<template>
  <div class="center-container" :style="`max-width: ${maxWidth}`">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CenterContainer',
  props: ['maxWidth']
}
</script>

<style lang="scss">
  .center-container {
    padding: 25px;
    margin: 0 auto;
    text-align: center;
    box-shadow: 0 2px 15px rgba(rgb(39, 37, 37), .2);

    @include from(7) {
      padding: 50px;
    }
  }
</style>
