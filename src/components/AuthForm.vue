<script lang="ts" setup>
import { NButton, NCard, NForm, NFormItem, NH1, NInput, NLayout, NResult, NSpace } from "naive-ui";
import { computed, ref } from "vue";
import { useLoading } from "../hooks/use-loading";
import { useAuthStore } from "../store/auth";

const token = ref("");
const authStore = useAuthStore();

const emit = defineEmits(["success"]);

const {
  refresh: login,
  state,
  reset,
} = useLoading(async () => {
  const botInfo = await authStore.login(token.value);
  emit("success");
  return botInfo;
});

const status = computed(() => (state.value.matches("error") ? "error" : undefined));
</script>

<template>
  <n-layout class="fullheight">
    <n-space vertical align="center" justify="center" class="fullheight">
      <n-h1>Telegram Bot API Pannel</n-h1>
      <n-card class="card">
        <n-form v-if="!state.matches('success')">
          <n-form-item
            :show-feedback="state.matches('error')"
            :show-label="false"
            :feedback="state.matches('error') ? `${state.context.error}` : ''"
            :validation-status="status"
          >
            <n-input
              @input="reset"
              type="text"
              name="Token"
              id="token"
              v-model:value="token"
              placeholder="Token"
              :disabled="state.matches('loading')"
            />
          </n-form-item>
          <n-form-item :show-feedback="false">
            <n-button
              :type="status"
              block
              @click="login()"
              :disabled="!token || state.matches('success')"
              :loading="state.matches('loading')"
            >
              Login
            </n-button>
          </n-form-item>
        </n-form>
        <n-result
          v-if="state.matches('success')"
          status="success"
          title="Success"
          :description="`Successfully authenticated as ${state.context.result?.username}`"
        >
          <template #footer>Redirecting you to the pannel</template>
        </n-result>
      </n-card>
    </n-space>
  </n-layout>
</template>

<style lang="scss">
.card {
  width: 30vw;
}
</style>
