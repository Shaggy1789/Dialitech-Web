<template>
  <div class="patient-dashboard">
    <header class="page-header">
      <h1 class="page-title">My Health Dashboard</h1>
      <p class="page-subtitle">Your personal treatment overview</p>
    </header>

    <div class="patient-grid">
      <div class="left-col">
        <div class="info-card next-session">
          <h3>Next Session</h3>
          <p class="session-date">Tomorrow, July 29, 2026</p>
          <p class="session-time">08:00 AM - 12:00 PM</p>
          <span class="status-badge confirmed">Confirmed</span>
        </div>

        <div class="info-card treatment-status">
          <h3>Treatment Status</h3>
          <div class="status-row">
            <span>Adherence Rate</span>
            <span class="stat-good">87%</span>
          </div>
          <div class="status-row">
            <span>Sessions This Month</span>
            <span>12 / 12</span>
          </div>
          <div class="status-row">
            <span>Current Condition</span>
            <span class="stat-good">Stable</span>
          </div>
        </div>

        <div class="info-card personal-info">
          <h3>Personal Information</h3>
          <div class="info-row"><span class="label">Blood Type</span><span>A+</span></div>
          <div class="info-row"><span class="label">Diagnosis</span><span>ERC Stage 3</span></div>
          <div class="info-row"><span class="label">Doctor</span><span>Dr. Sarah Wilson</span></div>
          <div class="info-row"><span class="label">Next Appointment</span><span>Jul 30, 2026</span></div>
        </div>
      </div>

      <div class="right-col">
        <div class="info-card vital-signs">
          <h3>Vital Signs</h3>
          <div class="vitals-grid">
            <div class="vital-item">
              <span class="vital-label">Heart Rate</span>
              <span class="vital-value">72 <small>bpm</small></span>
            </div>
            <div class="vital-item">
              <span class="vital-label">Blood Pressure</span>
              <span class="vital-value">130/85 <small>mmHg</small></span>
            </div>
            <div class="vital-item">
              <span class="vital-label">Temperature</span>
              <span class="vital-value">36.8 <small>°C</small></span>
            </div>
            <div class="vital-item">
              <span class="vital-label">SpO2</span>
              <span class="vital-value">97 <small>%</small></span>
            </div>
            <div class="vital-item">
              <span class="vital-label">Weight</span>
              <span class="vital-value">78.5 <small>kg</small></span>
            </div>
          </div>
        </div>

        <div class="info-card recent-alerts">
          <h3>Recent Alerts</h3>
          <div class="alert-item" v-for="a in patientAlerts" :key="a.level + a.date">
            <span class="alert-level" :class="a.level.toLowerCase()">{{ a.level }}</span>
            <span class="alert-desc">{{ a.description }}</span>
            <span class="alert-date">{{ a.date }}</span>
          </div>
        </div>

        <div class="info-card caregiver-msg">
          <h3>Messages from Caregiver</h3>
          <div class="msg-item">
            <p>Your lab results look good. Keep up with your diet plan.</p>
            <span class="msg-date">Yesterday</span>
          </div>
          <div class="msg-item">
            <p>Don't forget your medication before tomorrow's session.</p>
            <span class="msg-date">2 days ago</span>
          </div>
        </div>

        <div class="info-card history">
          <h3>Recent History</h3>
          <div class="history-item" v-for="h in patientHistory" :key="h.date">
            <span class="history-date">{{ h.date }}</span>
            <span class="history-type">{{ h.type }}</span>
            <span class="history-status" :class="h.status.toLowerCase()">{{ h.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const patientAlerts = [
  { level: 'Normal', date: '2026-07-25', description: 'Lab results within expected range.' },
  { level: 'Warning', date: '2026-07-22', description: 'Slight elevation in blood pressure (135/88).' },
];

const patientHistory = [
  { date: '2026-07-25', type: 'Hemodialysis', status: 'Completed' },
  { date: '2026-07-23', type: 'Hemodialysis', status: 'Completed' },
  { date: '2026-07-20', type: 'Consultation', status: 'Completed' },
];
</script>

<style scoped>
.patient-dashboard {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.patient-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
  align-items: start;
}

.left-col, .right-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
}

.info-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 14px;
}

.session-date {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px;
}

.session-time {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.confirmed {
  background: #ecfdf5;
  color: #059669;
}

.status-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
  color: #6b7280;
}

.status-row:last-child {
  border-bottom: none;
}

.stat-good {
  color: #059669;
  font-weight: 600;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  color: #374151;
}

.info-row .label {
  color: #9ca3af;
}

.vitals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.vital-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.vital-label {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
}

.vital-value {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.vital-value small {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-level {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.alert-level.normal {
  background: #ecfdf5;
  color: #059669;
}

.alert-level.warning {
  background: #fef3c7;
  color: #d97706;
}

.alert-level.critical {
  background: #fef2f2;
  color: #ef4444;
}

.alert-desc {
  flex: 1;
  color: #374151;
}

.alert-date {
  color: #9ca3af;
  font-size: 12px;
  flex-shrink: 0;
}

.msg-item {
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.msg-item:last-child {
  border-bottom: none;
}

.msg-item p {
  margin: 0 0 4px;
  font-size: 13px;
  color: #374151;
}

.msg-date {
  font-size: 12px;
  color: #9ca3af;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}

.history-item:last-child {
  border-bottom: none;
}

.history-date {
  color: #6b7280;
  min-width: 80px;
}

.history-type {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.history-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.history-status.completed {
  background: #ecfdf5;
  color: #059669;
}

.history-status.warning {
  background: #fef3c7;
  color: #d97706;
}
</style>
