<script lang="ts" setup>
import { NLayout, NLayoutContent, NLayoutSider, NMenu, NSpace, type MenuOption } from "naive-ui";
import { h } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { pannelRoute } from "../../router/router";

const currentRoute = useRoute();

const menuOptions: MenuOption[] = pannelRoute.children
  .filter((route) => Boolean(route.path) && Boolean(route.meta))
  .map((route) => ({
    label: () => h(RouterLink, { to: { name: route.name } }, { default: () => route.meta?.label }),
    key: route.name,
  }));
</script>
<template>
  <n-layout has-sider class="fullheight">
    <n-layout-sider>
      <n-space vertical>
        <n-menu :value="String(currentRoute.name)" :options="menuOptions" />
        <!-- <router-link v-for="route of pannelRoute.children" :to="{ name: route.name }" :key="route.name">
          {{ route.name }}
        </router-link> -->
      </n-space>
    </n-layout-sider>
    <n-layout>
      <n-layout-content content-style="padding: 24px;" class="fullheight">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
