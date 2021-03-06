<template>
  <div class="questions">
    <transition-group name="slide-in">
      <div class="question-block" v-for="(question, index) in activeQuestions" :key="index + 1" :disabled="index + 1 !== currentQuestion" :ref="`question${index + 1}`">
        <div v-if="!showQuestion && index + 1 === currentQuestion" class="question-skeleton">
          <q-skeleton type="text" class="text-subtitle1" />
          <q-skeleton type="text" width="70%" class="text-subtitle1" />
          <div class="row items-center">
            <q-skeleton type="QRadio" class="skel-radio" />
            <q-skeleton type="text" width="100px" />
          </div>
          <div class="row items-center">
            <q-skeleton type="QRadio" class="skel-radio" />
            <q-skeleton type="text" width="100px" />
          </div>
          <div class="row items-center">
            <q-skeleton type="QRadio" class="skel-radio" />
            <q-skeleton type="text" width="100px" />
          </div>
          <div class="row items-center">
            <q-skeleton type="QRadio" class="skel-radio" />
            <q-skeleton type="text" width="100px" />
          </div>
        </div>

        <div v-else class="question-block-inner">
          <div class="question-block-top">
            <transition name="fade" mode="out-in">
              <q-circular-progress
                show-value
                :value="-countdown <= -10 ? -countdown : -10"
                :min="-spinnerMax"
                :max="-10"
                size="100px"
                :thickness="0.3"
                color="secondary"
                track-color="grey-3"
                v-if="index + 1 === currentQuestion"
              >
                {{countdownDisplay}}
              </q-circular-progress>

              <q-icon v-else :name="checkAnswer(question.correct_answer, index + 1)" />
            </transition>
          </div>

          <div class="question-block-bottom">
            <div class="question-block-text">
              <div class="question-block-number">{{ index + 1 }}.</div>
              <div class="question-block-question" v-html="question.question"></div>
            </div>
            <div class="column">
              <MultipleChoice
                v-if="question.type === 'multiple'"
                :question="question"
                :questionNum="index + 1"
                :teamRef="teamRef"
                :savedAnswer="getSavedAnswer(index + 1)"
              />

              <Boolean
                v-if="question.type === 'boolean'"
                :questionNum="index + 1"
                :teamRef="teamRef"
                :savedAnswer="getSavedAnswer(index + 1)"
              />
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { gamesCollection } from '@/db'
import { questionBuffer } from '@/variables'
import MultipleChoice from '@/components/MultipleChoice'
import Boolean from '@/components/Boolean'
import Worker from '@/workers/heartbeat.worker.js'

export default {
  name: 'Questions',
  components: {
    MultipleChoice,
    Boolean
  },
  props: ['gameId', 'questions', 'currentQuestion', 'teamRef', 'teamAnswers', 'questionTimer', 'questionEndTime', 'countdown', 'isHost'],
  data () {
    return {
      now: new Date().getTime(),
      spinnerMax: this.questionTimer
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
    activeQuestions () {
      return this.questions.slice(0, this.currentQuestion)
    },
    shownQuestions () {
      return this.activeQuestions.length
    },
    showQuestion () {
      return this.countdown < this.questionTimer
    },
    msLeft () {
      return this.questionEndTime - this.now
    },
    countdownDisplay () {
      const num = this.countdown / 1000
      return num <= 0 ? 0 : parseFloat(num.toFixed(0))
    }
  },
  watch: {
    currentQuestion (qNum) {
      this.calcScore()
      setTimeout(() => {
        this.$scrollTo(this.$refs[`question${qNum}`][0], 700, { offset: -20, easing: 'ease-in-out' })
      }, 1000)

      if (qNum > this.questions.length) {
        this.gameEnd = true
      }
    },
    msLeft (now) {
      if (this.currentQuestion > this.questions.length) {
        this.worker.terminate()
      } else if (now < 0) {
        const questionEndTime = this.now + questionBuffer + this.questionTimer
        gamesCollection.doc(this.gameId)
          .set({
            currentQuestion: this.currentQuestion + 1,
            questionEndTime
          }, { merge: true })
      } else {
        gamesCollection.doc(this.gameId)
          .set({
            countdown: now
          }, { merge: true })
      }
    }
  },
  methods: {
    getSavedAnswer (qNumber) {
      if (this.teamAnswers && this.teamAnswers[`question_${qNumber}`]) {
        return this.teamAnswers[`question_${qNumber}`]
      } else {
        return null
      }
    },
    checkAnswer (answer, qNumber) {
      const savedAnswer = this.getSavedAnswer(qNumber)
      if (answer === savedAnswer) {
        return 'fas fa-check-circle'
      } else {
        return 'fas fa-times-circle'
      }
    },
    calcScore () {
      // eslint-disable-next-line camelcase
      const scoreTotal = this.activeQuestions.reduce((score, { correct_answer }, index) => {
        // eslint-disable-next-line camelcase
        const points = correct_answer === this.teamAnswers[`question_${index + 1}`]
          ? 10
          : 0
        score += points
        return score
      }, 0)

      this.teamRef.update({ score: scoreTotal })
    }
  }
}
</script>

<style lang="scss">
  .question-block {
    margin-bottom: 30px;
    box-shadow: $shadow;
    padding: 20px 15px;

    &[disabled='disabled'] {
      pointer-events: none;
    }

    &-top {
      margin-bottom: 20px;

      .fas {
        @include rem(font-size, 70px);

        &.fa-check-circle {
          color: #32a85a;
        }

        &.fa-times-circle {
          color: #d13232;
        }
      }
    }

    &-text {
      /* display: flex; */
      border-bottom: 1px solid primary-color(gray, tint2);
      padding-bottom: 5px;
      margin-bottom: 5px;
    }

    &-number {
      display: inline;
      margin-right: 5px;
      font-family: $header-font;
      @include rem(font-size, 20px);
      color: primary-color(blue);
    }

    &-question {
      display: inline;
      @include font-weight(bold);
      @include rem(font-size, 18px);
    }

    &-bottom {

      .multiple-choice {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .slide-in-enter-active, .slide-in-leave-active {
    transition: all 1s;
  }

  .slide-in-enter, .slide-in-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(200px);
  }

</style>
