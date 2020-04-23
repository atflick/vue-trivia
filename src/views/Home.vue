<template>
  <div class="home">
    <div class="welcome-container">
        <h1 class="welcome-container-title">Welcome to Trivia</h1>
      <div class="welcome-container-new">
        <q-input
          class="welcome-container-game-input"
          v-model="gameName" label="Game Name"
          required
          error-message="Please enter a game name"
          :error="cantSubmit" />
        <q-btn @click="submit">Start new game</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { gamesCollection } from '@/db'

export default {
  name: 'Home',
  components: {

  },
  data () {
    return {
      gameName: '',
      games: [],
      cantSubmit: false
    }
  },
  mounted () {
    // console.log(this)
  },
  methods: {

    submit () {
      if (!this.gameName.length) {
        this.cantSubmit = true
      } else {
        this.createGame()
      }
    },
    createGame () {
      gamesCollection.add({
        name: this.gameName,
        inProgress: false,
        complete: false
      })
        .then((docRef) => {
          this.$router.push({ name: 'game', params: { id: docRef.id, host: true } })
        })
        .catch((error) => {
          console.error('Error adding document: ', error)
        })
      this.gameName = ''
    }
  }
}
</script>

<style lang="scss">
  .home {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .welcome-container {
    max-width: 600px;
    padding: 25px;
    margin: 0 auto 20vh;
    text-align: center;
    box-shadow: 0 2px 15px rgba(#000, .2);

    @include from(7) {
      padding: 50px;
    }

    &-title {
      @include rem(font-size, 60px);
      color: primary-color(blue);
      font-family: $header-font;
    }

    &-game-input {
      margin-bottom: 25px;
    }
  }
</style>
