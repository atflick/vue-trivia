<template>
  <div class="game-settings">
    <h3>Game Setup</h3>
    <div class="game-settings-inner">
      <label for="">Number of Questions: {{questions}}</label>
      <q-slider
        v-model="questions"
        :min="10"
        :max="50"
        :step="5"
        snap
        color="primary"
        @change="updateSettings"
      />

      <q-select v-model="category" :options="categoryOptions" label="Category" @input="updateSettings" />
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { gamesCollection } from '@/db'
export default {
  name: 'GameSettings',
  props: ['game'],
  data () {
    return {
      questions: this.getQuestions(),
      category: this.getCategory(),
      categoryOptions: [
        {
          label: 'All Categories',
          value: ''
        },
        {
          label: 'General Knowledge',
          value: '9'
        },
        {
          label: 'Books',
          value: '10'
        },
        {
          label: 'Film',
          value: '11'
        },
        {
          label: 'Music',
          value: '12'
        },
        {
          label: 'Television',
          value: '14'
        },
        {
          label: 'Video Games',
          value: '15'
        },
        {
          label: 'Nature',
          value: '17'
        },
        {
          label: 'Computers',
          value: '18'
        },
        {
          label: 'Mathematics',
          value: '19'
        },
        {
          label: 'Mythology',
          value: '20'
        },
        {
          label: 'Sports',
          value: '21'
        },
        {
          label: 'Geography',
          value: '22'
        },
        {
          label: 'History',
          value: '23'
        },
        {
          label: 'Politics',
          value: '24'
        },
        {
          label: 'Art',
          value: '25'
        },
        {
          label: 'Celebrities',
          value: '26'
        },
        {
          label: 'Animals',
          value: '27'
        },
        {
          label: 'Vehicles',
          value: '28'
        }
      ]
    }
  },
  methods: {
    updateSettings: debounce(function () {
      console.log(this.questions, this.category)
      const settings = {
        questions: this.questions,
        category: this.category.label
      }
      const gameId = this.game.id
      console.log(gameId)
      gamesCollection.doc(gameId)
        .set({ settings }, { merge: true })
    }, 100, true),
    getQuestions () {
      if (this.game.settings && this.game.settings.questions) {
        return this.game.settings.questions
      } else {
        return 10
      }
    },
    getCategory () {
      if (this.game.settings && this.game.settings.category) {
        return this.game.settings.category
      } else {
        return {
          label: 'All Categories',
          value: ''
        }
      }
    }
  }

}
</script>

<style lang="scss">
  .game-settings {

    &-inner {
      text-align: left;
    }

    label {
      margin-bottom: 5px;
    }
  }

</style>
