<template>
  <div v-show="loading" class="loading">
    <div class="loading-container">

      <q-spinner-hourglass
        color="primary"
        size="5em"
      />
      <h2>Loading</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: ['loading']
}
</script>

<style lang="scss">
  .loading {
    padding: 50px 0;

    &-container  {
      text-align: center;
      max-width: 400px;
      margin: 0 auto;
    }
  }
</style>
