<script setup lang="ts">
import { darkTheme, NConfigProvider } from "naive-ui";
</script>

<template>
  <n-config-provider :theme="darkTheme" style="height: 100%">
    <router-view></router-view>
  </n-config-provider>
</template>

<style scoped></style>
