export interface User {
  id: string;
  username: string;
  email: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
  spiceLevel: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionInfo: NutritionInfo;
  image: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}