<script>
import { useAuthStore } from '../../../stores/auth';
import CreatePostForm from '../components/create-post-form.component.vue';

export default {
  name: 'CreatePostPage',
  components: {
    CreatePostForm
  },
  setup() {
    const authStore = useAuthStore();

    return {
      isAuthenticated: authStore.isAuthenticated
    };
  }
};
</script>

<template>
  <div class="create-post-page">
    <div class="page-header mb-4">
      <h1>Foro de la comunidad</h1>
      <p class="subtitle">Comparte tus ideas con los vecinos</p>
    </div>

    <!-- Formulario de creación de post simplificado -->
    <CreatePostForm />
  </div>
</template>

<style scoped>
.create-post-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.page-header h1 {
  color: var(--primary-color);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-color-secondary);
  font-size: 1rem;
}
</style>
