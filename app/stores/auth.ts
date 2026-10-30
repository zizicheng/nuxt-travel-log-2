import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient({
  baseURL: import.meta.client
    ? window.location.origin
    // eslint-disable-next-line node/no-process-env
    : (process.env.BETTER_AUTH_URL || "https://nuxt-travel-log-2.vercel.app"),
});

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
  async function init() {
    const data = await authClient.useSession((url, options) => {
      return useFetch(url, {
        ...options,
        headers: {
          ...(options?.headers || {}),
          ...(import.meta.server ? useRequestHeaders(["cookie"]) : {}),
        },
      });
    });
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
