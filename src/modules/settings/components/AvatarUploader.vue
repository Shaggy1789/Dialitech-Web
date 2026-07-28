<template>
  <div class="avatar-uploader">
    <div class="avatar-preview">
      <img v-if="previewUrl" :src="previewUrl" alt="User avatar" class="avatar-img" />
      <div v-else class="avatar-placeholder">
        <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="6" r="3.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M3 17.5C3 14.462 6.134 12 10 12C13.866 12 17 14.462 17 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
    </div>
    <button class="upload-btn" @click="triggerUpload">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <path d="M4 6L8 2L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M2 12V13.5C2 14.328 2.672 15 3.5 15H12.5C13.328 15 14 14.328 14 13.5V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      {{ previewUrl ? 'Change Photo' : 'Upload Photo' }}
    </button>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="file-input"
      @change="onFileSelected"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const previewUrl = ref(null);
const fileInput = ref(null);

function triggerUpload() {
  fileInput.value?.click();
}

function onFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    previewUrl.value = ev.target.result;
  };
  reader.readAsDataURL(file);
}
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e5e7eb;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: #9ca3af;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.upload-btn:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.file-input {
  display: none;
}
</style>
