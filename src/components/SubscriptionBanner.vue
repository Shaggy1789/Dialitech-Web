<template>
  <div class="sub-banner" :class="bannerClass">
    <div class="banner-content">
      <div class="banner-text">
        <strong>{{ title }}</strong>
        <p>{{ description }}</p>
      </div>
      <button v-if="showUpgrade" class="upgrade-btn" @click="$emit('upgrade')">
        Upgrade Plan
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  plan: { type: String, default: 'free' },
  showUpgrade: { type: Boolean, default: true },
});

defineEmits(['upgrade']);

const title = computed(() => {
  if (props.plan === 'free') return "You're currently using the Free Plan";
  if (props.plan === 'basic') return 'Basic Plan';
  if (props.plan === 'professional') return 'Professional Plan';
  return 'Enterprise Plan';
});

const description = computed(() => {
  if (props.plan === 'free') return 'Upgrade to unlock all features including real-time monitoring, advanced analytics, and unlimited patients.';
  if (props.plan === 'basic') return 'You have access to essential tools. Upgrade to Professional for advanced monitoring and analytics.';
  if (props.plan === 'professional') return 'You have access to all features. Contact sales for Enterprise customizations.';
  return 'You have full access to all features.';
});

const bannerClass = computed(() => `sub-${props.plan}`);
</script>

<style scoped>
.sub-banner {
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.sub-free {
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.sub-basic {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.sub-professional {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
}

.sub-enterprise {
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.banner-text strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.banner-text p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.upgrade-btn {
  flex-shrink: 0;
  padding: 8px 18px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.upgrade-btn:hover {
  background: #1d4ed8;
}
</style>
