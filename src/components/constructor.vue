<template>
  <v-col class="xs12">

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
                @click="showModalEditJsonElement"
              >Добавить элемент в массив
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-data-table
                class="table--fix-icons"
                :items="$store.getters['constructor/getJsonData']"
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
                  :readonly="edit_json_data_element.data.code !== undefined"
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
            </v-row>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>


    <v-row>
      <v-spacer></v-spacer>
      <v-col class="fix-flex">
        <v-btn
          @click="modal_edit_json_data.modal = true"
        >Изменение массива данных конструктора
        </v-btn>
      </v-col>
    </v-row>


    <v-row>
      <v-col class="xs5">
        <element-picker
          title="Все фильтры"
          :items="getNotIntersectionArray($store.getters['constructor/getJsonData'], elements_selector.selected_items, 'code')"
          v-model="elements_selector.active_items"
          item_value="code"
          item_text="caption"
        ></element-picker>
      </v-col>


      <v-col class="fix-flex">
        <v-row>
          <v-col class="fix-flex">
            <v-btn
              @click="elements_selector.selected_items = elements_selector.selected_items.concat(elements_selector.active_items)"
            >
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-col>
          <v-col class="fix-flex">
            <v-btn
              @click="elements_selector.selected_items = getNotIntersectionArray(elements_selector.selected_items, elements_selector.deactive_items, 'code')"
            >
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="xs5">
        <element-picker
          title="Выбранные фильтры"
          :items="getIntersectionArray($store.getters['constructor/getJsonData'], elements_selector.selected_items, 'code')"
          v-model="elements_selector.deactive_items"
          item_value="code"
          item_text="caption"
        >
          <template v-slot:action="props">
            <v-btn
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

  </v-col>
</template>

<script>
    import sup_func from "../mixins/sup_func";
    import ElementPicker from './element_picker.vue'

    export default {
        name: 'Constructor',
        mixins: [sup_func],
        components: {
            ElementPicker
        },
        data() {
            return {
                elements_selector: {
                    active_items: [],
                    selected_items: [],
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
                }
            }
        },
        methods: {
            init() {
                this.$store.dispatch('constructor/getDataFromLS');
            },
            showModalEditJsonElement(_data) {
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
                    //в случае с запросами к серверу тут должна быть обработка
                    this.closeModalEditJsonElement();
                }
            },
            deleteJsonElement(element_data) {
                if (confirm(`Удалить поле "${element_data.caption}"?`)) {
                    this.$store.dispatch('constructor/deleteElementFromJsonData', element_data.code);
                }
            },
            showModalEditSettings(_item_data) {
                this.edit_settings.data = Object.assign({}, _item_data);
                this.edit_settings.condition_data = this.$store.getters['constructor/getConditionData'](_item_data.type);
                this.edit_settings.modal = true;
            },
            closeModalEditSettings() {
                this.edit_settings.modal = false;
                setTimeout(() => {
                    this.edit_settings.data = {};
                    this.edit_settings.condition_data = {};
                }, 300)
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
</style>
