<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl dark:text-white hover:text-black">
        Travel Log
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <a class="btn btn-accent">Sign In with github</a>
      <AppThemeToggle />
    </div>
  </div>
</template>
