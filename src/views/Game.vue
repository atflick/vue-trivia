<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          {{ game.name }}
        </q-toolbar-title>

        <q-btn flat label="Leaderboard" icon-right="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <!-- drawer content -->
      <q-btn dense flat round icon="close" @click="right = !right" />

      <Leaderboard :teams="teams" />
    </q-drawer>

    <q-page-container>
      <Loader :loading="loading" />

      <div v-show="!game.inProgress && !loading" class="pre-game">

        <CreateTeam v-if="!teamInGame" :team="teamCookie.name" :host="host" :gameId="game.id" @team-join="onTeamJoin"/>
        <div v-else-if="currentTeam.host" class="admin-panel">You are the host</div>
        <div v-else class="waiting">
          <q-spinner-gears
            color="primary"
            size="5em"
          />
          Waiting for host to start the game
        </div>

      </div>

      <div class="game" v-show="game.inProgress && !loading">
        <div v-if="teamInGame" class="questions">Questions!</div>
        <div v-else="" class="not-in-game">Sorry this game is already in progress</div>
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
import Loader from '@/components/Loader'

export default {
  name: 'Game',
  components: {
    CreateTeam,
    Leaderboard,
    Loader
  },
  props: ['id', 'host'],
  data () {
    return {
      right: false,
      game: {},
      teams: null,
      currentTeam: {},
      teamCookie: {
        name: '',
        id: '',
        host: false
      },
      teamInGame: false,
      loading: true
    }
  },
  firestore () {
    return {
      game: gamesCollection.doc(this.id),
      teams: gamesCollection.doc(this.id).collection('teams')
    }
  },
  mounted () {
    this.loading = true
    this.getTeamCookie()
    gamesCollection.doc(this.id).get().then((data) => {
      this.loading = false
    })
  },
  watch: {
    teams () {
      const teams = this.teams
      if (teams.length) {
        const teamIndex = teams.findIndex((team) => {
          return typeof team !== 'object' ? false : team.id === this.teamCookie.id
        })

        this.teamInGame = teamIndex !== -1
      } else {
        this.teamInGame = false
      }
    },
    teamInGame (inGame) {
      this.$bind('currentTeam',
        gamesCollection.doc(this.id)
          .collection('teams')
          .doc(this.teamCookie.id)
      )
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
  }
}
</script>

<style lang="scss">
  .pre-game {
    padding: 50px 25px;

    @include from(7) {
      padding: 75px;
    }
  }
</style>
