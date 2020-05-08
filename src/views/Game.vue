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

      <Leaderboard :teams="teams" :questions="game.questions"/>
    </q-drawer>

    <q-page-container>
      <div class="game-container">
        <Loader :loading="loading" />

        <div v-if="!started && !loading">

          <div v-if="isHost">
            <CenterContainer maxWidth="550px">
              <GameSettings :game="game"/>
            </CenterContainer>
          </div>

          <div v-else-if="teamInGame" class="waiting">
            <CenterContainer maxWidth="550px">
              <q-spinner-gears
                class="spinner-gears"
                color="primary"
                size="5em"
              />
              <h3>Waiting...</h3>
              <p>The host is setting up the game and will start when ready.</p>
              <div>Number of questions: {{ game.settings.questions ? game.settings.questions : 10 }}</div>
              <div>Category: {{ game.settings.category ? game.settings.category.label : 'All Categories' }}</div>
              <div>Difficulty: {{ game.settings.difficulty ? game.settings.difficulty: 'Any Difficulty' }}</div>
              <div>Question Timer: {{ game.settings.timer ? game.settings.timer : 30 }} seconds</div>
            </CenterContainer>
          </div>

          <CreateTeam v-else :team="teamCookie.name" :host="host" :gameId="id" @team-join="onTeamJoin"/>

        </div>

        <div class="game" v-if="started && !loading">
          <div v-if="!teamInGame" class="not-in-game">Sorry this game is already in progress</div>
          <div v-else-if="inProgress" class="questions">
            <Questions
              :gameId="id"
              :questions="game.questions"
              :currentQuestion="game.currentQuestion"
              :teamRef="teamRef"
              :teamAnswers="currentTeam ? currentTeam.answers : null"
              :timerEndTime="game.questionEndTimes[game.currentQuestion - 1]"
              :questionTimer="game.settings.timer"
            />
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
      teamId: null,
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
      teams: gamesCollection.doc(this.id).collection('teams').orderBy('score', 'desc')
    }
  },
  created () {
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
    teamId (id) {
      this.bindCurrentTeam(id)
    },
    currentTeam (team) {
      if (team) {
        this.teamInGame = true
        this.isHost = team.host
        this.teamRef = gamesCollection.doc(this.id).collection('teams').doc(team.id)
      } else {
        this.teamInGame = false
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
        this.teamId = cookie.id
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
      this.teamId = teamId
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
      padding: 50px 15px;

      @include from(7) {
        padding: 75px;
      }
    }
  }

  .spinner-gears {
    margin-bottom: 30px;
  }
</style>
