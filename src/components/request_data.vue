<template>
  <v-card>
    <v-col>Данные запроса</v-col>
    <v-col>{{ request_data }}</v-col>
  </v-card>
</template>

<script>
  export default {
      props: ['request_data']
  }
</script>
