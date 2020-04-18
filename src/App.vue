<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <main>
        <router-view></router-view>
      </main>
    </q-page-container>
  </q-layout>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'LayoutDefault',

  components: {
    // HelloWorld
  },

  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>

<style lang="scss">

</style>
