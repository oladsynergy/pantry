import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const isAuthenticated = ref(false);

  function setUser(user: User) {
    currentUser.value = user;
    isAuthenticated.value = true;
  }

  function logout() {
    currentUser.value = null;
    isAuthenticated.value = false;
  }

  return {
    currentUser,
    isAuthenticated,
    setUser,
    logout,
  };
});