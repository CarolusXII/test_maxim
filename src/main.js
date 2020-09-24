import Vue from 'vue'
import store from './store/main'
import App from './App.vue'
import vuetify from './plugins/vuetify'

new Vue({
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
