<template>
  <aside class="support-bubble" :class="{ 'is-open': open }">
    <section v-if="open" class="help-card" role="dialog" :aria-label="$t('help')">
      <div class="help-card-header">
        <div class="help-icon" aria-hidden="true">
          <Icon icon="material-symbols:chat-bubble-outline-rounded" width="21" height="21" />
        </div>
        <div class="help-copy">
          <strong>{{ $t('help') }}</strong>
          <span>{{ $t('helpBubbleText') }}</span>
        </div>
        <button type="button" class="close-help" :aria-label="$t('close')" @click="open = false">
          <Icon icon="material-symbols:close-rounded" width="19" height="19" />
        </button>
      </div>
      <a
          class="help-link"
          href="https://khwarizmi.co.id"
          target="_blank"
          rel="noopener noreferrer"
      >
        <span class="help-link-icon" aria-hidden="true">
          <Icon icon="material-symbols:help-outline-rounded" width="20" height="20" />
        </span>
        <span>{{ $t('helpCenter') }}</span>
        <Icon class="help-link-arrow" icon="material-symbols:arrow-outward-rounded" width="18" height="18" />
      </a>
      <a
          class="help-link"
          href="mailto:admin@khwarizmi.co.id?subject=Cloud%20Mail%20Support"
      >
        <span class="help-link-icon" aria-hidden="true">
          <Icon icon="material-symbols:mail-outline-rounded" width="20" height="20" />
        </span>
        <span>{{ $t('emailAdmin') }}</span>
        <Icon class="help-link-arrow" icon="material-symbols:arrow-outward-rounded" width="18" height="18" />
      </a>
    </section>
    <button
        type="button"
        class="bubble-button"
        :aria-expanded="open"
        :aria-label="open ? $t('close') : $t('help')"
        :title="open ? $t('close') : $t('help')"
        @click="open = !open"
    >
      <Icon v-if="open" icon="material-symbols:close-rounded" width="24" height="24" />
      <Icon v-else icon="material-symbols:chat-bubble-outline-rounded" width="24" height="24" />
    </button>
  </aside>
</template>

<script setup>
import {ref} from 'vue'
import {Icon} from '@iconify/vue'

const open = ref(false)
</script>

<style scoped lang="scss">
.support-bubble {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 110;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.help-card {
  width: min(320px, calc(100vw - 32px));
  padding: 16px;
  border: 1px solid var(--light-border);
  border-radius: 14px;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
}

.help-card-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: 10px;
}

.help-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--el-color-primary-light-9);
  color: var(--khwarizmi-teal-800);
}

.help-copy {
  min-width: 0;
  display: grid;
  gap: 3px;

  strong {
    font-size: 15px;
  }

  span {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.45;
  }
}

.close-help {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  color: var(--secondary-text-color);
  background: transparent;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: var(--el-color-primary-light-9);
    color: var(--khwarizmi-teal-800);
  }
}

.help-link {
  min-height: 42px;
  margin-top: 14px;
  padding: 0 10px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  border: 1px solid var(--light-border);
  border-radius: 9px;
  color: var(--khwarizmi-teal-800);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover,
  &:focus-visible {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-7);
  }
}

.help-link-icon {
  display: inline-flex;
}

.help-link-arrow {
  color: var(--secondary-text-color);
}

.bubble-button {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: var(--khwarizmi-teal-800);
  color: #ffffff;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;

  &:hover,
  &:focus-visible {
    background: var(--khwarizmi-teal-950);
    transform: translateY(-2px);
  }
}

@media (max-width: 767px) {
  .support-bubble {
    right: 16px;
    bottom: max(16px, env(safe-area-inset-bottom));
  }
}
</style>
