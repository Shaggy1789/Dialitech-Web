<template>
  <div class="type-card" @click="$emit('click')">
    <div class="card-icon">
      <slot name="icon" />
    </div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-desc">{{ description }}</p>
    <button class="card-btn">{{ buttonText }}</button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  buttonText: { type: String, required: true },
  type: { type: String, required: true },
});

defineEmits(['click']);
</script>

<style scoped>
.type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 20px 24px;
  background: #ffffff;
  border: 1.5px solid #f3f4f6;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.type-card:hover {
  border-color: #dbeafe;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.card-icon {
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.card-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.card-btn {
  width: 100%;
  padding: 10px 16px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.type-card:hover .card-btn {
  background: #2563eb;
  color: #ffffff;
}
</style>
