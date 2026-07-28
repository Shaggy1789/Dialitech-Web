<template>
  <nav class="navbar">
    <div class="logo">ERC Dashboard</div>
    <ul class="nav-links">
      <li><router-link to="/dashboard">Home</router-link></li>
      <li><router-link to="/patients">Patients</router-link></li>
      <li><router-link to="/settings">Settings</router-link></li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo { font-weight: bold; }
.nav-links a { color: white; margin-left: 1rem; text-decoration: none; }
</style>