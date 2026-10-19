<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <button
    :disabled="authStore.loading"
    class="btn btn-accent"
    @click="authStore.signIn()"
  >
    Sign In with github
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
    <Icon
      v-else
      name="i-tabler:brand-github"
      size="24"
    />
  </button>
</template>
