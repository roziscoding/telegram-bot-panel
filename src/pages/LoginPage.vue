<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import AuthForm from "../components/AuthForm.vue";
const route = useRoute();
const router = useRouter();

function redirect() {
  const goTo = route.query.goto;

  if (goTo && typeof goTo === "string") return router.push({ path: decodeURI(goTo) });

  router.push({ name: "botInfo" });
}
</script>

<template>
  <auth-form @success="redirect()" />
</template>
