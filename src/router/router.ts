import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { authGuard } from "./guards/auth";

export const pannelRoute = {
  path: "/pannel",
  component: () => import("../pages/pannel/PannelWrapper.vue"),
  children: [
    { name: "pannel", path: "", redirect: { name: "botInfo" } },
    {
      name: "botInfo",
      path: "bot-info",
      meta: { label: "Bot Info" },
      component: () => import("../pages/pannel/BotInfo.vue"),
    },
    {
      name: "webhookInfo",
      path: "webhook",
      meta: { label: "Webhook" },
      component: () => import("../pages/pannel/webhook/WebhookInfo.vue"),
    },
  ],
} satisfies RouteRecordRaw;

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/pannel",
  },
  {
    name: "login",
    path: "/login",
    component: () => import("../pages/LoginPage.vue"),
  },
  pannelRoute,
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);
