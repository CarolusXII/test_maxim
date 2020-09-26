<template>
  <v-card class="element-picker">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
          <template v-if="items.length">
            <v-row align="center"
              v-ripple
              class="element-picker__item"
              :class="{ 'element-picker__item--selected' : selected_items.find(i => i[item_value] === item[item_value]) }"
              v-for="(item, index) in items"
              :key="index"
              @click="toggleItem(item)"
            >
              <span>{{ item[item_text] }}</span>
              <v-spacer></v-spacer>
              <slot name="info" :item="item"></slot>
              <slot name="action" :item="item"></slot>
            </v-row>
          </template>
          <template v-else>
            <span class="error--text">Нет данных</span>
          </template>
    </v-card-text>
  </v-card>
</template>

<script>
    import sup_func from "../additional/sup_func";

    export default {
        mixins: [sup_func],
        model: {
            prop: 'selected_items_init',
            event: 'change-selected-items'
        },
        props: {
            items: {
                type: Array,
                default: () => []
            },
            selected_items_init: {
                type: Array,
                default: () => []
            },
            item_value: {
                type: String,
                default: () => 'id'
            },
            item_text: {
                type: String,
                default: () => 'text'
            },
            title: {
                type: [String, Number],
                default: () => ''
            }
        },
        data() {
            return {
                selected_items: this.selected_items_init
            }
        },
        watch: {
            items(val, old_val) {
                let flag = false;
                let _val = [].concat(val.map(i => i[this.item_value]).sort((a, b) => a < b ? -1 : 1));
                let _old_val = [].concat(old_val.map(i => i[this.item_value]).sort((a, b) => a < b ? -1 : 1));
                if (_val.length !== _old_val.length) flag = true;
                if (!flag) {
                    for (let i in _val) {
                        if (_val[i] !== _old_val[i]) flag = true;
                        break;
                    }
                }
                if (flag) {
                    this.selected_items = this.$sup_func.getIntersectionArray(this.selected_items, val, this.item_value);
                }
            },
            selected_items(val) {
                this.$emit('change-selected-items', val);
            }
        },
        methods: {
            async toggleItem(item_data) {
                if (this.selected_items.find(i => i[this.item_value] === item_data[this.item_value])) {
                    this.selected_items = this.selected_items.filter(i => i[this.item_value] !== item_data[this.item_value]);
                } else {
                    this.selected_items.push(item_data);
                }
            }
        }
    }
</script>

<style lang="scss">
  .element-picker {
    .element-picker__item {
      padding: 4px 8px;
      cursor: pointer;
      height: 40px;

      &.element-picker__item--selected {
        background-color: #ebebeb;
      }

      span {
        user-select: none;
        font-size: 18px;
      }
    }
  }
</style>
