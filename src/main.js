import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import filter from './plugins/Filter'
import './plugins/components'
Vue.config.productionTip = false

new Vue({
  filter,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
