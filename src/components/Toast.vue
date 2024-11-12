<script setup lang="ts">
import { useToast } from '../composables/useToast';

const { toast } = useToast();
</script>

<template>
  <Transition name="toast">
    <div v-if="toast.visible" class="toast">
      {{ toast.message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--secondary-color);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 2000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>