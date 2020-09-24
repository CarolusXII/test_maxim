export default {
  namespaced: true,
  state: {
    JSON_data: [
      // {
      //   "code": "field1",
      //   "caption": "поле 1",
      //   "type": "number"
      // },
      // {
      //   "code": "field2",
      //   "caption": "поле 3",
      //   "type": "string"
      // },
      // {
      //   "code": "field4",
      //   "caption": "поле 4",
      //   "type": "bool"
      // }
    ],
    types_data: ['number', 'string', 'bool'],
    types_map: {
      number: ['gt', 'lt', 'gte', 'lte', 'eg', 'neq'],
      string: ['like', 'eq', 'neq'],
      bool: ['eq']
    }
  },
  mutations: {
    setJSONData: (state, json_data) => {
      state.JSON_data = json_data;
    }
  },
  actions: {
    addElementInJsonData: async ({commit, dispatch, getters}, element_data) => {
      let json_data = [].concat(getters.getJsonData);
      element_data['code'] = `field${await dispatch('getFreeIndex')}`;
      json_data.push(element_data);
      commit('setJSONData', json_data);
      dispatch('setDataInLS');
    },
    updateElementInJsonData: ({commit, dispatch, getters}, element_data) => {
      let json_data = [].concat(getters.getJsonData);
      let element = json_data.find(i => i.code === element_data.code);
      for (let key in element) {
        element[key] = element_data[key];
      }
      commit('setJSONData', json_data);
      dispatch('setDataInLS');
    },
    deleteElementFromJsonData: ({commit, dispatch, getters}, code) => {
      let json_data = [].concat(getters.getJsonData);
      json_data = json_data.filter(i => i.code !== code);
      commit('setJSONData', json_data);
      dispatch('setDataInLS');
    },
    getFreeIndex: ({getters}) => {
      return new Promise(resolve => {
        let index = 0;
        while (getters.getJsonData.some(i => i.code.replace('field', '') == index)) {
          index++;
        }
        resolve(index);
      })
    },
    getDataFromLS: ({commit}) => {
      let ls_data = localStorage.getItem('test_maxim_json_data');
      commit('setJSONData', ls_data ? JSON.parse(ls_data) : []);
    },
    setDataInLS({getters}) {
      localStorage.setItem('test_maxim_json_data', JSON.stringify(getters.getJsonData));
    }
  },
  getters: {
    getJsonData: (state) => {
      return state.JSON_data;
    },
    getTypesData: (state) => {
      return state.types_data;
    }
  }
}
