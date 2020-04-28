<template>
  <div class="questions">
    <div class="question-block" v-for="(question, index) in questions" :key="index + 1">
      <div class="question-text" v-html="question.question"></div>
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
</template>

<script>
import MultipleChoice from '@/components/MultipleChoice'
import Boolean from '@/components/Boolean'

export default {
  name: 'Questions',
  components: {
    MultipleChoice,
    Boolean
  },
  props: ['questions', 'currentQuestion', 'teamRef', 'teamAnswers'],
  methods: {
    getSavedAnswer (qNumber) {
      if (this.teamAnswers && this.teamAnswers[`question_${qNumber}`]) {
        return this.teamAnswers[`question_${qNumber}`]
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss">

</style>
