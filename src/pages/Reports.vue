<template>
  <div class="reports-page">
    <h1 class="title">Reports</h1>
    <div class="grid">
      <div class="card">
        <h2>Monthly Summary</h2>
        <p class="value">12 reports generated</p>
      </div>
      <div class="card">
        <h2>Compliance Overview</h2>
        <div class="progress-bar">
          <div class="progress" style="width: 85%"></div>
        </div>
        <p>Patients compliant: 85%</p>
      </div>
      <div class="card">
        <h2>Download Reports</h2>
        <ul class="download-list">
          <li><a href="#" target="_blank">Q2 2026 Report (PDF)</a></li>
          <li><a href="#" target="_blank">Annual Summary 2026 (PDF)</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.reports-page {
  padding: 1rem;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  background: #fafafa;
}
.progress-bar {
  height: 1rem;
  width: 100%;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
.progress {
  height: 100%;
  background: #2c3e50;
  border-radius: 4px;
  transition: width 0.4s;
}
.download-list {
  list-style: none;
  padding: 0;
}
.download-list li {
  margin-bottom: 0.5rem;
}
.download-list a {
  color: #2c3e50;
  text-decoration: none;
}
</style>