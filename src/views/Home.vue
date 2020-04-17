<template>
  <div class="home">
    <div class="welcome-container">
        <h1 class="welcome-container-title">Welcome to Trivia</h1>
      <div class="welcome-container-new">

        <q-btn>Start new game</q-btn>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {

  }
}
</script>

<style lang="scss">
  .welcome-container {
    color: primary-color(blue);

    @include from(6) {
      color: blue;
    }

    &-title {
      @include font-weight(60);
      color: primary-color(blue);
      font-family: $header-font;
    }
  }
</style>
