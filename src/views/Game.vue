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
      <div :show="!gameData.inProgress" class="pre-game">
        {{userExists}}
        <CreateUser :user="userExists" :gameRef="gameRef" @user-join="onUserJoin"/>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script>
import { gamesCollection } from '@/firebase'
import CreateUser from '@/components/CreateUser'

export default {
  name: 'Game',
  components: {
    CreateUser
  },
  props: ['id'],
  data () {
    return {
      right: false,
      gameRef: gamesCollection.doc(this.id),
      gameData: {}
    }
  },
  created () {
    console.log(this)
    this.fetchGame()
  },
  computed: {
    userExists () {
      console.log(this.$cookies)
      return this.$cookies.get('vue-trivia-user')
    }
  },
  methods: {
    fetchGame () {
      this.gameRef.get().then((doc) => {
        if (doc.exists) {
          console.log(doc.data())
          this.gameData = doc.data()
        }
      })
    },
    onUserJoin () {
      //
    }
  }

}
</script>
