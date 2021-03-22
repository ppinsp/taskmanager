<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {}
</script>
<style lang="css">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>