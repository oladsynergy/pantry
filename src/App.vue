<script setup lang="ts">
import { ref } from 'vue';
import IngredientSearch from './components/IngredientSearch.vue';
import RecipeCard from './components/RecipeCard.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import Toast from './components/Toast.vue';
import FeedbackForm from './components/FeedbackForm.vue';
import { useRecipeStore } from './stores/recipes';

const recipeStore = useRecipeStore();
const showFeedback = ref(false);

async function handleSearch(ingredients: string[]) {
  await recipeStore.fetchRecipes(ingredients);
}

async function handleRefresh() {
  if (recipeStore.lastSearchIngredients.length > 0) {
    await recipeStore.fetchRecipes(recipeStore.lastSearchIngredients);
  }
}

function toggleFeedback() {
  showFeedback.value = !showFeedback.value;
}
</script>

<template>
  <div class="app">
    <Toast />
    <header>
      <div class="header-content">
        <h1>🥘 Pantry Chef</h1>
        <p>Find delicious recipes with ingredients you already have!</p>
      </div>
    </header>

    <main>
      <IngredientSearch @search="handleSearch" />
      
      <div v-if="recipeStore.isLoading" class="loading-container">
        <LoadingSpinner size="large" />
        <p>Finding the perfect recipes for you...</p>
      </div>

      <div v-else-if="recipeStore.error" class="error-message">
        {{ recipeStore.error }}
      </div>
      
      <div v-else-if="recipeStore.recipes.length" class="recipes-container">
        <div class="recipes-header">
          <h2>Your Recipes</h2>
          <button @click="handleRefresh" class="refresh-btn">
            🔄 Refresh Recipes
          </button>
        </div>
        <div class="recipes-grid">
          <RecipeCard
            v-for="recipe in recipeStore.recipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>
      </div>
      
      <div v-else class="no-recipes">
        <p>Ready to cook something amazing?</p>
        <p class="subtitle">Enter your ingredients above to discover recipes!</p>
      </div>

      <button @click="toggleFeedback" class="feedback-toggle-btn">
        {{ showFeedback ? 'Close Feedback' : '💭 Send Feedback' }}
      </button>

      <FeedbackForm v-if="showFeedback" />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  background-color: var(--background-color);

  header {
    background-color: var(--primary-color);
    padding: 40px 20px;
    text-align: center;

    .header-content {
      max-width: 800px;
      margin: 0 auto;

      h1 {
        color: white;
        margin: 0;
        font-size: 2.5em;
        margin-bottom: 10px;
      }

      p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.2em;
      }
    }
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 40px;

    p {
      color: var(--text-color);
      opacity: 0.8;
    }
  }

  .error-message {
    text-align: center;
    color: var(--accent-color);
    margin-top: 40px;
    padding: 20px;
    background-color: var(--card-background);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .recipes-container {
    margin-top: 40px;

    .recipes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h2 {
        color: var(--primary-color);
        font-size: 1.8em;
        margin: 0;
      }

      .refresh-btn {
        background-color: var(--secondary-color);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        transition: var(--button-transition);

        &:hover {
          transform: var(--button-hover-transform);
          background-color: var(--hover-color);
        }

        &:active {
          transform: var(--button-active-transform);
        }
      }
    }
  }

  .recipes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 30px;
  }

  .no-recipes {
    text-align: center;
    margin-top: 60px;
    color: var(--text-color);

    p {
      font-size: 1.4em;
      margin-bottom: 10px;
    }

    .subtitle {
      font-size: 1.1em;
      opacity: 0.7;
    }
  }

  .feedback-toggle-btn {
    display: block;
    margin: 40px auto;
    padding: 12px 24px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: var(--button-transition);

    &:hover {
      transform: var(--button-hover-transform);
      background-color: #1a1e1f;
    }

    &:active {
      transform: var(--button-active-transform);
    }
  }
}

@media (max-width: 768px) {
  .app {
    header {
      padding: 30px 20px;

      .header-content {
        h1 {
          font-size: 2em;
        }

        p {
          font-size: 1em;
        }
      }
    }

    main {
      padding: 20px;
    }

    .recipes-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
}
</style>