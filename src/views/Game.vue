<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="game-header">
        <div class="game-title">{{ game.name }}</div>
        <q-space />

        <q-btn flat label="Leaderboard" icon-right="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <!-- drawer content -->
      <q-btn dense flat round icon="close" @click="right = !right" />

      <Leaderboard :teams="teams" />
    </q-drawer>

    <q-page-container>
      <div class="game-container">
        <Loader :loading="loading" />

        <div v-if="!started && !loading">

          <CreateTeam v-if="!teamInGame" :team="teamCookie.name" :host="host" :gameId="game.id" @team-join="onTeamJoin"/>

          <div v-else-if="isHost">
            <CenterContainer maxWidth="550px">
              <GameSettings :game="game"/>
            </CenterContainer>
          </div>

          <div v-else class="waiting">
            <CenterContainer maxWidth="550px">
              <q-spinner-gears
                class="spinner-gears"
                color="primary"
                size="5em"
              />
              <h3>Waiting...</h3>
              <p>The host is setting up the game and will start when ready.</p>
              <div class="">Number of questions: {{ game.settings.questions }}</div>
              <div class="">Category: {{ game.settings.category }}</div>
            </CenterContainer>
          </div>

        </div>

        <div class="game" v-if="started && !loading">
          <div v-if="!teamInGame" class="not-in-game">Sorry this game is already in progress</div>
          <div v-else-if="inProgress" class="questions">
            <Questions :questions="game.questions" :currentQuestion="game.currentQuestion" :teamRef="teamRef" :teamAnswers="currentTeam.answers" />
          </div>
          <GameCountdown v-else :startTime="game.startTime" :gameId="id" />
        </div>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script>
import {
  gamesCollection
} from '@/db'

import CreateTeam from '@/components/CreateTeam'
import Leaderboard from '@/components/Leaderboard'
import Loader from '@/components/Loader'
import CenterContainer from '@/components/CenterContainer'
import GameSettings from '@/components/GameSettings'
import GameCountdown from '@/components/GameCountdown'
import Questions from '@/components/Questions'

export default {
  name: 'Game',
  components: {
    CreateTeam,
    Leaderboard,
    Loader,
    CenterContainer,
    GameSettings,
    GameCountdown,
    Questions
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
        id: ''
      },
      teamInGame: false,
      loading: true,
      isHost: false,
      started: false,
      inProgress: false,
      teamRef: {}
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
  },
  watch: {
    game () {
      console.log(this.game)

      if (this.game && this.game.name) {
        this.loading = false
      }

      if (this.game && this.game.startTime) {
        this.started = true
      }

      if (this.game && this.game.inProgress) {
        this.inProgress = true
      }
    },
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
    teamInGame () {
      if (this.teamCookie.id.length) {
        this.bindCurrentTeam(this.teamCookie.id)
      }
    },
    currentTeam (team) {
      if (team) {
        this.isHost = team.host
        this.teamRef = gamesCollection.doc(this.id).collection('teams').doc(team.id)
      }
    }
  },
  computed: {

  },
  methods: {
    getTeamCookie () {
      const cookie = this.$cookies.get('vue-trivia-team')
      if (cookie !== null) {
        this.teamCookie = cookie
      }
    },
    bindCurrentTeam (teamId) {
      this.$bind('currentTeam',
        gamesCollection.doc(this.id)
          .collection('teams')
          .doc(teamId)
      )
    },
    onTeamJoin (teamId, host) {
      this.bindCurrentTeam(teamId)
      this.teamInGame = true
      this.isHost = !!host
    }
  }
}
</script>

<style lang="scss" scoped>
  .game {
    &-header {
      @include from(7) {
        padding: 0 50px;
      }
    }

    &-title {
      font-family: $header-font;
      margin-bottom: 15px;
      @include rem(font-size, 30px);

      @include from(7) {
        @include rem(font-size, 42px);
      }
    }

    &-container {
      padding: 50px 25px;

      @include from(7) {
        padding: 75px;
      }
    }
  }

  .spinner-gears {
    margin-bottom: 30px;
  }
</style>
