<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '../composables/useToast';

const { showToast } = useToast();

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);

async function submitFeedback() {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    showToast('Please fill in all required fields');
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });

    if (!response.ok) throw new Error('Failed to send feedback');

    showToast('Thank you for your feedback!');
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  } catch (error) {
    showToast('Failed to send feedback. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="feedback-form">
    <h2>Send Us Feedback</h2>
    <p class="subtitle">We'd love to hear your thoughts and suggestions!</p>

    <form @submit.prevent="submitFeedback">
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          placeholder="Your name"
        />
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          placeholder="Your email"
        />
      </div>

      <div class="form-group">
        <label for="subject">Subject</label>
        <input
          id="subject"
          v-model="formData.subject"
          type="text"
          placeholder="Subject of your feedback"
        />
      </div>

      <div class="form-group">
        <label for="message">Message *</label>
        <textarea
          id="message"
          v-model="formData.message"
          required
          placeholder="Your feedback message"
          rows="4"
        ></textarea>
      </div>

      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        <span v-if="!isSubmitting">Send Feedback</span>
        <span v-else>Sending...</span>
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.feedback-form {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  h2 {
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 10px;
  }

  .subtitle {
    text-align: center;
    color: var(--text-color);
    opacity: 0.8;
    margin-bottom: 30px;
  }

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-color);
      font-weight: 500;
    }

    input,
    textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1em;
      transition: var(--button-transition);

      &:focus {
        outline: none;
        border-color: var(--secondary-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }
  }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1.1em;
    transition: var(--button-transition);

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
</style>