<template>
  <iframe
    ref="frame"
    class="content-html"
    :style="{ height: `${height}px` }"
    :srcdoc="html"
    sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
    referrerpolicy="no-referrer"
    title="Email content"
    @load="resizeContent"
  ></iframe>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const frame = ref(null)
const height = ref(150)
let observer

function resizeContent() {
  observer?.disconnect()
  const body = frame.value?.contentDocument?.body
  if (!body) return
  // Keep scripts disabled in the sandbox; same-origin only permits measuring layout.
  body.style.display = 'flow-root'
  const resize = () => {
    const styles = frame.value.contentWindow.getComputedStyle(body)
    height.value = Math.ceil(body.getBoundingClientRect().height
      + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom))
  }
  observer = new ResizeObserver(resize)
  observer.observe(body)
  resize()
}

onBeforeUnmount(() => observer?.disconnect())

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
  display: block;
  border: 0;
}
</style>
