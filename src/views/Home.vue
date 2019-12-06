<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Loggings />
  </div>
</template>

<script>
// @ is an alias to /src
import Loggings from "@/components/Loggings.vue";

export default {
  name: "home",
  components: {
    Loggings
  }
};
</script>
