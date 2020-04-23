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
      <div v-show="loading" class="loading">LOADING</div>

      <div v-show="!gameData.inProgress && !loading" class="pre-game">
        <!-- {{teamCookie.name ? teamCookie.name : ''}} -->
        <CreateTeam v-show="!teamInGame" :team="teamCookie.name" :host="host" :gameId="gameData.id" @team-join="onTeamJoin"/>
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
      // teams: [],
      currentTeam: {},
      teamCookie: {
        name: '',
        id: '',
        host: false
      },
      teamInGame: true,
      loading: true
    }
  },
  firestore () {
    return {
      gameData: gamesCollection.doc(this.id)
    }
  },
  mounted () {
    gamesCollection.doc(this.id).get().then((data) => {
      this.getTeamCookie()
      this.loading = false
    })
  },
  computed: {
    teams () {
      console.log('teams', this.gameData)
      return this.gameData.teams
    }
  },
  watch: {
    teamCookie () {
      if (this.teamCookie.id.length) {
        this.$bind('currentTeam', teamsCollection.doc(this.teamCookie.id))
      }
    },
    teams (current, old) {
      // console.log(current, old)

      const teams = this.teams
      if (teams.length) {
        const teamIndex = teams.findIndex((team) => {
          return typeof team !== 'object' ? false : team.id === this.teamCookie.id
        })

        console.log('team index', teamIndex)

        this.teamInGame = teamIndex !== -1
      } else {
        this.teamInGame = false
      }

      console.log(this.teamInGame)
    }
  },
  methods: {
    getTeamCookie () {
      const cookie = this.$cookies.get('vue-trivia-team')
      if (cookie !== null) {
        this.teamCookie = cookie
      }
    },
    onTeamJoin (teamId) {
      this.$bind('currentTeam', teamsCollection.doc(teamId))
      this.teamInGame = true
    }
    // getTeamCookie ()
  }

}
</script>
