import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './quasar'
import './styles/main.scss'
import VueCookies from 'vue-cookies'
import { firestorePlugin } from 'vuefire'
import { gamesCollection, teamsCollection } from 'firebase'

Vue.use(VueCookies)
Vue.use(firestorePlugin)
Vue.$cookies.config('60d')

Vue.config.productionTip = false

new Vue({
  data: {
    games: [],
    teams: []
  },
  firestore: {
    games: gamesCollection,
    teams: teamsCollection
  },
  router,
  render: h => h(App)
}).$mount('#app')
