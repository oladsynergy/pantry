<script setup lang="ts">
import { ref } from 'vue';
import type { Recipe } from '../types';
import { useRecipeStore } from '../stores/recipes';
import RecipeModal from './RecipeModal.vue';

const props = defineProps<{
  recipe: Recipe;
}>();

const recipeStore = useRecipeStore();
const showModal = ref(false);
const imageError = ref(false);

function toggleFavorite() {
  const isFavorite = recipeStore.favoriteRecipes.some(r => r.id === props.recipe.id);
  if (isFavorite) {
    recipeStore.removeFromFavorites(props.recipe.id);
  } else {
    recipeStore.addToFavorites(props.recipe);
  }
}

function openRecipe() {
  showModal.value = true;
}

function handleImageError() {
  imageError.value = true;
}
</script>

<template>
  <div class="recipe-card">
    <div class="image-container">
      <img
        :src="imageError ? 'https://placehold.co/600x400/png?text=Recipe+Image' : recipe.image"
        :alt="recipe.name"
        class="recipe-image"
        @error="handleImageError"
      />
      <button @click="toggleFavorite" class="favorite-btn">
        {{ recipeStore.favoriteRecipes.some(r => r.id === recipe.id) ? '❤️' : '🤍' }}
      </button>
    </div>
    <div class="recipe-content">
      <h3>{{ recipe.name }}</h3>
      <p class="description">{{ recipe.description }}</p>
      <div class="recipe-meta">
        <span class="meta-item">
          <span class="icon">🕒</span>
          {{ recipe.cookingTime }} mins
        </span>
        <span class="meta-item">
          <span class="icon">📊</span>
          {{ recipe.difficulty }}
        </span>
      </div>
      <div class="nutrition-info">
        <div class="nutrition-item">
          <span class="label">Calories</span>
          <span class="value">{{ recipe.nutritionInfo.calories }}</span>
        </div>
        <div class="nutrition-item">
          <span class="label">Protein</span>
          <span class="value">{{ recipe.nutritionInfo.protein }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="label">Carbs</span>
          <span class="value">{{ recipe.nutritionInfo.carbs }}g</span>
        </div>
      </div>
      <button @click="openRecipe" class="view-recipe-btn">
        View Recipe
      </button>
    </div>
  </div>

  <RecipeModal
    :recipe="recipe"
    :show="showModal"
    @close="showModal = false"
  />
</template>

<style scoped lang="scss">
.recipe-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--card-background);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: var(--button-transition);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }

  .image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
    background-color: #f0f0f0;

    .recipe-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--button-transition);
    }

    &:hover .recipe-image {
      transform: scale(1.05);
    }

    .favorite-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2em;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1;

      &:hover {
        transform: var(--button-hover-transform);
        background: white;
      }

      &:active {
        transform: var(--button-active-transform);
      }
    }
  }

  .recipe-content {
    padding: 20px;

    h3 {
      color: var(--primary-color);
      font-size: 1.4em;
      margin-bottom: 10px;
    }

    .description {
      color: var(--text-color);
      opacity: 0.8;
      margin-bottom: 15px;
      font-size: 0.95em;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .recipe-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9em;
        color: var(--text-color);
        opacity: 0.8;

        .icon {
          font-size: 1.2em;
        }
      }
    }

    .nutrition-info {
      display: flex;
      justify-content: space-between;
      padding-top: 15px;
      margin-bottom: 15px;
      border-top: 1px solid var(--border-color);

      .nutrition-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .label {
          font-size: 0.8em;
          color: var(--text-color);
          opacity: 0.7;
        }

        .value {
          font-weight: 600;
          color: var(--secondary-color);
        }
      }
    }
  }

  .view-recipe-btn {
    width: 100%;
    padding: 12px;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1em;

    &:hover {
      background-color: var(--hover-color);
      transform: var(--button-hover-transform);
    }

    &:active {
      transform: var(--button-active-transform);
    }
  }
}
</style>