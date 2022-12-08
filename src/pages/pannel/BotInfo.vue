<script lang="ts" setup>
import { onMounted } from "vue";
import { useLoading } from "../../hooks/use-loading";
import { useTelegramApi } from "../../hooks/use-telegram-api";
import { useAuthStore } from "../../store/auth";

import { NAvatar, NButton, NCard, NCheckbox, NIcon, NSpace, NSpin } from "naive-ui";

import { Bot20Filled, Open20Filled } from "@vicons/fluent";

const authStore = useAuthStore();
const api = useTelegramApi(authStore.token);

const { state, refresh } = useLoading(() =>
  api
    .getChat(authStore.botInfo!.id)
    .then((chat) => chat.photo?.big_file_id || "")
    .then((photoFileId) => (photoFileId ? api.getFile(photoFileId) : undefined))
    .then((file) => file?.file_path)
    .then((filePath) => (filePath ? `https://api.telegram.org/file/bot${authStore.token}/${filePath}` : undefined))
);

onMounted(() => {
  refresh();
});
</script>

<template>
  <n-space vertical justify="center" class="fullheight" style="padding: 0 20% 0 20%">
    <n-card v-if="authStore.botInfo" style="margin-top: 10px" size="small" :segmented="{ content: true }">
      <template #header>
        <n-space align="center">
          <n-avatar round :src="state.context.result">
            <template #fallback>
              <n-icon>
                <bot20-filled />
              </n-icon>
            </template>
            <n-spin size="small" v-if="!state.context.result" />
          </n-avatar>
          {{ authStore.botInfo.first_name }}
        </n-space>
      </template>
      <template #header-extra>
        {{ `ID: ${authStore.botInfo.id}` }}
      </template>
      <n-space justify="center" style="margin-top: 20px">
        <n-checkbox :checked="authStore.botInfo.can_join_groups" readonly>Can join groups</n-checkbox>
        <n-checkbox :checked="authStore.botInfo.can_read_all_group_messages" readonly>
          Can read group messages
        </n-checkbox>
        <n-checkbox :checked="authStore.botInfo.supports_inline_queries" readonly>Inline queries</n-checkbox>
      </n-space>
      <template #action>
        <n-space justify="end">
          <a :href="`https://t.me/${authStore.botInfo.username}`" target="_blank">
            <n-button text icon-placement="right">
              <template #icon>
                <open20-filled />
              </template>
              Open chat with @{{ authStore.botInfo.username }}
            </n-button>
          </a>
        </n-space>
      </template>
    </n-card>
  </n-space>
</template>
