<template>
  <div class="game-countdown">
    <CenterContainer maxWidth="550px">
      <q-circular-progress
        show-value
        :value="-secondsLeft"
        :min="-spinnerMax"
        :max="0"
        size="300px"
        :thickness="0.3"
        color="orange"
        track-color="grey-3"
      >
        <div class="game-countdown-inner">
          <div class="game-countdown-text">Game will start in</div>
          <div class="game-countdown-text">{{timeLeft}}</div>
        </div>
      </q-circular-progress>
    </CenterContainer>

  </div>
</template>

<script>
import { gamesCollection } from '@/db'
import CenterContainer from '@/components/CenterContainer'
import { gameWait } from '@/variables'

export default {
  name: 'GameCountdown',
  components: {
    CenterContainer
  },
  props: ['startTime', 'gameId'],
  data () {
    return {
      msLeft: this.startTime - new Date().getTime(),
      initialTime: this.startTime - gameWait,
      spinnerMax: gameWait / 1000
    }
  },
  created () {
    this.countDownTimer()
  },
  computed: {
    timeLeft () {
      const secondsLeft = this.msLeft / 1000
      console.log(secondsLeft)

      const minutes = Math.floor(secondsLeft / 60)
      const seconds = secondsLeft % 60

      if (minutes >= 1) {
        return `less than ${minutes + 1} minutes`
      } else {
        return `${seconds < 0 ? 0 : Math.floor(seconds)} second${seconds === 1 ? '' : 's'}`
      }
    },
    secondsLeft () {
      console.log(this.msLeft / 1000)

      return this.msLeft / 1000
    }
  },
  methods: {
    countDownTimer () {
      if (this.msLeft > 0) {
        setTimeout(() => {
          this.msLeft -= 1000
          this.countDownTimer()
        }, 1000)
      } else {
        gamesCollection.doc(this.gameId)
          .set({
            inProgress: true
          }, { merge: true })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  .game-countdown {

    &-inner {
      padding: 60px;
    }

    &-text {
      @include rem(font-size, 16px);

      @include from(5) {
        @include rem(font-size, 20px);
      }
    }
  }

  .q-circular-progress {
    @include to(4) {
      font-size: 220px !important;
    }
  }
</style>
