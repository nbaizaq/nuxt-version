<template>
  <div>Nuxt module playground! {{ version }}</div>
</template>

<script setup>
const version = useNuxtApp().$config.public.version
</script>
