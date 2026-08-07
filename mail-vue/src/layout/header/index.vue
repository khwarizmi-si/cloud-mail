<template>
  <div class="header" :class="!hasPerm('email:send') ? 'not-send' : ''">
    <div class="header-btn">
      <hanburger @click="changeAside"></hanburger>
      <div class="brand-inline">
        <img src="/mail.png" alt="Khwarizmi Mail" />
        <span>Cloud Mail</span>
      </div>
      <span class="breadcrumb-item">{{ $t(route.meta.title) }}</span>
    </div>
    <form class="search-box" @submit.prevent="searchAll">
      <Icon class="search-icon" icon="iconoir:search" width="19" height="19" />
      <input
          id="global-search-input"
          ref="searchInputRef"
          v-model="searchText"
          type="search"
          :placeholder="$t('searchMail')"
          :aria-label="$t('searchMail')"
          @input="uiStore.searchQuery = searchText"
      />
      <kbd v-if="!searchText" class="search-shortcut-hint">/</kbd>
      <button v-if="searchText" type="button" class="clear-search" :aria-label="$t('clear')" @click="searchText = ''; uiStore.searchQuery = ''">
        <Icon icon="material-symbols:close" width="18" height="18" />
      </button>
    </form>
    <div class="toolbar">
      <button v-perm="'email:send'" type="button" class="writer-box" :aria-label="$t('send')" :title="$t('send')" @click="openSend">
        <span class="writer">
          <Icon icon="material-symbols:edit-outline-sharp" width="21" height="21" />
        </span>
      </button>
      <button type="button" class="notice icon-item" :aria-label="$t('noticeTitle')" :title="$t('noticeTitle')" @click="openNotice">
        <Icon icon="streamline-plump:announcement-megaphone" width="21" height="21"/>
      </button>
      <button type="button" class="language icon-item" :aria-label="$t('language')" :title="$t('language')" @click="toggleLanguage">
        <Icon icon="material-symbols:translate-rounded" width="21" height="21"/>
      </button>
      <button type="button" class="theme icon-item" :aria-label="uiStore.dark ? 'Light mode' : 'Dark mode'" :title="uiStore.dark ? 'Light mode' : 'Dark mode'" @click="openDark($event)">
        <Icon v-if="uiStore.dark" icon="mingcute:sun-fill"/>
        <Icon v-else icon="solar:moon-linear"/>
      </button>
      <el-dropdown
          ref="userinfoRef"
          @visible-change="e => userInfoShow = e"
          :teleported="true"
          placement="bottom-end"
          :show-arrow="false"
          popper-class="detail-dropdown"
      >
        <button type="button" class="avatar" :aria-label="$t('profile')" @click="userInfoHide">
          <span class="avatar-text">{{ formatName(userStore.user.email) }}</span>
          <Icon class="setting-icon" icon="mingcute:down-small-fill" width="19" height="19"/>
        </button>
        <template #dropdown>
          <div class="user-details">
            <div class="details-avatar">
              {{ formatName(userStore.user.email) }}
            </div>
            <div class="user-name">
              {{ userStore.user.name }}
            </div>
            <div class="detail-email" @click="copyEmail(userStore.user.email)">
              {{ userStore.user.email }}
            </div>
            <div class="detail-user-type">
              <el-tag>{{ userStore.user.role.name }}</el-tag>
            </div>
            <div class="action-info">
              <div>
                <span style="margin-right: 10px">{{ $t('sendCount') }}</span>
                <span style="margin-right: 10px">{{ $t('accountCount') }}</span>
              </div>
              <div>
                <div>
                  <span v-if="sendCount" style="margin-right: 5px">{{ sendCount }}</span>
                  <el-tag v-if="!hasPerm('email:send')">{{ sendType }}</el-tag>
                  <el-tag v-else>{{ sendType }}</el-tag>
                </div>
                <div>
                  <el-tag v-if="settingStore.settings.manyEmail || settingStore.settings.addEmail">
                    {{ $t('disabled') }}
                  </el-tag>
                  <span v-else-if="accountCount && hasPerm('account:add')"
                        style="margin-right: 5px">{{ $t('totalUserAccount', {msg: accountCount}) }}</span>
                  <el-tag v-else-if="!accountCount && hasPerm('account:add')">{{ $t('unlimited') }}</el-tag>
                  <el-tag v-else-if="!hasPerm('account:add')">{{ $t('unauthorized') }}</el-tag>
                </div>
              </div>
            </div>
            <div class="logout">
              <el-button type="primary" :loading="logoutLoading" @click="clickLogout">{{ $t('logOut') }}</el-button>
            </div>
          </div>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import hanburger from '@/components/hamburger/index.vue'
