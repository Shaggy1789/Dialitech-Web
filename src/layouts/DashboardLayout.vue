<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="main-area">
      <TopNavbar />
      <div class="content">
        <router-view />
      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import TopNavbar from '../components/TopNavbar.vue';
import Footer from '../components/Footer.vue';
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content {
  flex: 1;
}
</style>