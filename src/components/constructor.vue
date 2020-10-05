<template>
  <v-col cols="12" sm="12" md="10" lg="8" v-resize="resize">
    <v-dialog
      v-model="modal_edit_json_data.modal"
      max-width="800"
      persistent
    >
      <v-card>
        <v-card-title>Редактирование JSON-данных</v-card-title>
        <v-card-text>
          <v-row class="justify-end">
            <v-col class="fix-flex">
              <v-btn
                @click="showModalEditJsonElement()"
              >Добавить элемент в массив
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-data-table
                class="table--fix-icons"
                :items="JSON_data"
                :headers="modal_edit_json_data.headers_table"
                hide-default-footer
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    @click="deleteJsonElement(item)"
                  >delete
                  </v-icon>
                  <v-icon
                    small
                    @click="showModalEditJsonElement(item)"
                  >edit
                  </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col class="fix-flex">
              <v-btn
                @click="modal_edit_json_data.modal = false"
              >
                <v-icon>clear</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="edit_json_data_element.modal"
      persistent
      max-width="400"
    >
      <v-card>
        <v-card-title>
          {{ edit_json_data_element.title }}
        </v-card-title>
        <v-card-text>
          <v-form
            v-model="edit_json_data_element.form"
            ref="form_edit_json_data_element"
          >
            <v-col class="xs12">
              <v-row v-if="edit_json_data_element.data.code !== undefined">
                <v-text-field
                  label="Код поля"
                  v-model="edit_json_data_element.data.code"
                  readonly
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  label="Название поля"
                  v-model="edit_json_data_element.data.caption"
                  :rules="[rules.required_field]"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-select
                  label="Тип данных"
                  :items="$store.getters['constructor/getTypesData']"
                  v-model="edit_json_data_element.data.type"
                  :rules="[rules.required_field]"
                ></v-select>
              </v-row>
              <v-row>
                <v-spacer></v-spacer>
                <v-col class="fix-flex">
                  <v-btn
                    @click="closeModalEditJsonElement"
                  >
                    <v-icon>clear</v-icon>
                  </v-btn>
                </v-col>
                <v-col class="fix-flex">
                  <v-btn
                    @click="saveEditJsonElement"
                  >
                    <v-icon>done</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="edit_settings.modal"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title>
          <v-col class="xs12">
            <v-row>Настройка условий для поля:</v-row>
            <v-row>
              <h3>{{ `${edit_settings.data.caption} (${edit_settings.data.code})` }}</h3>
            </v-row>
            <v-row>Тип данных: {{ edit_settings.condition_data.name }}</v-row>
          </v-col>
        </v-card-title>
        <v-card-text>
          <v-col class="12">
            <v-row>
              <v-select
                label="Условия"
                :items="filtered_condition"
                :value="edit_settings.data.condition ? Object.keys(edit_settings.data.condition) : []"
                @change="v => selectCondition(v)"
                multiple
              ></v-select>
            </v-row>
            <v-row v-for="(condition, key) in edit_settings.data.condition" :key="key">
              <v-text-field
                v-if="edit_settings.data.type === 'number' || edit_settings.data.type === 'string'"
                :label="key"
                v-model="edit_settings.data.condition[key]"
                :type="edit_settings.data.type === 'number' ? 'number' : 'text'"
              ></v-text-field>
              <v-checkbox
                v-else
                :label="key"
                on-icon="done"
                off-icon=""
                mandatory
                v-model="edit_settings.data.condition[key]"
              ></v-checkbox>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-col class="fix-flex">
                <v-btn
                  @click="closeModalEditSettings"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-col>
              <v-col class="fix-flex">
                <v-btn
                  @click="saveSettings"
                >
                  <v-icon>done</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar.model"
      :color="snackbar.success ? 'green' : 'red'"
    >
      <template v-if="snackbar.success">Введенные данные успешно прошли валидацию</template>
      <template v-else>Введенные данные не прошли валидацию</template>
    </v-snackbar>
    <v-row>
      <v-spacer></v-spacer>
      <v-col class="fix-flex">
        <v-btn
          @click="modal_edit_json_data.modal = true"
        >Изменение массива данных конструктора
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="12" sm="5">
        <element-picker
          title="Все фильтры"
          :items="$store.getters.getNotIntersectionArray(JSON_data, selected_items, 'code')"
          v-model="elements_selector.active_items"
          item_value="code"
          item_text="caption"
        ></element-picker>
      </v-col>
      <v-col class="fix-flex">
        <v-row class="buttons-action-wrapper">
          <v-col class="fix-flex">
            <v-btn
              @click="$store.dispatch('constructor/addSelectedItems', elements_selector.active_items)"
            >
              <v-icon>
                <template v-if="!mobile">keyboard_arrow_right</template>
                <template v-else>keyboard_arrow_down</template>
              </v-icon>
            </v-btn>
          </v-col>
          <v-col class="fix-flex">
            <v-btn
              @click="$store.dispatch('constructor/cutSelectedItems', elements_selector.deactive_items)"
            >
              <v-icon>
                <template v-if="!mobile">keyboard_arrow_left</template>
                <template v-else>keyboard_arrow_up</template>
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="5">
        <element-picker
          title="Выбранные фильтры"
          :items="$store.getters.getIntersectionArray(JSON_data, selected_items, 'code')"
          v-model="elements_selector.deactive_items"
          item_value="code"
          item_text="caption"
        >
          <template v-slot:info="props">
            <v-tooltip bottom v-if="Object.keys($store.getters['constructor/getConditionSelectedItem'](props.item.code)).length">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  class="error--text"
                >error_outline</v-icon>
              </template>
              <span>У данного элемента уже заданы какие-то условия</span>
            </v-tooltip>
          </template>
          <template v-slot:action="props">
            <v-btn
              class="ml-1"
              fab
              x-small
              @click.stop="showModalEditSettings(props.item)"
            >
              <v-icon>settings</v-icon>
            </v-btn>
          </template>
        </element-picker>
      </v-col>
    </v-row>

    <user-form
      v-model="selected_items"
    ></user-form>

    <request-data
      class="mt-3"
      :request_data="$store.getters['constructor/getRequestData']"
    ></request-data>

  </v-col>
