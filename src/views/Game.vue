<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          {{ gameData.name }}
        </q-toolbar-title>

        <q-btn flat label="Leaderboard" icon-right="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <!-- drawer content -->
      <q-btn dense flat round icon="close" @click="right = !right" />
    </q-drawer>

    <q-page-container>

    </q-page-container>

  </q-layout>
</template>

<script>
import { gamesCollection } from '@/firebase'

export default {
  name: 'Game',
  components: {

  },
  props: ['id'],
  data () {
    return {
      right: false,
      gameData: {}
    }
  },
  created () {
    console.log(this.id)
    this.fetchGame()
  },
  methods: {
    fetchGame () {
      gamesCollection.doc(this.id).get().then((doc) => {
        if (doc.exists) {
          console.log(doc.data())
          this.gameData = doc.data()
        }
      })
    }
  }

}
</script>
