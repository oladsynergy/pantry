import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Recipe } from '../types';
import { getRecipeRecommendations } from '../services/mistraiApi';

export const useRecipeStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([]);
  const favoriteRecipes = ref<Recipe[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastSearchIngredients = ref<string[]>([]);

  async function fetchRecipes(ingredients: string[]) {
    if (ingredients.length === 0) {
      error.value = 'Please add at least one ingredient';
      return;
    }

    isLoading.value = true;
    error.value = null;
    lastSearchIngredients.value = ingredients;
    
    try {
      const recommendations = await getRecipeRecommendations(ingredients);
      recipes.value = recommendations;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch recipes. Please try again.';
      recipes.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  function addToFavorites(recipe: Recipe) {
    if (!favoriteRecipes.value.some(r => r.id === recipe.id)) {
      favoriteRecipes.value.push(recipe);
    }
  }

  function removeFromFavorites(recipeId: string) {
    favoriteRecipes.value = favoriteRecipes.value.filter(
      recipe => recipe.id !== recipeId
    );
  }

  return {
    recipes,
    favoriteRecipes,
    isLoading,
    error,
    lastSearchIngredients,
    fetchRecipes,
    addToFavorites,
    removeFromFavorites,
  };
});