<template>
  <div class="alerts-page">
    <h1 class="title">Alerts</h1>
    <div class="grid">
      <div class="card">
        <h2>Active Alerts</h2>
        <ul class="alert-list">
          <li>High potassium levels (Patient #123)</li>
          <li>Medication non-adherence (Patient #124)</li>
          <li>Missed follow-up appointment (Patient #125)</li>
        </ul>
      </div>
      <div class="card settings-summary">
        <h2>Alert Settings</h2>
        <ul class="settings-list">
          <li><strong>Hyperkalemia:</strong> Immediate notification</li>
          <li><strong>Low eGFR:</strong> Daily summary</li>
          <li><strong>Medication interaction:</strong> Real-time alert</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.alerts-page {
  padding: 1rem;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  background: #fafafa;
}
.alert-list {
  list-style: none;
  padding: 0;
}
.alert-list li {
  margin-bottom: 0.5rem;
}
.settings-list {
  list-style: none;
  padding: 0;
}
.settings-list li {
  margin-bottom: 0.5rem;
}
</style>