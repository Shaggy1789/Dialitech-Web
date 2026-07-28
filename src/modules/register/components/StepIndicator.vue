<template>
  <div class="step-indicator">
    <div class="step-dots">
      <div class="dot active" />
      <div class="dot-line" :class="{ filled: currentStep === 2 }" />
      <div class="dot" :class="{ active: currentStep === 2 }" />
    </div>
    <p class="step-text">Step {{ currentStep }} of 2</p>
  </div>
</template>

<script setup>
defineProps({
  currentStep: { type: Number, required: true },
});
</script>

<style scoped>
.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.step-dots {
  display: flex;
  align-items: center;
  gap: 0;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e5e7eb;
  transition: background 0.25s;
  flex-shrink: 0;
}

.dot.active {
  background: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.dot-line {
  width: 48px;
  height: 2px;
  background: #e5e7eb;
  transition: background 0.25s;
}

.dot-line.filled {
  background: #2563eb;
}

.step-text {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  margin: 0;
}
</style>
