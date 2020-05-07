<template>
  <div class="multiple-choice">
    <q-radio
      v-for="option in question.answers"
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
  mounted () {
    if (this.savedAnswer) {
      this.answer = this.savedAnswer
    }
  },
  methods: {
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
