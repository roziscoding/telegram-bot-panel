import { UserFromGetMe } from "@grammyjs/types";
import { defineStore } from "pinia";
import { useTelegramApi } from "../hooks/use-telegram-api";

const getEmptyUser = (): UserFromGetMe => ({
  id: 0,
  username: "",
  first_name: "",
  last_name: "",
  language_code: "",
  is_bot: true,
  is_premium: true,
  can_join_groups: false,
  supports_inline_queries: false,
  added_to_attachment_menu: true,
  can_read_all_group_messages: false,
});

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    authorized: false,
    bot: getEmptyUser(),
  }),
  actions: {
    async login(token: string) {
      const api = useTelegramApi(token);

      const me = await api.getMe();

      this.bot = me;
      this.token = token;
      this.authorized = true;

      return me;
    },
    logout() {
      this.$reset();
    },
  },
  getters: {
    botInfo: (state) => (state.authorized ? state.bot : null),
  },
  persist: true,
});
