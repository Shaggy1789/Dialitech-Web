<template>
  <div class="dashboard">
    <h1 class="title">Clinical Dashboard</h1>
    <div class="grid">
      <div class="card">
        <h2>Patients</h2>
        <p class="value">124</p>
      </div>
      <div class="card">
        <h2>Active Alerts</h2>
        <p class="value">3</p>
      </div>
      <div class="card">
        <h2>Reports</h2>
        <p class="value">7</p>
      </div>
      <div class="card">
        <h2>Compliance</h2>
        <p class="value">98%</p>
      </div>
    </div>
    <div class="section">
      <h2>Quick Links</h2>
      <ul>
        <li><router-link to="/patients">Patient Management</router-link></li>
        <li><router-link to="/alerts">Alert Settings</router-link></li>
        <li><router-link to="/reports">Generate Reports</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.dashboard {
  padding: 1rem;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  background: #fafafa;
}
.value {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 0.5rem;
}
.section {
  margin-top: 2rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
}
router-link {
  color: #2c3e50;
  text-decoration: none;
}
</style>