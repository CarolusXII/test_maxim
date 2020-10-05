import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import constructor from "./constructor";

export default new Vuex.Store({
  devtools: false,
  getters: {
    getNotIntersectionArray: state => (_target_arr = [], _comparison_arr = [], _check_field = undefined) => {
      let target_arr = [].concat(_target_arr), comparison_arr = [].concat(_comparison_arr);
      if (_check_field !== undefined) {
        return target_arr.filter(ta => comparison_arr.every(ca => ca[_check_field] !== ta[_check_field]));
      } else {
        return target_arr.filter(ta => comparison_arr.every(ca => ca !== ta));
      }
    },
    getIntersectionArray: state => (_target_arr = [], _comparison_arr = [], _check_field = undefined) => {
      let target_arr = [].concat(_target_arr), comparison_arr = [].concat(_comparison_arr);
      if (_check_field !== undefined) {
        return target_arr.filter(ta => comparison_arr.some(ca => ca[_check_field] === ta[_check_field]));
      } else {
        return target_arr.filter(ta => comparison_arr.some(ca => ca === ta));
      }
    }
  },
  modules: {
    constructor
  }
})
