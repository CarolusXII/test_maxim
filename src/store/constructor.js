import $sup_func from '../additional/sup_func'

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
    types_map: {
      number: {
        name: 'Число',
        condition: ['gt', 'lt', 'gte', 'lte', 'eg', 'neq']
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
    updateSelectedItem: ({commit, dispatch, getters}, _selected_item) => {
      commit('updateSelectedItem', _selected_item);
      let selected_items = getters['getSelectedItems'];
      dispatch('setSelectedItemsInLS', selected_items);
    },
    addSelectedItems: ({commit, dispatch, getters}, _active_items) => {
      let active_items = JSON.parse(JSON.stringify(_active_items));
      active_items = active_items.map(ai => {
        ai['value'] = {};
        return ai;
      })
      let selected_items = getters['getSelectedItems'];
      commit('setSelectedItems', selected_items.concat(active_items));
      dispatch('setSelectedItemsInLS', selected_items.concat(active_items));
    },
    cutSelectedItems: ({commit, dispatch, getters}, _deactive_items) => {
      let selected_items = getters['getSelectedItems'];
      let new_selected_items_val = $sup_func.getNotIntersectionArray(selected_items, _deactive_items, 'code')
      commit('setSelectedItems', new_selected_items_val);
      dispatch('setSelectedItemsInLS', new_selected_items_val);
    },
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
    setDataInLS: ({getters}) => {
      localStorage.setItem('test_maxim_json_data', JSON.stringify(getters.getJsonData));
    },
    getSelectedItemsFromLS: ({commit}) => {
      let ls_data = localStorage.getItem('test_main_selected_items');
      commit('setSelectedItems', ls_data ? JSON.parse(ls_data) : []);
    },
    setSelectedItemsInLS: ({getters}) => {
      localStorage.setItem('test_main_selected_items', JSON.stringify(getters.getSelectedItems));
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
    }
  }
}
