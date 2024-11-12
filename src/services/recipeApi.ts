import axios from 'axios';
import type { Recipe } from '../types';
import { get, set } from 'idb-keyval';

const SPOONACULAR_API_KEY = 'YOUR_SPOONACULAR_API_KEY';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const api = axios.create({
  baseURL: 'https://api.spoonacular.com/recipes',
  params: {
    apiKey: SPOONACULAR_API_KEY
  }
});

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
}

async function getCachedData(key: string) {
  try {
    const cached = await get(key);
    if (cached && cached.timestamp + CACHE_DURATION > Date.now()) {
      return cached.data;
    }
    return null;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}

async function setCachedData(key: string, data: any) {
  try {
    await set(key, {
      data,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Cache error:', error);
  }
}

function mapSpoonacularToRecipe(data: SpoonacularRecipe): Recipe {
  const getNutrient = (name: string) => {
    const nutrient = data.nutrition.nutrients.find(n => n.name.toLowerCase() === name.toLowerCase());
    return nutrient ? nutrient.amount : 0;
  };

  return {
    id: data.id.toString(),
    name: data.title,
    image: data.image,
    cookingTime: data.readyInMinutes,
    difficulty: data.readyInMinutes > 45 ? 'Hard' : data.readyInMinutes > 30 ? 'Medium' : 'Easy',
    nutritionInfo: {
      calories: getNutrient('calories'),
      protein: getNutrient('protein'),
      carbs: getNutrient('carbohydrates'),
      fat: getNutrient('fat')
    }
  };
}

export async function searchRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
  const cacheKey = `recipes-${ingredients.sort().join('-')}`;
  
  try {
    // Check cache first
    const cachedRecipes = await getCachedData(cacheKey);
    if (cachedRecipes) {
      return cachedRecipes;
    }

    const response = await api.get('/complexSearch', {
      params: {
        includeIngredients: ingredients.join(','),
        addRecipeNutrition: true,
        number: 10
      }
    });

    const recipes = response.data.results.map(mapSpoonacularToRecipe);
    await setCachedData(cacheKey, recipes);
    return recipes;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        throw new Error('Daily API quota exceeded. Please try again tomorrow.');
      }
      if (error.response?.status === 401) {
        throw new Error('API authentication failed. Please check your API key.');
      }
    }
    throw new Error('Failed to fetch recipes. Please try again later.');
  }
}

export async function getRecipeDetails(recipeId: string): Promise<Recipe> {
  const cacheKey = `recipe-${recipeId}`;

  try {
    const cachedRecipe = await getCachedData(cacheKey);
    if (cachedRecipe) {
      return cachedRecipe;
    }

    const response = await api.get(`/${recipeId}/information`, {
      params: {
        includeNutrition: true
      }
    });

    const recipe = mapSpoonacularToRecipe(response.data);
    await setCachedData(cacheKey, recipe);
    return recipe;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Recipe not found.');
      }
    }
    throw new Error('Failed to fetch recipe details. Please try again later.');
  }
}