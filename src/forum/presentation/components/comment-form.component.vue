<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

export default {
  name: 'CommentForm',
  components: {
    Textarea,
    Button
  },
  setup(props, { emit }) {
    const toast = useToast();
    const content = ref('');
    const submitting = ref(false);

    const submitComment = () => {
      if (!content.value.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Comentario vacío',
          detail: 'Por favor escribe algo antes de enviar',
          life: 3000
        });
        return;
      }

      submitting.value = true;

      // Emitir el comentario al componente padre
      emit('submit', { content: content.value.trim() });

      // Limpiar el campo y resetear estado
      content.value = '';
      submitting.value = false;
    };

    return {
      content,
      submitting,
      submitComment
    };
  }
};
</script>

<template>
  <div class="comment-form mb-4 p-3 border-1 border-300 border-round">
    <h4 class="form-title mb-2">Deja tu comentario</h4>

    <Textarea 
      v-model="content" 
      rows="3"
      class="w-full mb-3"
      placeholder="Escribe tu comentario..."
      autoResize
    />

    <div class="text-right">
      <Button 
        label="Comentar" 
        icon="pi pi-send"
        @click="submitComment"
        :loading="submitting"
      />
    </div>
  </div>
</template>

<style scoped>
.comment-form {
  background-color: var(--surface-0);
}

.form-title {
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
