<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import Button from 'primevue/button';

export default {
  name: 'ForumLayout',
  components: {
    Button
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const goToNewPost = () => {
      router.push('/forum/new');
    };

    return {
      isAuthenticated,
      goToNewPost
    };
  }
};
</script>

<template>
  <div class="forum-layout">
    <!-- Cabecera del foro -->
    <div class="forum-header mb-4 flex justify-content-between align-items-center">
      <div class="forum-title">
        <h1 class="m-0">Foro de la comunidad</h1>
        <p class="text-500 mt-1 mb-0">Conecta y comparte con tus vecinos</p>
      </div>

      <!-- Botón para crear un nuevo post -->
      <div v-if="isAuthenticated" class="forum-actions">
        <Button 
          label="Nuevo post" 
          icon="pi pi-plus" 
          @click="goToNewPost"
        />
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="forum-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.forum-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.forum-title h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-color);
}
.forum-content {
  background-color: var(--surface-0);
  border-radius: 8px;
  padding: 1.5rem;
}
</style>
