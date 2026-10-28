import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient({
  // 关键：在服务端渲染时，必须提供完整的绝对路径 baseURL，否则 Server 端的 fetch 无法解析相对路径 `/api/...`
  // 我们可以通过环境变量或者在客户端/服务端进行自适应
  baseURL: import.meta.client
    ? window.location.origin
    // eslint-disable-next-line node/no-process-env
    : (process.env.BETTER_AUTH_URL || "https://nuxt-travel-log-2.vercel.app"),
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
