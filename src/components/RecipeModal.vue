<script setup lang="ts">
import { ref } from 'vue';
import type { Recipe } from '../types';
import { useToast } from '../composables/useToast';

const props = defineProps<{
  recipe: Recipe;
  show: boolean;
}>();

const emit = defineEmits(['close']);
const { showToast } = useToast();

function close() {
  emit('close');
}

function copyRecipe() {
  const recipeText = `
${props.recipe.name}

Ingredients:
${props.recipe.ingredients.map(ing => `- ${ing.quantity} ${ing.unit} ${ing.name}`).join('\n')}

Instructions:
${props.recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Nutrition Info:
- Calories: ${props.recipe.nutritionInfo.calories}
- Protein: ${props.recipe.nutritionInfo.protein}g
- Carbs: ${props.recipe.nutritionInfo.carbs}g
- Fat: ${props.recipe.nutritionInfo.fat}g
`;

  navigator.clipboard.writeText(recipeText).then(() => {
    showToast('Recipe copied to clipboard!');
  });
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="close">&times;</button>
        <button class="copy-btn" @click="copyRecipe">
          📋 Copy Recipe
        </button>
        
        <h2>{{ recipe.name }}</h2>
        
        <div class="recipe-details">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
              {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
            </li>
          </ul>

          <h3>Instructions</h3>
          <ol class="instructions-list">
            <li v-for="(step, index) in recipe.instructions" :key="index">
              {{ step }}
            </li>
          </ol>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  h2 {
    color: var(--primary-color);
    font-size: 1.8em;
    margin-bottom: 20px;
    padding-right: 40px;
  }

  h3 {
    color: var(--primary-color);
    font-size: 1.4em;
    margin: 20px 0 10px;
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-color);
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
}

.copy-btn {
  position: absolute;
  top: 20px;
  right: 60px;
  background: var(--secondary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--button-transition);

  &:hover {
    transform: var(--button-hover-transform);
    background-color: var(--hover-color);
  }

  &:active {
    transform: var(--button-active-transform);
  }
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;

  li {
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-color);
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.instructions-list {
  padding-left: 20px;
  margin-bottom: 20px;

  li {
    margin-bottom: 15px;
    line-height: 1.6;
    color: var(--text-color);
  }
}
</style>