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
      <div v-show="!gameData.inProgress" class="pre-game">
        <!-- {{teamCookie.name ? teamCookie.name : ''}} -->
        <CreateTeam v-show="teamInGame === -1" :team="teamCookie.name" :host="host" :gameId="gameData.id" @team-join="onTeamJoin"/>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script>
import {
  gamesCollection,
  teamsCollection
} from '@/db'

import CreateTeam from '@/components/CreateTeam'
import Leaderboard from '@/components/Leaderboard'

export default {
  name: 'Game',
  components: {
    CreateTeam,
    Leaderboard
  },
  props: ['id', 'host'],
  data () {
    return {
      right: false,
      gameData: {},
      currentTeam: {},
      teamCookie: {
        name: '',
        id: '',
        host: false
      },
      teamInGame: -1
    }
  },
  firestore () {
    return {
      gameData: gamesCollection.doc(this.id)
    }
  },
  created () {
    this.getTeamCookie()
  },
  watch: {
    teamCookie: {
      handler (teamCookie) {
        if (teamCookie.id.length) {
          this.$bind('currentTeam', teamsCollection.doc(teamCookie.id))
        }
        if (this.gameData.teams.length && teamCookie.id.length) {
          this.teamInGame = this.gameData.teams.findIndex((derp) => {
            console.log(derp.id, this.teamCookie.id)
            return derp.id === this.teamCookie.id
          })
        }
      }
    }
  },
  methods: {
    getTeamCookie () {
      const cookie = this.$cookies.get('vue-trivia-team')
      if (cookie !== null) {
        this.teamCookie = cookie
      }
    },
    onTeamJoin () {
      console.log('team joined')
      console.log(this)
      this.getTeamCookie()
    }
    // getTeamCookie ()
  }

}
</script>
