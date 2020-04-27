<template>
  <div class="multiple-choice">
    <q-radio
      v-for="option in options"
      :key="option"
      v-model="answer"
      :val="option"
      :label="decodeHtml(option)"
      @input="updateAnswer"
    />
  </div>
</template>

<script>
import { debounce } from '@/utils'

export default {
  name: 'MultipleChoice',
  props: ['question', 'questionNum', 'teamRef', 'savedAnswer'],
  data () {
    return {
      answer: null
    }
  },
  watch: {
    savedAnswer () {
      this.answer = this.savedAnswer
    }
  },
  computed: {
    options () {
      const answers = this.question.incorrect_answers
      answers.push(this.question.correct_answer)
      return this.shuffle(answers)
    }
  },
  methods: {
    shuffle (array) {
      return array.sort(() => Math.random() - 0.5)
    },
    updateAnswer: debounce(function (value) {
      const answers = {}
      answers[`question_${this.questionNum}`] = value
      this.teamRef.set({ answers }, { merge: true })
    }, 1000),
    decodeHtml (html) {
      const txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    }
  }

}
</script>

<style lang="scss">

</style>
