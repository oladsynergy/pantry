import axios from 'axios';
import type { Recipe } from '../types';

const PEXELS_API_KEY = 'XRjreNkpfxe7jvdFrVl9rAGa71Nsrkhm9wHDd5ZFsTYb2nQ0beWJPXpH';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

const pexelsApi = axios.create({
  baseURL: PEXELS_API_URL,
  headers: {
    'Authorization': PEXELS_API_KEY
  }
});

const seasonings = [
  { name: 'fresh herbs', quantity: '2', unit: 'tbsp' },
  { name: 'minced garlic', quantity: '3', unit: 'cloves' },
  { name: 'grated ginger', quantity: '1', unit: 'tbsp' },
  { name: 'lemon zest', quantity: '1', unit: 'tsp' },
  { name: 'chili flakes', quantity: '1/2', unit: 'tsp' },
  { name: 'ground cumin', quantity: '1', unit: 'tsp' },
  { name: 'paprika', quantity: '1', unit: 'tsp' },
  { name: 'dried oregano', quantity: '1', unit: 'tsp' },
  { name: 'fresh basil', quantity: '1/4', unit: 'cup' },
  { name: 'soy sauce', quantity: '2', unit: 'tbsp' }
];

const cookingStyles = [
  'Pan-Seared',
  'Roasted',
  'Grilled',
  'Braised',
  'Stir-Fried',
  'Slow-Cooked',
  'Herb-Crusted',
  'Spice-Rubbed',
  'Glazed',
  'Caramelized'
];

async function getFoodImage(recipeName: string): Promise<string> {
  try {
    const response = await pexelsApi.get('', {
      params: {
        query: `${recipeName} food dish`,
        per_page: 15,
        orientation: 'landscape'
      }
    });
    
    if (response.data.photos && response.data.photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * response.data.photos.length);
      return response.data.photos[randomIndex].src.large;
    }
    return 'https://placehold.co/600x400/png?text=Recipe+Image';
  } catch (error) {
    console.error('Error fetching food image:', error);
    return 'https://placehold.co/600x400/png?text=Recipe+Image';
  }
}

function generateRecipeName(ingredients: string[]): string {
  const style = cookingStyles[Math.floor(Math.random() * cookingStyles.length)];
  const mainIngredient = ingredients[0];
  const secondaryIngredient = ingredients[1] ? ` with ${ingredients[1]}` : '';
  return `${style} ${mainIngredient}${secondaryIngredient}`;
}

function generateInstructions(ingredients: string[], seasoningChoices: typeof seasonings): string[] {
  const method = cookingStyles[Math.floor(Math.random() * cookingStyles.length)];
  const mainIngredient = ingredients[0];
  
  const instructions = [
    'Prepare all ingredients and measure out the quantities.',
    `Season ${mainIngredient} with ${seasoningChoices[0].name} and ${seasoningChoices[1].name}.`,
    `Heat your cooking vessel over medium-high heat.`,
    `${method} the ${mainIngredient} until perfectly cooked.`
  ];

  if (ingredients.length > 1) {
    instructions.push(`Add ${ingredients.slice(1).join(', ')} and cook until tender.`);
  }

  instructions.push(
    `Add ${seasoningChoices[2].name} and stir to combine.`,
    'Adjust seasoning to taste.',
    'Let rest for 2-3 minutes before serving.',
    'Garnish with fresh herbs and serve hot.'
  );

  return instructions;
}

function generateIngredients(mainIngredients: string[]): Array<{ id: string; name: string; quantity: string; unit: string }> {
  const selectedSeasonings = [...seasonings]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const recipeIngredients = mainIngredients.map((ing, index) => ({
    id: `main-${index + 1}`,
    name: ing,
    quantity: Math.floor(Math.random() * 300 + 100).toString(),
    unit: ['g', 'ml', 'pieces', 'cups'][Math.floor(Math.random() * 4)]
  }));

  return [
    ...recipeIngredients,
    ...selectedSeasonings.map((seasoning, index) => ({
      ...seasoning,
      id: `seasoning-${index + 1}`
    }))
  ];
}

function generateRecipe(ingredients: string[]): Recipe {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const cookingTimes = [15, 20, 25, 30, 35, 40, 45];
  
  const selectedSeasonings = [...seasonings]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  const recipeName = generateRecipeName(ingredients);
  const recipeIngredients = generateIngredients(ingredients);
  const instructions = generateInstructions(ingredients, selectedSeasonings);

  return {
    id: Date.now().toString(),
    name: recipeName,
    description: `A delightful ${recipeName.toLowerCase()} prepared with fresh ingredients and aromatic seasonings. Perfect for any occasion!`,
    cookingTime: cookingTimes[Math.floor(Math.random() * cookingTimes.length)],
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    ingredients: recipeIngredients,
    instructions,
    nutritionInfo: {
      calories: Math.floor(Math.random() * 400 + 200),
      protein: Math.floor(Math.random() * 30 + 10),
      carbs: Math.floor(Math.random() * 50 + 20),
      fat: Math.floor(Math.random() * 20 + 5)
    },
    image: ''
  };
}

export async function getRecipeRecommendations(ingredients: string[]): Promise<Recipe[]> {
  try {
    const recipes = Array.from({ length: 3 }, () => generateRecipe(ingredients));
    
    const recipesWithImages = await Promise.all(
      recipes.map(async (recipe) => {
        const imageUrl = await getFoodImage(recipe.name);
        return { ...recipe, image: imageUrl };
      })
    );

    return recipesWithImages;
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw new Error('Failed to generate recipes. Please try again.');
  }
}