import {logout} from "@/request/login.js";
import {Icon} from "@iconify/vue";
import {useUiStore} from "@/store/ui.js";
import {useUserStore} from "@/store/user.js";
import {useRoute} from "vue-router";
import {computed, ref, watch} from "vue";
import {useSettingStore} from "@/store/setting.js";
import {hasPerm} from "@/perm/perm.js"
import {useI18n} from "vue-i18n";
import {setExtend} from "@/utils/day.js"

const {t} = useI18n();
const route = useRoute();
const settingStore = useSettingStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const logoutLoading = ref(false)
const userInfoShow = ref(false)
const userinfoRef = ref({})
const searchText = ref('')
const searchInputRef = ref(null)

defineExpose({ focusSearch: () => searchInputRef.value?.focus() })

watch(() => route.query.q, (query) => {
  searchText.value = typeof query === 'string' ? query : ''
})

const accountCount = computed(() => {
  return userStore.user.role.accountCount
})

const sendType = computed(() => {

  if (settingStore.settings.send === 1) {
    return t('disabled')
  }

  if (!hasPerm('email:send')) {
    return t('unauthorized')
  }

  if (userStore.user.role.sendType === 'ban') {
    return t('sendBanned')
  }

  if (userStore.user.role.sendType === 'internal') {
    return t('sendInternal')
  }

  if (!userStore.user.role.sendCount) {
    return t('unlimited')
  }

  if (userStore.user.role.sendType === 'day') {
    return t('daily')
  }

  if (userStore.user.role.sendType === 'count') {
    return t('total')
  }
})

const sendCount = computed(() => {


  if (!hasPerm('email:send')) {
    return null
  }

  if (userStore.user.role.sendType === 'ban') {
    return null
  }

  if (userStore.user.role.sendType === 'internal') {
    return null
  }

  if (!userStore.user.role.sendCount) {
    return null
  }

  if (settingStore.settings.send === 1) {
    return null
  }

  return userStore.user.sendCount + '/' + userStore.user.role.sendCount
})

function userInfoHide(e) {
    if (userInfoShow.value) {
        userinfoRef.value.handleClose()
    } else {
        userinfoRef.value.handleOpen()
    }
}

async function copyEmail(email) {
  try {
    await navigator.clipboard.writeText(email);
    ElMessage({
      message: t('copySuccessMsg'),
      type: 'success',
      plain: true,
    })
  } catch (err) {
    console.error(`${t('copyFailMsg')}:`, err);
    ElMessage({
      message: t('copyFailMsg'),
      type: 'error',
      plain: true,
    })
  }
}

function changeLang(lang) {
  setExtend(lang === 'zh' ? 'zh-cn' : lang)
  settingStore.lang = lang
}

function toggleLanguage() {
  const languages = ['id', 'en', 'zh']
  const index = languages.indexOf(settingStore.lang)
  changeLang(languages[(index + 1) % languages.length])
}

function searchAll() {
  const query = searchText.value.trim()
  if (!query) {
    uiStore.searchQuery = ''
    return
  }
  if (hasPerm('all-email:query')) {
    router.push({name: 'all-email', query: {q: query}})
    return
  }
  uiStore.searchQuery = query
}

