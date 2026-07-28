<template>
  <slot v-if="allowed" />
  <slot v-else name="locked">
    <FeatureLockedCard
      v-if="showLocked"
      :title="lockTitle"
      @open-modal="$emit('openModal')"
    />
  </slot>
</template>

<script setup>
import { useSubscriptionStore } from '../stores/subscriptionStore';
import FeatureLockedCard from './FeatureLockedCard.vue';

const props = defineProps({
  feature: { type: String, required: true },
  showLocked: { type: Boolean, default: true },
  lockTitle: { type: String, default: '' },
});

defineEmits(['openModal']);

const sub = useSubscriptionStore();
const allowed = sub.can(props.feature);
</script>
