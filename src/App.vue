<template>
  <router-view />
  <ToastProvider ref="toastRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ToastProvider from './components/ToastProvider.vue';
import { useAppearanceStore } from './stores/appearanceStore';

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

onMounted(() => {
  const store = useAppearanceStore();
  store.applyAll();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (store.theme === 'system') {
      store.applyTheme('system');
    }
  });
});
</script>
