<template>
  <n-form label-placement="top" style="margin-top: 10px">
    <n-form-item label="URL" path="url" style="margin-bottom: 10px" :rule="urlRule">
      <n-input :readonly="webhookLoading" placeholder="https://yourdomain.com/api/bot" v-model:value="url" />
    </n-form-item>
    <n-form-item label="Secret">
      <n-input
        :readonly="webhookLoading"
        placeholder="f2e49c07-2fc9-4e13-b5f6-044d3c1c154d"
        v-model:value="secretToken"
      />
    </n-form-item>
    <n-form-item label="Drop pending updates">
      <n-switch :readonly="webhookLoading" v-model:value="dropPendingUpdates" />
    </n-form-item>
    <grammy-error :error="setWebhookError" @retry="withRefreshWebhookInfo(setWebhook)" :retriable="false" />
    <grammy-error :error="deleteWebhookError" @retry="withRefreshWebhookInfo(deleteWebhook)" />
    <n-space justify="end">
      <n-button
        type="error"
        @click="withRefreshWebhookInfo(deleteWebhook)"
        :loading="deleteWebhookLoading"
        :disabled="setWebhookLoading"
      >
        Delete webhook
      </n-button>
      <n-button
        type="primary"
        @click="withRefreshWebhookInfo(setWebhook)"
        :loading="setWebhookLoading"
        :disabled="deleteWebhookLoading || !url"
      >
        Set webhook
      </n-button>
    </n-space>
  </n-form>
</template>
