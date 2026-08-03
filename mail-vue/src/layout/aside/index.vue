<template>
  <el-scrollbar class="scroll">
    <div>
      <div class="title" >
        <img class="brand-mark" src="/mail.png" alt="Khwarizmi" />
        <div class="brand-copy">
          <strong>{{settingStore.settings.title}}</strong>
          <span>KHARIZMI MAIL</span>
        </div>
      </div>
      <button v-perm="'email:send'" type="button" class="compose-button" @click="openSend">
        <Icon icon="material-symbols:edit-outline-sharp" width="20" height="20" />
        <span>{{ $t('send') }}</span>
      </button>
      <el-menu :collapse="false" text-color="#fff" active-text-color="#fff" style="margin-top: 10px">
        <el-menu-item @click="router.push({name: 'email'})" index="email"
                      :class="route.meta.name === 'email' ? 'choose-item' : ''">
          <Icon icon="hugeicons:mailbox-01" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('inbox')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'send'})" index="send" v-perm="'email:send'"
                      :class="route.meta.name === 'send' ? 'choose-item' : ''">
          <Icon icon="cil:send" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('sent')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'draft'})" index="draft" v-perm="'email:send'"
                      :class="route.meta.name === 'draft' ? 'choose-item' : ''">
          <Icon icon="ep:document" width="19" height="19" />
          <span class="menu-name" style="margin-left: 22px">{{$t('drafts')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'star'})" index="star"
                      :class="route.meta.name === 'star' ? 'choose-item' : ''">
          <Icon icon="solar:star-line-duotone" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('starred')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'setting'})" index="setting"
                      :class="route.meta.name === 'setting' ? 'choose-item' : ''">
          <Icon icon="fluent:settings-48-regular" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('settings')}}</span>
        </el-menu-item>
        <div class="manage-title" v-perm="['all-email:query','user:query','role:query','setting:query','analysis:query','reg-key:query']">
          <div>{{$t('manage')}}</div>
        </div>
        <el-menu-item @click="router.push({name: 'analysis'})" index="analysis" v-perm="'analysis:query'"
                      :class="route.meta.name === 'analysis' ? 'choose-item' : ''">
          <Icon icon="fluent:data-pie-20-regular" width="24" height="24" />
          <span class="menu-name" style="margin-left: 18px">{{$t('analytics')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'user'})" index="setting" v-perm="'user:query'"
                      :class="route.meta.name === 'user' ? 'choose-item' : ''">
          <Icon icon="si:user-alt-2-line" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('allUsers')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'all-email'})" index="all-email" v-perm="'all-email:query'"
                      :class="route.meta.name === 'all-email' ? 'choose-item' : ''">
          <Icon icon="fluent:mail-list-28-regular" width="22" height="22" />
          <span class="menu-name" style="margin-left: 20px">{{$t('allMail')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'role'})" index="setting" v-perm="'role:query'"
                      :class="route.meta.name === 'role' ? 'choose-item' : ''">
          <Icon icon="fluent:lock-closed-16-regular" width="22" height="22" />
          <span class="menu-name" style="margin-left: 20px">{{$t('permissions')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'reg-key'})" index="reg-key" v-perm="'reg-key:query'"
                      :class="route.meta.name === 'reg-key' ? 'choose-item' : ''">
          <Icon icon="fluent:fingerprint-20-filled" width="22" height="22" />
          <span class="menu-name" style="margin-left: 20px">{{$t('inviteCode')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'sys-setting'})" index="sys-setting" v-perm="'setting:query'"
                      :class="route.meta.name === 'sys-setting' ? 'choose-item' : ''">
          <Icon icon="eos-icons:system-ok-outlined" width="18" height="18" style="margin-left: 2px" />
          <span class="menu-name" style="margin-left: 22px">{{$t('SystemSettings')}}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </el-scrollbar>
</template>

<script setup>
import router from "@/router/index.js";
import { useRoute } from "vue-router";
import {Icon} from "@iconify/vue";
import {useSettingStore} from "@/store/setting.js";
import {useUiStore} from "@/store/ui.js";

const settingStore = useSettingStore();
const route = useRoute();
const uiStore = useUiStore();

function openSend() {
  uiStore.writerRef?.open()
}

</script>

<style lang="scss" scoped>

.title {
  margin: 16px 16px 18px;
  min-height: 56px;
  display: flex;
  font-size: 15px;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  color: var(--khwarizmi-teal-950);
  max-width: 240px;
  padding: 8px 4px;

  .brand-mark {
    width: 34px;
    height: 34px;
    object-fit: contain;
    flex: 0 0 auto;
  }

  .brand-copy {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 1px;

    strong {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    span {
      color: var(--khwarizmi-teal-800);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.12em;
    }
  }

  :deep(.el-icon) {
    flex-shrink: 0;
    font-size: 20px;
  }

  .user-right-icon {
    align-self: center;
    position: absolute;
    font-size: 12px;
    right: 8px;
    color: #ffffff;
  }

}

.compose-button {
  min-height: 44px;
  margin: 0 16px 18px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 12px;
  background: var(--el-color-primary-light-9);
  color: var(--khwarizmi-teal-950);
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;

  &:hover,
  &:focus-visible {
    background: var(--el-color-primary-light-7);
    border-color: var(--el-color-primary-light-5);
    transform: translateY(-1px);
  }
}


.manage-title {
  margin: 20px 0 7px;
  padding-left: 22px;
  color: var(--secondary-text-color);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.el-menu-item {
  margin: 4px 10px !important;
  border-radius: 8px;
  height: 40px;
  padding: 10px !important;
  color: var(--regular-text-color) !important;
}

.choose-item {
  font-weight: bold;
  color: var(--khwarizmi-teal-950) !important;
  background: var(--el-color-primary-light-9) !important;

  :deep(svg) {
    color: var(--khwarizmi-orange);
  }
}

@media (hover: hover) {
  .el-menu-item:hover {
    background: var(--el-color-primary-light-9) !important;
  }
}

.menu-name {
  user-select: none;
}


:deep(.el-scrollbar__wrap--hidden-default ) {
  background: var(--extra-light-fill) !important;
}

:deep(.el-menu-item) {
  background: var(--extra-light-fill);
  transition: background-color 180ms ease, color 180ms ease;
}

:deep(.el-menu) {
  background: var(--extra-light-fill);
}

.el-menu {
  border-right: 0;
  width: 260px;
}

:deep(.el-divider__text) {
  background: var(--aside-backgound);
  color: #FFFFFF;
}

.scroll {

}
</style>
