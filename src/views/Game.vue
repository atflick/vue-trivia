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

      <Leaderboard :teams="gameData.teams" />
    </q-drawer>

    <q-page-container>
      <div :show="!gameData.inProgress" class="pre-game">
        {{userExists}}
        <CreateUser :user="userExists" :gameId="gameData.id" @user-join="onUserJoin"/>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script>
import {
  // db,
  gamesCollection
} from '@/db'

import CreateUser from '@/components/CreateUser'
import Leaderboard from '@/components/Leaderboard'

export default {
  name: 'Game',
  components: {
    CreateUser,
    Leaderboard
  },
  props: ['id'],
  data () {
    return {
      right: false,
      gameData: {}
    }
  },
  firestore () {
    return {
      gameData: gamesCollection.doc(this.id)
    }
  },
  computed: {
    userExists () {
      return this.$cookies.get('vue-trivia-user')
    }
  },
  methods: {
    onUserJoin () {
      console.log('user joined')
      console.log(this)
    }
  }

}
</script>
