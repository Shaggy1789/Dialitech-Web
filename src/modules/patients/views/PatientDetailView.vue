<template>
  <div class="patient-detail-view">
    <PatientDetailHeader />

    <PatientProfileCard :patient="patient" />

    <div class="detail-grid">
      <div class="left-column">
        <PatientInfoCard title="Personal Information">
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Phone</span>
              <span class="info-value">{{ patient.phone }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ patient.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address</span>
              <span class="info-value">{{ patient.address }}</span>
            </div>
          </div>
        </PatientInfoCard>

        <PatientInfoCard title="Medical Information">
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Blood Type</span>
              <span class="info-value">{{ patient.bloodType }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Diagnosis</span>
              <span class="info-value">{{ patient.diagnosis }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Allergies</span>
              <span class="info-value">None reported</span>
            </div>
            <div class="info-row">
              <span class="info-label">Medical History</span>
              <span class="info-value">Hypertension · Type 2 Diabetes</span>
            </div>
          </div>
        </PatientInfoCard>

        <PatientInfoCard title="Current Treatment">
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Treatment Plan</span>
              <span class="info-value">{{ patient.treatment }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Start Date</span>
              <span class="info-value">2025-06-01</span>
            </div>
            <div class="info-row">
              <span class="info-label">Assigned Physician</span>
              <span class="info-value">{{ patient.doctor }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Treatment Duration</span>
              <span class="info-value">4 hours per session</span>
            </div>
          </div>
        </PatientInfoCard>

        <PatientInfoCard title="Medications">
          <div class="med-list">
            <div v-for="(med, index) in patient.medications" :key="index" class="med-item">
              <div class="med-info">
                <span class="med-name">{{ med.name }}</span>
                <span class="med-dosage">{{ med.dosage }}</span>
              </div>
              <span class="med-frequency">{{ med.frequency }}</span>
            </div>
          </div>
        </PatientInfoCard>

        <PatientInfoCard title="Emergency Contact">
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Name</span>
              <span class="info-value">{{ patient.emergencyContact.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Relationship</span>
              <span class="info-value">{{ patient.emergencyContact.relationship }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone</span>
              <span class="info-value">{{ patient.emergencyContact.phone }}</span>
            </div>
          </div>
        </PatientInfoCard>
      </div>

      <div class="right-column">
        <VitalSignsCard :vital-signs="patient.vitalSigns" />

        <PatientInfoCard title="Treatment Status">
          <div class="status-summary">
            <div class="status-stat">
              <span class="stat-value">87%</span>
              <span class="stat-label">Adherence Rate</span>
            </div>
            <div class="status-stat">
              <span class="stat-value">12/12</span>
              <span class="stat-label">Sessions this month</span>
            </div>
            <div class="status-stat">
              <span class="stat-value">Stable</span>
              <span class="stat-label">Current Condition</span>
            </div>
          </div>
        </PatientInfoCard>

        <PatientInfoCard title="Recent Biometrics">
          <div class="bio-list">
            <div class="bio-item">
              <span class="bio-label">eGFR</span>
              <span class="bio-value">38 mL/min</span>
            </div>
            <div class="bio-item">
              <span class="bio-label">Creatinine</span>
              <span class="bio-value">1.8 mg/dL</span>
            </div>
            <div class="bio-item">
              <span class="bio-label">Potassium</span>
              <span class="bio-value">5.8 mEq/L</span>
            </div>
            <div class="bio-item">
              <span class="bio-label">Hemoglobin</span>
              <span class="bio-value">10.2 g/dL</span>
            </div>
          </div>
        </PatientInfoCard>
      </div>
    </div>

    <div class="full-width-section">
      <PatientHistory :history="patient.history" />
    </div>

    <div class="full-width-section">
      <PatientAlerts :alerts="patient.alerts" />
    </div>
  </div>
</template>

<script setup>
import { patient } from '../data/patientDetail.js';
import PatientDetailHeader from '../components/detail/PatientDetailHeader.vue';
import PatientProfileCard from '../components/detail/PatientProfileCard.vue';
import PatientInfoCard from '../components/detail/PatientInfoCard.vue';
import VitalSignsCard from '../components/detail/VitalSignsCard.vue';
import PatientHistory from '../components/detail/PatientHistory.vue';
import PatientAlerts from '../components/detail/PatientAlerts.vue';
</script>

<style scoped>
.patient-detail-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
  margin-bottom: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.full-width-section {
  margin-bottom: 24px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.info-label {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  min-width: 110px;
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.med-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.med-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.med-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.med-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.med-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.med-dosage {
  font-size: 12px;
  color: #6b7280;
}

.med-frequency {
  font-size: 12px;
  font-weight: 500;
  color: #2563eb;
  background: #eff6ff;
  padding: 4px 10px;
  border-radius: 6px;
}

.status-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.status-stat {
  text-align: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 500;
}

.bio-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bio-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.bio-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.bio-label {
  font-size: 13px;
  color: #6b7280;
}

.bio-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}
</style>