</template>

<script>
    import ElementPicker from './element_picker.vue'
    import UserForm from './user_form.vue'
    import RequestData from './request_data.vue'

    export default {
        name: 'Constructor',
        components: {
            ElementPicker,
            UserForm,
            RequestData
        },
        data() {
            return {
                elements_selector: {
                    active_items: [],
                    deactive_items: [],
                },
                modal_edit_json_data: {
                    modal: false,
                    headers_table: [
                        {text: 'Код поля', value: 'code', sortable: false},
                        {text: 'Название поля', value: 'caption', sortable: false},
                        {text: 'Тип данных в поле', value: 'type', sortable: false},
                        {text: '', value: 'actions', align: 'end', sortable: false},
                    ]
                },
                rules: {
                    required_field: v => !!v || ''
                },
                edit_settings: {
                    modal: false,
                    data: {},
                    condition_data: {}
                },
                edit_json_data_element: {
                    modal: false,
                    title: undefined,
                    form: true,
                    data: {
                        code: undefined,
                        caption: undefined,
                        type: undefined
                    }
                },
                edit_json_data_element_data_empty: {
                    code: undefined,
                    caption: undefined,
                    type: undefined
                },
                show_form_modal: false,
                snackbar: {
                    model: false,
                    success: false
                },
                mobile: false
            }
        },
        computed: {
            filtered_condition() {
                if (this.edit_settings.data.condition && !Object.keys(this.edit_settings.data.condition).length) {
                    return this.edit_settings.condition_data.condition;
                } else {
                    return this.edit_settings.condition_data.condition;
                }
            },
            JSON_data() {
                return this.$store.getters['constructor/getJsonData'];
            },
            selected_items() {
                return this.$store.getters['constructor/getSelectedItems'];
            }
        },
        watch: {
            JSON_data(val) {
                localStorage.setItem('test_maxim_json_data', JSON.stringify(val));
            },
            selected_items: {
                handler(val) {
                    localStorage.setItem('test_main_selected_items', JSON.stringify(val));
                },
                deep: true
            }
        },
        methods: {
            init() {
                this.$store.dispatch('constructor/getDataFromLS');
                this.$store.dispatch('constructor/getSelectedItemsFromLS');
            },
            showModalEditJsonElement(_data = undefined) {
                if (_data) {
                    this.edit_json_data_element.title = 'Изменение данных JSON-элемента';
                    this.edit_json_data_element.data = Object.assign({}, _data);
                } else {
                    this.edit_json_data_element.title = 'Создание JSON-элемента';
                }
                this.edit_json_data_element.modal = true;
            },
            closeModalEditJsonElement() {
                this.edit_json_data_element.modal = false;
                setTimeout(() => {
                    this.edit_json_data_element.data = Object.assign({}, this.edit_json_data_element_data_empty);
                    this.edit_json_data_element.title = undefined;
                    this.$refs.form_edit_json_data_element.resetValidation();
                }, 300)
            },
            saveEditJsonElement() {
                if (this.$refs.form_edit_json_data_element.validate()) {
                    let element_data = Object.assign({}, this.edit_json_data_element.data);
                    if (element_data.code === undefined) {
                        delete element_data.code;
                        this.$store.dispatch('constructor/addElementInJsonData', element_data);
                    } else {
                        this.$store.dispatch('constructor/updateElementInJsonData', element_data);
                    }
                    this.closeModalEditJsonElement();
                }
            },
            deleteJsonElement(element_data) {
                let _selected_element = this.$store.getters['constructor/getSelectedItem'](element_data.code);
                if (confirm(`Удалить поле "${element_data.caption}"? ${_selected_element ? 'Поле уже выбрано -> его удаление приведет к его убиранию из выбранных' : ''}`)) {
                    this.$store.dispatch('constructor/deleteElementFromJsonData', element_data.code);
                    this.$store.dispatch('constructor/cutSelectedItems', [element_data]);
                }
            },
            showModalEditSettings(_item_data) {
                this.edit_settings.data = JSON.parse(JSON.stringify(this.$store.getters['constructor/getSelectedItem'](_item_data.code)));
                this.edit_settings.condition_data = this.$store.getters['constructor/getConditionData'](_item_data.type);
                this.edit_settings.modal = true;
            },
            selectCondition(v) {
                let not_intersection = this.$store.getters.getNotIntersectionArray(v, Object.keys(this.edit_settings.data.condition));
                for (let key in this.edit_settings.data.condition) {
                    if (!v.includes(key)) this.$delete(this.edit_settings.data.condition, key);
                }
                not_intersection.forEach(ni => this.$set(this.edit_settings.data.condition, ni, ''));
            },
            saveSettings() {
                if (this.edit_settings.data.type === 'number') {
                    for (let key in this.edit_settings.data.condition) {
                        this.edit_settings.data.condition[key] = Number(this.edit_settings.data.condition[key]);
                    }
                } else {
                    if (this.edit_settings.data.condition['eq'] === '') this.edit_settings.data.condition['eq'] = false;
                }
                this.$store.commit('constructor/updateSelectedItem', this.edit_settings.data);
                this.closeModalEditSettings();
            },
            closeModalEditSettings() {
                this.edit_settings.modal = false;
                setTimeout(() => {
                    this.edit_settings.data = {};
                    this.edit_settings.condition_data = {};
                }, 300)
            },
            resize() {
                this.mobile = window.innerWidth < 600;
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style lang="scss">
  .table--fix-icons tr td:last-child .v-icon {
    font-size: 20px !important;

    &:last-child {
      margin-left: 10px;
    }
  }
  form.v-form {
    width: 100%;
  }

  @media (max-width: 599px) {
    .buttons-action-wrapper {
      flex-wrap: nowrap!important;
    }
  }
</style>
