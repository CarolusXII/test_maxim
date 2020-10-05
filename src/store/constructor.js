export default {
  namespaced: true,
  state: {
    JSON_data: [],
    types_map: {
      number: {
        name: 'Число',
        condition: ['gt', 'lt', 'gte', 'lte', 'eq', 'neq']
      },
      string: {
        name: 'Строка',
        condition: ['like', 'eq', 'neq']
      },
      bool: {
        name: 'Булево значение',
        condition: ['eq']
      }
    },
    selected_items: []
  },
  mutations: {
    setJSONData: (state, json_data) => {
      state.JSON_data = json_data;
    },
    setSelectedItems: (state, selected_items) => {
      state.selected_items = selected_items;
    },
    updateSelectedItem: (state, _selected_item) => {
      let selected_item = state.selected_items.find(si => si.code === _selected_item.code);
      for (let key in _selected_item) {
        selected_item[key] = _selected_item[key];
      }
    }
  },
  actions: {
    addSelectedItems: ({commit, dispatch, getters}, _active_items) => {
      let active_items = JSON.parse(JSON.stringify(_active_items));
      active_items = active_items.map(ai => {
        ai['value'] = undefined;
        ai['condition'] = {};
        return ai;
      })
      let selected_items = getters['getSelectedItems'];
      commit('setSelectedItems', selected_items.concat(active_items));
    },
    cutSelectedItems: ({commit, dispatch, getters, rootGetters}, _deactive_items) => {
      let selected_items = getters['getSelectedItems'];
      let new_selected_items_val = rootGetters.getNotIntersectionArray(selected_items, _deactive_items, 'code');
      commit('setSelectedItems', new_selected_items_val);
    },
    addElementInJsonData: async ({commit, dispatch, getters}, element_data) => {
      let json_data = [].concat(getters.getJsonData);
      element_data['code'] = `field${await dispatch('getFreeIndex')}`;
      json_data.push(element_data);
      commit('setJSONData', json_data);
    },
    updateElementInJsonData: ({commit, dispatch, getters}, element_data) => {
      let json_data = [].concat(getters.getJsonData);
      let element = json_data.find(i => i.code === element_data.code);
      for (let key in element) {
        element[key] = element_data[key];
      }
      commit('setJSONData', json_data);
      //возможно, то, что ниже, нужно реализовать ч/з watch
      let selected_item = Object.assign({}, getters.getSelectedItem(element.code));
      selected_item.caption = element.caption;
      selected_item.type = element.type;
      selected_item.value = undefined;
      selected_item.condition = {};
      commit('updateSelectedItem', selected_item);
    },
    deleteElementFromJsonData: ({commit, dispatch, getters}, code) => {
      let json_data = [].concat(getters.getJsonData);
      json_data = json_data.filter(i => i.code !== code);
      commit('setJSONData', json_data);
    },
    getFreeIndex: ({getters}) => {
      let index = 0;
      while (getters.getJsonData.some(i => i.code.replace('field', '') == index)) {
        index++;
      }
      return index;
    },
    getDataFromLS: ({commit}) => {
      let ls_data = localStorage.getItem('test_maxim_json_data');
      commit('setJSONData', ls_data ? JSON.parse(ls_data) : []);
    },
    getSelectedItemsFromLS: ({commit}) => {
      let ls_data = localStorage.getItem('test_main_selected_items');
      commit('setSelectedItems', ls_data ? JSON.parse(ls_data) : []);
    }
  },
  getters: {
    getJsonData: state => {
      return state.JSON_data;
    },
    getTypesData: state => {
      return Object.keys(state.types_map);
    },
    getConditionData: state => _id => {
      return state.types_map[_id] || {};
    },
    getSelectedItems: state => {
      return state.selected_items;
    },
    getSelectedItem: state => id => {
      return state.selected_items.find(si => si.code === id);
    },
    getConditionSelectedItem: state => id => {
      return state.selected_items.find(si => si.code === id).condition;
    },
    getRequestData: state => {
      return state.selected_items.map(si => {
        return {
          code_name: si.code,
          value: si.value
        }
      })
    }
  }
}
