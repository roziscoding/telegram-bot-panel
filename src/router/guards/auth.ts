import { type NavigationGuard } from "vue-router";
import { useAuthStore } from "../../store/auth";

export const authGuard: NavigationGuard = (to) => {
  const authStore = useAuthStore();

  if (to.name === "login" && authStore.authorized) return { name: "pannel", query: to.query };
  if (to.name !== "login" && !authStore.authorized) return { name: "login", query: { goto: encodeURI(to.fullPath) } };
};
