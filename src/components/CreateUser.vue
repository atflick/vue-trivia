<template>
  <div class="create-user">
    <h2 class="create-user-title">Join the Game</h2>
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
import { teamsCollection } from '@/firebase'

export default {
  name: 'CreateUser',
  props: ['user', 'gameRef'],
  data () {
    return {
      teamName: this.user !== null ? this.user : '',
      cantSubmit: false
    }
  },
  methods: {
    submit () {
      !this.teamName.length ? this.cantSubmit = true : this.addUser()
    },
    addUser () {
      this.$cookies.set('vue-trivia-user', this.teamName)
      teamsCollection.add({
        name: this.teamName,
        score: 0,
        answers: []
      })
      // .then((docRef) => {
      //   this.gameRef.update({
      //     teams: db.
      //   })
      // })
    }
  }

}
</script>

<style lang="scss">
  .create-user {
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
