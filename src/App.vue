<template>
  <v-app>
    <v-main>
      <v-container grid-list-md fluid>
        <constructor></constructor>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
    import Constructor from './components/constructor.vue';

    export default {
        name: 'App',
        components: {
            Constructor,
        }
    };
</script>

<style lang="scss">
  .fix-flex {
    flex-grow: 0!important;
  }
</style>
