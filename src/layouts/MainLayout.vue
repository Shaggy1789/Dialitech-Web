<template>
  <div class="app">
    <Sidebar />
    <main class="main-content">
      <Navbar />
      <router-view />
      <Footer v-if="showFooter" />
    </main>
  </div>
</template>

<script setup>
defineProps({
  showFooter: { type: Boolean, default: true }
});
</script>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 1rem;
}
</style>