function openNotice() {
  uiStore.showNotice()
}

function openDark(e) {

  const nextIsDark = !uiStore.dark
  const root = document.documentElement

  if (!document.startViewTransition) {
    switchDark(nextIsDark, root);
    return
  }

  const x = e.clientX
  const y = e.clientY

  const maxX = Math.max(x, window.innerWidth - x)
  const maxY = Math.max(y, window.innerHeight - y)
  const endRadius = Math.hypot(maxX, maxY)

  // 标记切换目标，供 CSS 选择器使用
  root.setAttribute('data-theme-to', nextIsDark ? 'dark' : 'light')
  root.style.setProperty('--vt-x', `${x}px`)
  root.style.setProperty('--vt-y', `${y}px`)
  root.style.setProperty('--vt-end-radius', `${endRadius + 10}px`)

  const transition = document.startViewTransition(() => {
    switchDark(nextIsDark, root);
  })

  transition.finished.finally(() => {
    // 清理标记
    root.removeAttribute('data-theme-to')
  })
}

function switchDark(nextIsDark, root) {
  root.setAttribute('class', nextIsDark ? 'dark' : '')
  const metaTag = document.getElementById('theme-color-meta');
  const isMobile =  !window.matchMedia("(pointer: fine) and (hover: hover)").matches;
  metaTag.setAttribute('content', nextIsDark ? (isMobile ? '#141414' : '#000000') : (isMobile ? '#FFFFFF' : '#F1F1F1'));
  uiStore.dark = nextIsDark
}

function openSend() {
  uiStore.writerRef.open()
}

function changeAside() {
  uiStore.asideShow = !uiStore.asideShow
}

function clickLogout() {
  logoutLoading.value = true
  logout().then(() => {
    localStorage.removeItem("token")
    router.replace('/login')
  }).finally(() => {
    logoutLoading.value = false
  })
}

function formatName(email) {
  return email[0]?.toUpperCase() || ''
}

