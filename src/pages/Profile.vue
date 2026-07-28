<template>
  <div class="profile-page">
    <h1 class="title">User Profile</h1>
    <div class="card">
      <h2>Basic Info</h2>
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Age:</strong> 45</p>
      <p><strong>Diagnosis:</strong> ERC Stage 3</p>
      <p><strong>Last Visit:</strong> 2026-07-15</p>
    </div>
    <div class="card">
      <h2>Contact</h2>
      <p>email: john.doe@example.com</p>
      <p>Phone: +34 912 345 678</p>
    </div>
    <div class="card">
      <h2>Settings</h2>
      <ul class="list">
        <li>-theme: Dark</li>
        <li>Notifications: Enabled</li>
        <li>Data export: Weekly</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.profile-page {
  padding: 1rem;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  background: #fafafa;
}
.list {
  list-style: none;
  padding: 0;
}
.list li {
  margin-bottom: 0.5rem;
}
</style>