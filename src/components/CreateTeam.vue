<template>
  <div class="create-team">
    <h2 class="create-team-title">Join the Game</h2>
    <p>Enter your name or team name below.  This name will be used to identify you on the leaderboard.</p>
    <q-input
      class="welcome-container-game-input"
      v-model="teamName" label="Player/Team Name"
      required
      error-message="Please enter a name"
      :error="cantSubmit"
      @keyup.enter="submit" />
    <q-btn @click="submit">Join!</q-btn>
  </div>
</template>

<script>
import { gamesCollection } from '@/db'

export default {
  name: 'CreateTeam',
  props: ['team', 'gameId', 'host'],
  data () {
    return {
      teamName: this.team !== null ? this.team : '',
      cantSubmit: false
    }
  },
  methods: {
    submit () {
      !this.teamName.length ? this.cantSubmit = true : this.addTeam()
    },
    addTeam () {
      const team = {
        name: this.teamName,
        score: 0,
        answers: [],
        host: !!this.host
      }

      gamesCollection.doc(this.gameId)
        .collection('teams').add(team).then((docRef) => {
          this.$cookies.set('vue-trivia-team', { name: this.teamName, id: docRef.id, host: true })
          this.$emit('team-join', docRef.id, this.host)
        })
    }
  }

}
</script>

<style lang="scss">
  .create-team {
    max-width: 600px;
    padding: 25px;
    margin: 0 auto 20vh;
    text-align: center;
    box-shadow: 0 2px 15px rgba(#000, .2);

    @include from(7) {
      padding: 50px;
    }
  }
</style>
