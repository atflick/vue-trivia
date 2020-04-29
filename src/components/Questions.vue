<template>
  <div class="questions">
    <div class="question-block" v-for="(question, index) in activeQuestions" :key="index + 1" :disabled="index + 1 !== currentQuestion">
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
        <div class="question-text" v-html="question.question"></div>
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
      </div>
    </div>
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
      return parseFloat(num.toFixed(2))
    }
  },
  watch: {
    currentQuestion () {
      this.msLeft = this.timerEndTime - new Date().getTime()
      this.countDownTimer()
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
    countDownTimer () {
      if (this.msLeft > 0) {
        setTimeout(() => {
          this.msLeft -= 50
          this.countDownTimer()
        }, 50)
      } else {
        gamesCollection.doc(this.gameId)
          .set({
            currentQuestion: this.currentQuestion + 1
          }, { merge: true })
      }
    }
  }
}
</script>

<style lang="scss">

</style>
