<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <div class="header">
    <Header />
  </div>

    <RouterView />
  </template>

<style scoped lang="scss">
  .header{
    height: 10dvh;
  }


</style>