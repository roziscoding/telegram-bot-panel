<script lang="ts" setup>
import { CheckboxChecked16Regular } from "@vicons/fluent";
import { NAlert, NButton, NEmpty, NIcon, NSkeleton, NSpace, NSpin } from "naive-ui";
import { onMounted } from "vue";
import { useLoading } from "../../../hooks/use-loading";
import { useTelegramApi } from "../../../hooks/use-telegram-api";
import { useAuthStore } from "../../../store/auth";

const authStore = useAuthStore();
const api = useTelegramApi(authStore.token);

const { refresh, state } = useLoading(() => api.getWebhookInfo());
onMounted(() => {
  refresh();
});
</script>

<template>
  <n-space vertical justify="center" class="fullheight">
    <n-spin :show="state.matches('loading')" size="small">
      <template v-if="state.matches('loading')">
        <n-space vertical align="center">
          <n-skeleton height="40px" circle />
        </n-space>
      </template>
      <template v-if="state.context.result">
        <template v-if="!state.context.result.url">
          <n-empty description="Webhook is empty">
            <template #extra>
              <n-button size="small" @click="() => refresh()">Refresh</n-button>
            </template>
          </n-empty>
        </template>
        <template v-if="state.context.result.url">
          <n-empty :description="state.context.result.url">
            <template #icon>
              <n-icon>
                <CheckboxChecked16Regular />
              </n-icon>
            </template>
            <template #extra>
              <n-space vertical>
                <div>Pending update count: {{ state.context.result.pending_update_count }}.</div>
                <n-button size="small" @click="() => refresh()">Refresh</n-button>
              </n-space>
            </template>
          </n-empty>
        </template>
        <template v-if="state.context.result.last_error_message">
          <n-alert
            type="info"
            style="margin-top: 10px"
            :title="`Last error date: ${toLocaleDateString(state.context.result.last_error_date)}`"
            closable
          >
            <n-space vertical>
              <div>{{ state.context.result.last_error_message }}</div>
              <div v-if="state.context.result.last_synchronization_error_date">
                Last sync error date: {{ toLocaleDateString(state.context.result.last_synchronization_error_date) }}
              </div>
            </n-space>
          </n-alert>
        </template>
      </template>
      <template v-if="state.matches('error')">
        <GrammyError :error="state.context.error" @retry="refresh" />
      </template>
    </n-spin>
  </n-space>
</template>
