export default {
  methods: {
    getNotIntersectionArray: (_target_arr, _comparison_arr, _check_field = undefined) => {
      let target_arr = [].concat(_target_arr), comparison_arr = [].concat(_comparison_arr);
      if (_check_field !== undefined) {
        return target_arr.filter(ta => comparison_arr.every(ca => ca[_check_field] !== ta[_check_field]));
      } else {
        return target_arr.filter(ta => comparison_arr.every(ca => ca !== ta));
      }
    },
    getIntersectionArray: (_target_arr, _comparison_arr, _check_field = undefined) => {
      let target_arr = [].concat(_target_arr), comparison_arr = [].concat(_comparison_arr);
      if (_check_field !== undefined) {
        return target_arr.filter(ta => comparison_arr.some(ca => ca[_check_field] === ta[_check_field]));
      } else {
        return target_arr.filter(ta => comparison_arr.some(ca => ca === ta));
      }
    },
  }
}
