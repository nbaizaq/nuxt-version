<template>
  <div>basic {{ version }}</div>
</template>

<script setup>
const version = useNuxtApp().$config.public.version
</script>
