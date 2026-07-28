<template>
  <iframe
    class="content-html"
    :srcdoc="html"
    sandbox
    referrerpolicy="no-referrer"
    title="Email content"
  ></iframe>
</template>

<script setup>
defineProps({
  html: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.content-html {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
