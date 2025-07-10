<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth';

export default {
  name: 'ReactionButtons',
  props: {
    reactions: {
      type: Object,
      default: () => ({ like: 0, dislike: 0 })
    }
  },
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const userReactions = ref({});

    const toggleReaction = (type) => {
      if (!authStore.isAuthenticated) {
        // Mostrar mensaje para iniciar sesión
        return;
      }

      // Si ya reaccionó, quitar la reacción
      if (userReactions.value[type]) {
        userReactions.value[type] = false;
        emit('reaction', type, 'remove');
      } else {
        // Agregar reacción
        userReactions.value[type] = true;
        emit('reaction', type, 'add');
      }
    };

    onMounted(() => {
      // Aquí podrías cargar las reacciones del usuario desde una API
      // Por ahora dejamos vacío para simulación
    });

    return {
      userReactions,
      toggleReaction
    };
  }
};
</script>

<template>
  <div class="reaction-buttons flex align-items-center">
    <Button 
      type="button"
      :class="['p-button-text p-button-rounded mr-2', { 'p-button-outlined': userReactions.like }]"
      @click.stop="toggleReaction('like')"
    >
      <template #icon>
        <i class="pi pi-thumbs-up mr-1"></i>
      </template>
      <span>{{ reactions?.like || 0 }}</span>
    </Button>

    <Button 
      type="button"
      :class="['p-button-text p-button-rounded', { 'p-button-outlined': userReactions.dislike }]"
      @click.stop="toggleReaction('dislike')"
    >
      <template #icon>
        <i class="pi pi-thumbs-down mr-1"></i>
      </template>
      <span>{{ reactions?.dislike || 0 }}</span>
    </Button>
  </div>
</template>

<style scoped>
.reaction-buttons {
  user-select: none;
}
</style>
