import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './quasar'
import './styles/main.scss'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
