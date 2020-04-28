<template>
  <div class="game-settings">
    <h3>Game Setup</h3>
    <div class="game-settings-inner">
      <div class="game-settings-field">
        <label>Number of Questions: {{questions}}</label>
        <q-slider
          v-model="questions"
          :min="10"
          :max="50"
          :step="5"
          snap
          color="primary"
          @change="updateSettings"
        />
      </div>

      <div class="game-settings-field -extra-space">
        <label>Category</label>
        <q-select v-model="category" :options="categoryOptions" @input="updateSettings" />
      </div>

      <div class="game-settings-field -extra-space">
        <label>Difficulty</label>
        <q-select v-model="difficulty" :options="difficultyOptions" @input="updateSettings" />
      </div>

      <div class="game-settings-field">
        <label>Question Timer: {{timer}} seconds</label>
        <q-slider
          v-model="timer"
          :min="30"
          :max="300"
          :step="15"
          snap
          color="primary"
          @change="updateSettings"
        />
      </div>

      <q-btn @click="start">Start game</q-btn>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { gamesCollection } from '@/db'
import axios from 'axios'
import { gameWait } from '@/variables'

export default {
  name: 'GameSettings',
  props: ['game'],
  data () {
    return {
      questions: this.getQuestions(),
      category: this.getCategory(),
      difficulty: this.getDifficulty(),
      timer: this.getTimer(),
      categoryOptions: [
        {
          label: 'All Categories',
          value: 'all'
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
      ],
      difficultyOptions: ['Easy', 'Medium', 'Hard']
    }
  },
  methods: {
    updateSettings: debounce(function () {
      const settings = {
        questions: this.questions,
        category: this.category,
        difficulty: this.difficulty,
        timer: this.timer
      }
      const gameId = this.game.id
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
          value: 'all'
        }
      }
    },
    getDifficulty () {
      if (this.game.settings && this.game.settings.difficulty) {
        return this.game.settings.difficulty
      } else {
        return 'Any Difficulty'
      }
    },
    getTimer () {
      if (this.game.settings && this.game.settings.timer) {
        return this.game.settings.timer
      } else {
        return 30
      }
    },
    start () {
      let url = 'https://opentdb.com/api.php?'
      url += `amount=${this.questions}`

      if (this.category.value !== 'all') {
        url += `&category=${this.category.value}`
      }

      if (this.difficulty !== 'Any Difficulty') {
        url += `&difficulty=${this.difficulty.toLowerCase()}`
      }

      axios.get(url).then(({ data }) => {
        const t = new Date()
        const utc = t.getTime() + gameWait

        gamesCollection.doc(this.game.id)
          .set({
            questions: data.results,
            startTime: utc
          }, { merge: true })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  .game-settings {

    &-inner {
      text-align: left;
    }

    &-field {
      margin-bottom: 20px;

      &.-extra-space {
        margin-bottom: 35px;
      }
    }

    label {
      margin-bottom: 5px;
    }
  }

</style>
