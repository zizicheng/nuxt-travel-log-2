import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient({
  fetchOptions: {
    // 关键：在这里配置全局拦截，让所有通过 authClient 发出的请求（包括 useSession 内部的请求）
    // 在服务端渲染时自动带上浏览器的 Cookie
    headers: () => {
      if (import.meta.server) {
        // 在服务端渲染时安全地获取请求头
        return useRequestHeaders(["cookie"]);
      }
      return {};
    },
  },
});

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function signIn() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
    });
  }

  async function signOut() {
    await authClient.signOut();
    navigateTo("/");
  }

  return {
    loading,
    signIn,
    signOut,
    user,
    init,

  };
});
