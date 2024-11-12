import { ref } from 'vue';

const toast = ref<{ message: string; visible: boolean }>({
  message: '',
  visible: false
});

export function useToast() {
  function showToast(message: string, duration = 3000) {
    toast.value = { message, visible: true };
    setTimeout(() => {
      toast.value.visible = false;
    }, duration);
  }

  return {
    toast,
    showToast
  };
}