<template>
  <div id="app">
    <mainNav></mainNav>
    <div class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import mainNav from '@/components/MainNav'
export default {
  name: 'app',
  components: {
    mainNav
  }
}
</script>

<style>
#app {
  font-family: "Ubuntu", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #343a40;
  margin-top: 90px;
}
</style>
