<template>
  <div class="game-countdown">
    <CenterContainer>
      <div>Game will start in</div>
      <div>{{timeLeft}}</div>
      <div>seconds</div>
    </CenterContainer>

  </div>
</template>

<script>
import CenterContainer from '@/components/CenterContainer'

export default {
  name: 'GameCountdown',
  components: {
    CenterContainer
  },
  props: ['countDown'],
  data () {
    return {
      timeLeft: this.countDown
    }
  },
  created () {
    this.countDownTimer()
  },
  methods: {
    countDownTimer () {
      console.log(this.timeLeft)
      if (this.timeLeft > 0) {
        setTimeout(() => {
          this.timeLeft -= 1
          this.countDownTimer()
        }, 1000)
      }
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
