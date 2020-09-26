import Vue from 'vue'
import store from './store/main'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import SupFunc from "./additional/sup_func";

Vue.prototype.$sup_func = SupFunc;

new Vue({
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