</script>
<style>
.detail-dropdown {
  color: var(--el-text-color-primary) !important;
  padding: 0 !important;
  border-radius: 14px !important;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>

:deep(.el-popper.is-pure) {
  border-radius: 6px;
}

.user-details {
  width: min(320px, calc(100vw - 24px));
  max-width: calc(100vw - 24px);
  padding: 18px;
  font-size: 14px;
  display: block;

  .user-name {
    font-weight: bold;
    margin-top: 10px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
  }

  .detail-user-type {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }

  .action-info {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
    margin-top: 16px;
    padding: 14px 0;
    border-top: 1px solid var(--light-border);
    border-bottom: 1px solid var(--light-border);

    > div:first-child {
      display: grid;
      align-content: center;
      gap: 8px;
      min-width: 0;
      color: var(--secondary-text-color);
    }

    > div:last-child {
      display: grid;
      align-content: center;
      justify-items: end;
      gap: 8px;
      min-width: 0;

      > div {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 0;
        max-width: 100%;

        :deep(.el-tag) {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .detail-email {
    width: 100%;
    margin-top: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    color: var(--regular-text-color);
    cursor: pointer;
  }

  .logout {
    margin-top: 16px;
    width: 100%;
    padding: 0;

    .el-button {
      border-radius: 8px;
      height: 36px;
      width: 100%;
    }
  }

  .details-avatar {
    margin: 0 auto;
    height: 52px;
    width: 52px;
    background: var(--el-color-primary-light-9);
    color: var(--khwarizmi-teal-800);
    border: 1px solid var(--el-color-primary-light-7);
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 700;
  }
}


.header {
  display: grid;
  grid-template-columns: auto minmax(220px, 1fr) auto;
  align-items: center;
  height: 100%;
  gap: 24px;
}

.header.not-send {
  grid-template-columns: auto minmax(220px, 1fr) auto;
}

.writer-box {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;

  .writer {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    color: #ffffff;
    background: var(--khwarizmi-orange);
    transition: background-color 180ms ease, transform 180ms ease;
    display: flex;
    align-items: center;
    justify-content: center;

    .writer-text {
      margin-left: 15px;
      font-size: 14px;
      font-weight: bold;;
    }
  }

  &:hover .writer {
    background: var(--khwarizmi-orange-dark);
    transform: translateY(-1px);
  }
}

.header-btn {
  display: inline-flex;
  align-items: center;
  height: 100%;
  min-width: 0;
  gap: 14px;
}

.brand-inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--khwarizmi-teal-950);
  font-size: 17px;
  font-weight: 700;
  white-space: nowrap;

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
}

.breadcrumb-item {
  display: none;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(100%, 760px);
  height: 46px;
  margin: 0 auto;
  padding: 0 16px;
  border: 1px solid var(--light-border);
  border-radius: 24px;
  background: var(--el-color-primary-light-9);
  color: var(--regular-text-color);
  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;

  &:hover {
    background: var(--el-bg-color);
    box-shadow: 0 1px 4px rgba(6, 59, 58, 0.1);
  }

  &:focus-within {
    background: var(--el-bg-color);
    border-color: var(--el-color-primary-light-7);
    box-shadow: 0 1px 6px rgba(6, 59, 58, 0.16);
  }

  input {
    min-width: 0;
    flex: 1;
    color: var(--el-text-color-primary);
    background: transparent;
    font-size: 15px;

    &::placeholder {
      color: var(--secondary-text-color);
    }
  }

  .search-icon {
    flex: 0 0 auto;
  }

  .search-shortcut-hint {
    flex: 0 0 auto;
    font-family: inherit;
    font-size: 12px;
    line-height: 1;
    padding: 4px 7px;
    border-radius: 6px;
    border: 1px solid var(--light-border);
    color: var(--secondary-text-color);
    background: var(--el-bg-color);

    @media (max-width: 767px) {
      display: none;
    }
  }

  .clear-search {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    cursor: pointer;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;

  .icon-item {
    align-self: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: var(--regular-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 160ms ease, color 160ms ease;
  }

  .icon-item:hover,
  .icon-item:focus-visible {
    background: var(--el-color-primary-light-9);
    color: var(--khwarizmi-teal-800);
  }

  .avatar {
    display: flex;
    align-items: center;
    border: 0;
    padding: 0;
    color: var(--regular-text-color);
    background: transparent;
    cursor: pointer;

    .avatar-text {
      background: var(--el-color-primary-light-9);
      color: var(--khwarizmi-teal-800);
      height: 34px;
      width: 34px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 1px solid var(--el-color-primary-light-7);
      font-weight: 700;
    }

    .setting-icon {
      margin-left: -5px;
      background: var(--el-bg-color);
      border-radius: 50%;
    }
  }
}

@media (max-width: 767px) {
  .header {
    grid-template-columns: auto 1fr;
    gap: 12px;
  }

  .brand-inline span,
  .breadcrumb-item {
    display: none;
  }

  .search-box {
    width: 100%;
    height: 38px;
  }

  .toolbar {
    gap: 4px;
    grid-column: 1 / -1;
    justify-content: flex-end;
    position: absolute;
    right: 8px;

    .icon-item {
      width: 40px;
      height: 40px;
    }

    .avatar .avatar-text {
      width: 40px;
      height: 40px;
    }
    top: 12px;
    pointer-events: none;

    > * {
      pointer-events: auto;
    }

    .notice,
    .language {
      display: none;
    }
  }

  .header-btn {
    grid-column: 1;
  }

  .search-box {
    grid-column: 1 / -1;
    grid-row: 2;
    margin-top: -4px;
  }
}

.el-tooltip__trigger:first-child:focus-visible {
  outline: unset;
}
</style>
