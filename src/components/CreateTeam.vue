<template>
  <div class="create-team">
    <h2 class="create-team-title">Join the Game</h2>
    <p>Enter your name or team name below.  This name will be used to identify you on the leaderboard.</p>
    <q-input
      class="welcome-container-game-input"
      v-model="teamName" label="Player/Team Name"
      required
      error-message="Please enter a name"
      :error="cantSubmit" />
    <q-btn @click="submit">Join!</q-btn>
  </div>
</template>

<script>
import { teamsCollection, gamesCollection, FieldValue } from '@/db'

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
      teamsCollection.add({
        name: this.teamName,
        score: 0,
        answers: []
      }).then((docRef) => {
        this.$cookies.set('vue-trivia-team', { name: this.teamName, id: docRef.id, host: true })

        // console.log(docRef.id)
        gamesCollection.doc(this.gameId).update({
          teams: FieldValue.arrayUnion(teamsCollection.doc(docRef.id))

        }).then(() => {
          console.log('added to game')

          this.$emit('team-join', docRef.id)
        })
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
