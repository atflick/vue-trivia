<template>
  <div class="game-countdown">
    <CenterContainer maxWidth="550px">
      <q-circular-progress
        show-value
        :value="-countdown <= -200 ? -countdown : -200"
        :min="-spinnerMax"
        :max="-200"
        size="300px"
        :thickness="0.3"
        color="secondary"
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
import { gameWait, questionBuffer } from '@/variables'
import Worker from '@/workers/heartbeat.worker.js'

export default {
  name: 'GameCountdown',
  components: {
    CenterContainer
  },
  props: ['startTime', 'gameId', 'questionTimer', 'countdown', 'isHost'],
  data () {
    return {
      now: new Date().getTime(),
      initialTime: this.startTime - gameWait,
      spinnerMax: gameWait
    }
  },
  created () {
    if (this.isHost) {
      this.worker = new Worker()
      this.worker.onmessage = () => {
        this.now = new Date().getTime()
      }
    }
  },
  computed: {
    msLeft () {
      return this.startTime - this.now
    },
    secondsLeft () {
      const seconds = this.countdown / 1000
      return seconds <= 0 ? 0 : seconds
    },
    timeLeft () {
      const minutes = Math.floor(this.secondsLeft / 60)
      const seconds = this.secondsLeft % 60

      if (minutes >= 1) {
        return `less than ${minutes + 1} minutes`
      } else {
        return `${seconds < 0 ? 0 : Math.floor(seconds)} second${seconds === 1 ? '' : 's'}`
      }
    }
  },
  watch: {
    msLeft (now) {
      if (this.msLeft > 0) {
        gamesCollection.doc(this.gameId)
          .set({
            countdown: this.msLeft
          }, { merge: true })
      } else {
        const questionEndTime = this.now + questionBuffer + this.questionTimer
        this.worker.terminate()
        gamesCollection.doc(this.gameId)
          .set({
            questionEndTime,
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
