<template>
  <router-view />
  <ToastProvider ref="toastRef" />
</template>

<script setup>
import { ref } from 'vue';
import ToastProvider from './components/ToastProvider.vue';

const toastRef = ref(null);

window.__toast = {
  success(title, message) {
    toastRef.value?.add('success', title, message);
  },
  error(title, message) {
    toastRef.value?.add('error', title, message);
  },
  info(title, message) {
    toastRef.value?.add('info', title, message);
  },
};
</script>
