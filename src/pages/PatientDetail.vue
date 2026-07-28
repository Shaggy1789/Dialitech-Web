<template>
  <div class="patient-detail">
    <header class="patient-header">
      <h1>Patient Overview</h1>
      <div class="meta">
        <span>Age: 45</span>
        <span>Diagnosis: ERC Stage 3</span>
        <span>Last Visit: 2026-07-15</span>
      </div>
    </header>

    <aside class="timeline">
      <h2>Timeline</h2>
      <ul class="timeline-list">
        <li><strong>2025-01-10</strong> - Diagnosis</li>
        <li><strong>2025-06-01</strong> - Treatment Started</li>
        <li><strong>2026-03-12</strong> - Recent Labs</li>
        <li><strong>2026-07-15</strong> - Follow-up Consultation</li>
      </ul>
    </aside>

    <section class="lab-table">
      <h2>Recent Lab Results</h2>
      <table class="lab-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Result</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>eGFR</td>
            <td>38 ml/min</td>
            <td>≥60</td>
          </tr>
          <tr>
            <td>Creatinine</td>
            <td>1.8 mg/dL</td>
            <td>0.6-1.2</td>
          </tr>
          <tr>
            <td>BUN</td>
            <td>28 mg/dL</td>
            <td>7-20</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div class="alerts-section">
      <h2>Alerts</h2>
      <div class="alerts-grid">
        <div class="alert-card">
          <span class="badge">Critical</span>
          <p>Medication non-adherence</p>
        </div>
        <div class="alert-card">
          <span class="badge warning">Warning</span>
          <p>High potassium levels</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.patient-detail {
  display: flex;
  flex-direction: flex;
}
.patient-header {
  padding: 1rem;
  background: #2c3e50;
  color: white;
}
.meta {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
.timeline {
  flex: 0 0 300px;
  padding: 1rem;
  background: #f8f9fa;
}
.timeline-list {
  list-style: none;
  padding: 0;
}
.timeline-list li {
  margin-bottom: 0.5rem;
}
.lab-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.lab-table th,
.lab-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}
.alerts-section {
  margin-top: 2rem;
}
.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.alert-card {
  background: #fff;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
}
.badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.75rem;
  color: white;
}
.badge.critical {
  background: #e74c3c;
}
.badge.warning {
  background: #f1c40f;
}
</style>