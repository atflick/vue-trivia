<template>
  <div class="boolean">
    <q-radio v-model="answer" val="True" label="True" @input="updateAnswer" />
    <q-radio v-model="answer" val="False" label="False" @input="updateAnswer" />
  </div>
</template>

<script>
import { debounce } from '@/utils'

export default {
  name: 'Boolean',
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
  methods: {
    updateAnswer: debounce(function (value) {
      const answers = {}
      answers[`question_${this.questionNum}`] = value
      this.teamRef.set({ answers }, { merge: true })
    }, 1000)
  }
}
</script>

<style lang="scss">

</style>
