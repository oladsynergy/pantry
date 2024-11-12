<script setup lang="ts">
import { ref } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';

const ingredients = ref<string[]>([]);
const searchInput = ref('');
const isLoading = ref(false);

const emit = defineEmits(['search']);

function addIngredient() {
  const ingredient = searchInput.value.trim().toLowerCase();
  if (ingredient && !ingredients.value.includes(ingredient)) {
    ingredients.value.push(ingredient);
    searchInput.value = '';
  }
}

function removeIngredient(index: number) {
  ingredients.value.splice(index, 1);
}

async function searchRecipes() {
  if (ingredients.value.length === 0) return;
  
  isLoading.value = true;
  try {
    await emit('search', ingredients.value);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="ingredient-search">
    <h2>What's in your pantry?</h2>
    <div class="search-container">
      <input
        v-model="searchInput"
        type="text"
        placeholder="Enter an ingredient"
        @keyup.enter="addIngredient"
      />
      <button @click="addIngredient" class="add-btn" :disabled="!searchInput.trim()">
        Add
      </button>
    </div>
    
    <div class="ingredients-list">
      <div v-for="(ingredient, index) in ingredients" :key="index" class="ingredient-tag">
        {{ ingredient }}
        <button @click="removeIngredient(index)" class="remove-btn">&times;</button>
      </div>
    </div>

    <button 
      @click="searchRecipes"
      :disabled="ingredients.length === 0 || isLoading"
      class="search-btn"
    >
      <span v-if="!isLoading">Find Recipes</span>
      <LoadingSpinner v-else size="small" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.ingredient-search {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: var(--primary-color);
    font-size: 1.8em;
  }
}

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 12px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1em;
    transition: var(--button-transition);

    &:focus {
      outline: none;
      border-color: var(--secondary-color);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  .add-btn {
    padding: 12px 24px;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;

    &:hover:not(:disabled) {
      transform: var(--button-hover-transform);
      background-color: var(--hover-color);
    }

    &:active:not(:disabled) {
      transform: var(--button-active-transform);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.ingredients-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  min-height: 40px;
}

.ingredient-tag {
  background-color: var(--secondary-color);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  transition: var(--button-transition);

  &:hover {
    transform: var(--button-hover-transform);
  }

  .remove-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0 4px;
    font-size: 1.2em;
    opacity: 0.8;
    transition: var(--button-transition);

    &:hover {
      opacity: 1;
      transform: rotate(90deg);
    }
  }
}

.search-btn {
  width: 100%;
  padding: 14px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled):hover {
    transform: var(--button-hover-transform);
    background-color: #1a1e1f;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:not(:disabled):active {
    transform: var(--button-active-transform);
  }
}
</style>