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
                :value="-msLeft <= -10 ? -msLeft : -10"
                :min="-spinnerMax"
                :max="-10"
                size="100px"
                :thickness="0.3"
                color="orange"
                track-color="grey-3"
                v-if="index + 1 === currentQuestion"
              >
                {{msLeftDisplay}}
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

export default {
  name: 'Questions',
  components: {
    MultipleChoice,
    Boolean
  },
  props: ['gameId', 'questions', 'currentQuestion', 'teamRef', 'teamAnswers', 'timerEndTime', 'questionTimer'],
  data () {
    return {
      msLeft: this.timerEndTime - new Date().getTime(),
      spinnerMax: questionBuffer + this.questionTimer
    }
  },
  created () {
    this.countDownTimer()
  },
  computed: {
    activeQuestions () {
      return this.questions.slice(0, this.currentQuestion)
    },
    shownQuestions () {
      return this.activeQuestions.length
    },
    showQuestion () {
      return this.msLeft < this.questionTimer
    },
    msLeftDisplay () {
      const num = this.msLeft / 1000
      return num <= 0 ? 0 : parseFloat(num.toFixed(0))
    }
  },
  watch: {
    currentQuestion (qNum) {
      this.msLeft = this.timerEndTime - new Date().getTime()
      this.countDownTimer()
      setTimeout(() => {
        this.$scrollTo(this.$refs[`question${qNum}`][0], 1500, { offset: -20, easing: 'ease-in-out' })
      }, 20)
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
    countDownTimer () {
      if (this.msLeft > 0) {
        setTimeout(() => {
          this.msLeft -= 50
          this.countDownTimer()
        }, 50)
      } else if (this.currentQuestion >= this.questions.length) {
        this.gameEnd = true
      } else {
        this.calcScore()

        gamesCollection.doc(this.gameId)
          .set({
            currentQuestion: this.currentQuestion + 1
          }, { merge: true })
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
