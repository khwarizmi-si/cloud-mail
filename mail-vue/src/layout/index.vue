<template>
  <el-container class="layout">
    <el-header class="topbar">
      <Header ref="headerRef" />
    </el-header>
    <el-container class="body-shell">
      <el-aside
          class="aside"
          :class="asideClass">
        <Aside :collapsed="!uiStore.asideShow && !isMobile" />
      </el-aside>
      <div
          :class="(uiStore.asideShow && isMobile)? 'overlay-show':'overlay-hide'"
          @click="uiStore.asideShow = false"
      ></div>
      <el-main class="main-container">
        <Main />
      </el-main>
    </el-container>
  </el-container>
  <writer ref="writerRef" />
  <SupportBubble />
</template>

<script setup>
import Aside from '@/layout/aside/index.vue'
import Header from '@/layout/header/index.vue'
import Main from '@/layout/main/index.vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {useUiStore} from "@/store/ui.js";
import writer from '@/layout/write/index.vue'
import SupportBubble from '@/components/support-bubble/index.vue'

const uiStore = useUiStore();
const writerRef = ref({})
const headerRef = ref(null)
const isMobile = ref(window.innerWidth < 1025)

const asideClass = computed(() => {
  if (uiStore.asideShow) return 'aside-show'
  return isMobile.value ? 'el-aside-hide' : 'aside-rail'
})
const handleResize = () => {
  isMobile.value = window.innerWidth < 1025
  uiStore.asideShow = window.innerWidth > 1024;
}

// ponytail: global shortcuts kept to the two lowest-risk, highest-value ones (/ and c);
// j/k row navigation needs shared focus-index state across virtual-scrolled + keep-alive
// list views and was skipped as a separate, bigger piece of work.
function isTypingTarget(el) {
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
}

function handleGlobalKeydown(event) {
  if (event.metaKey || event.ctrlKey || event.altKey) return

  if (event.key === '/' && !isTypingTarget(document.activeElement)) {
    event.preventDefault()
    headerRef.value?.focusSearch()
    return
  }

  if (event.key === 'c' && !isTypingTarget(document.activeElement)) {
    event.preventDefault()
    writerRef.value?.open?.()
  }
}

onMounted(() => {
  uiStore.writerRef = writerRef

  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleGlobalKeydown)
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style lang="scss" scoped>
.el-aside-hide {
  position: fixed;
  left: 0;
  height: 100%;
  z-index: 100;
  transform: translateX(-100%);
  transition: all 100ms ease;
}

.aside-show {
  border-right: 1px solid var(--light-border);
  transform: translateX(0);
  transition: all 100ms ease;
  z-index: 101;
  @media (max-width: 1025px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    height: 100%;
    background: var(--el-bg-color);
  }
}

.aside-rail {
  border-right: 1px solid var(--light-border);
  transition: all 100ms ease;
  z-index: 101;
}

.el-aside {
  width: auto;
  transition: all 100ms ease;
}

.layout {
  height: 100%;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  background: var(--extra-light-fill);
}

.topbar {
  height: 64px;
  flex: 0 0 64px;
  padding: 0 22px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--light-border);
}

.body-shell {
  min-height: 0;
  flex: 1;
  position: relative;
}

.main-container {
  min-height: 0;
  background: var(--extra-light-fill);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0;
}

@media (max-width: 1025px) {
  .topbar {
    height: 58px;
    flex-basis: 58px;
    padding: 0 14px;
  }
}

@media (max-width: 767px) {
  .topbar {
    height: 104px;
    flex-basis: 104px;
  }
}

.overlay-show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
  transition: all 0.3s;
}

.overlay-hide {
  display: flex;
  pointer-events: none;
  opacity: 0;
}
</style>
