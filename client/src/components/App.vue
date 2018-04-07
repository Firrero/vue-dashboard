<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data () {
      return {
        section: 'Head'
      }
    }
  }
</script>

<style>
  #app {
    height:100% !important;
  }
</style>
