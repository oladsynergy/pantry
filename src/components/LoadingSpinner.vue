<script setup lang="ts">
defineProps<{
  size?: 'small' | 'medium' | 'large';
}>();
</script>

<template>
  <div class="spinner" :class="size || 'medium'"></div>
</template>

<style scoped>
.spinner {
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--secondary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.small {
  width: 20px;
  height: 20px;
}

.medium {
  width: 30px;
  height: 30px;
}

.large {
  width: 40px;
  height: 40px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>