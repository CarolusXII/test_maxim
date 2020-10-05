<template>
  <v-card>
    <v-col>
      <v-row>
        <v-col>Форма пользователя</v-col>
      </v-row>
      <v-row>
        <v-form ref="form_user_interface">
          <v-col class="xs12">
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="5"
                lg="4"
                xl="3"
                v-for="(field, index) in selected_items"
                :key="index"
              >
                <v-text-field
                  v-if="field.type === 'string' || field.type === 'number'"
                  v-model="field.value"
                  :label="field.caption"
                  :type="field.type"
                  :rules="getRules(field)"
                ></v-text-field>
                <v-checkbox
                  v-else
                  v-model="field.value"
                  :label="field.caption"
                  on-icon="done"
                  :rules="getRules(field)"
                ></v-checkbox>
              </v-col>
            </v-row>

          </v-col>
        </v-form>
      </v-row>
    </v-col>

  </v-card>
</template>

<script>
    export default {
        model: {
            prop: 'selected_items'
        },
        props: {
            selected_items: {
                type: Array
            }
        },
        watch: {
            selected_items: {
                handler(val) {
                    this.$refs.form_user_interface.validate();
                },
                deep: true
            }
        },
        methods: {
            getRules(field) {
                let rules = [],
                    validation_data = {
                        number: {
                            gt: v => v > field.condition['gt'] || '',
                            lt: v => v < field.condition['lt'] || '',
                            gte: v => v >= field.condition['gte'] || '',
                            lte: v => v <= field.condition['lte'] || '',
                            eq: v => v === field.condition['eq'] || '',
                            neq: v => v !== field.condition['neq'] || ''
                        },
                        string: {
                            like: v => v ? v.includes(field.condition['like']) || '' : '',
                            eq: v => v === field.condition['eq'] || '',
                            neq: v => v !== field.condition['neq'] || ''
                        },
                        bool: {
                            eq: v => v === field.condition['eq'] || ''
                        }
                    }
                for (let key in field.condition) {
                    if (validation_data[field.type] && validation_data[field.type][key]) {
                        rules.push(validation_data[field.type][key]);
                    }
                }
                return rules;
            }
        }
    }
</script>
