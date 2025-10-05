<template>
    <button
        :class="['border rounded px-4 py-2 transition-colors', color === 'white' ? 'border-gray-400 hover:bg-gray-800 text-gray-300' : '', customClass]" @click="onClick"
    >
      <slot />
    </button>
  </template>
  
<script setup>
  defineProps({
    onClick: Function,
    color: {
      type: String,
      default: 'white'
    },
    customClass: {
      type: String,
      default: ''
    }
  })
</script>
  