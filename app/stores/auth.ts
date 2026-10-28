import { createAuthClient } from "better-auth/vue";

type SessionData = typeof authClient.$Infer.Session;

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
  // 把 session 改成普通的 ref 存储数据
  const sessionData = ref<SessionData | null>(null);
  const loading = ref(false);

  async function init() {
    loading.value = true;
    try {
      // 关键：在服务端渲染时，显式把浏览器的 cookie 带过去请求
      const res = await authClient.getSession({
        fetchOptions: {
          headers: import.meta.server ? useRequestHeaders(["cookie"]) : undefined,
        },
      });

      // 这里的 res 就是你刚才在网页上看到的那个完整 JSON ({ session, user })
      sessionData.value = res.data;
    }
    catch (error) {
      console.error("Failed to fetch session:", error);
      sessionData.value = null;
    }
    finally {
      loading.value = false;
    }
  }

  // 计算属性直接从 sessionData 拿 user
  const user = computed(() => sessionData.value?.user);

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
