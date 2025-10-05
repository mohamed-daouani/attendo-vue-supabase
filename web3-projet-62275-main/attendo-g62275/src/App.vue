<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <div class="min-h-screen w-full">
    <Header/>
    <RouterView/>
  </div>
</template>
