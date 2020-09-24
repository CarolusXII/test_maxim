import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import constructor from "./constructor";

export default new Vuex.Store({
  devtools: false,
  modules: {
    constructor
  }
})
