<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title class="headline text-uppercase">
        <span>AcQua</span>
        <span class="font-weight-light">Logging</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content class="ma-2">
      <Loggings />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Loggings from "./components/Loggings.vue";

export default Vue.extend({
  name: "App",

  components: {
    Loggings,
  },

  data: () => ({
    //
  }),
});
</script>
