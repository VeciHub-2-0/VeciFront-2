<script>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '../../../stores/auth';
import { CommentService } from '../../application/services/comment.service';

export default {
  name: 'CommentList',
  props: {
    comments: {
      type: Array,
      default: () => []
    },
    postId: {
      type: [Number, String],
      required: true
    }
  },
  setup(props, { emit }) {
    const toast = useToast();
    const authStore = useAuthStore();
    const commentService = new CommentService();

    const editingCommentId = ref(null);
    const editCommentContent = ref('');
    const replyingToId = ref(null);
    const replyContent = ref('');
    const processingCommentId = ref(null);

    // Estructurar comentarios en árbol (para respuestas)
    const commentTree = computed(() => {
      const tree = [];
      const lookup = {};

      // Primero crear lookup de todos los comentarios
      props.comments.forEach(comment => {
        lookup[comment.id] = {
          ...comment,
          children: []
        };
      });

      // Luego organizar en árbol
      props.comments.forEach(comment => {
        if (comment.parentId) {
          // Si tiene padre, agregar como hijo
          if (lookup[comment.parentId]) {
            lookup[comment.parentId].children.push(lookup[comment.id]);
          } else {
            // Si no encuentra el padre, agregar al nivel principal
            tree.push(lookup[comment.id]);
          }
        } else {
          // Comentarios de nivel principal
          tree.push(lookup[comment.id]);
        }
      });

      return tree;
    });

    // Formatear fecha
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    // Iniciar edición de comentario
    const startEditing = (comment) => {
      editingCommentId.value = comment.id;
      editCommentContent.value = comment.content;
    };

    // Cancelar edición
    const cancelEditing = () => {
      editingCommentId.value = null;
      editCommentContent.value = '';
    };

    // Guardar edición
    const saveEdit = async (commentId) => {
      if (!editCommentContent.value.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Comentario vacío',
          detail: 'El comentario no puede estar vacío',
          life: 3000
        });
        return;
      }

      processingCommentId.value = commentId;

      try {
        await commentService.updateComment(
          commentId,
          { content: editCommentContent.value.trim() },
          {
            id: authStore.currentUser.id,
            isAdmin: authStore.isAdmin
          }
        );

        // Notificar al componente padre para actualizar comentarios
        emit('update');

        // Resetear estados
        editingCommentId.value = null;
        editCommentContent.value = '';

        toast.add({
          severity: 'success',
          summary: 'Comentario actualizado',
          detail: 'Tu comentario ha sido actualizado correctamente',
          life: 3000
        });
      } catch (err) {
        console.error('Error al actualizar comentario:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el comentario',
          life: 3000
        });
      } finally {
        processingCommentId.value = null;
      }
    };

    // Eliminar comentario
    const deleteComment = async (commentId) => {
      if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        return;
      }

      processingCommentId.value = commentId;

      try {
        await commentService.deleteComment(commentId, {
          id: authStore.currentUser.id,
          isAdmin: authStore.isAdmin
        });

        // Notificar al componente padre para actualizar comentarios
        emit('update');

        toast.add({
          severity: 'success',
          summary: 'Comentario eliminado',
          detail: 'El comentario ha sido eliminado correctamente',
          life: 3000
        });
      } catch (err) {
        console.error('Error al eliminar comentario:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el comentario',
          life: 3000
        });
      } finally {
        processingCommentId.value = null;
      }
    };

    // Iniciar respuesta
    const startReply = (commentId) => {
      replyingToId.value = commentId;
      replyContent.value = '';
    };

    // Cancelar respuesta
    const cancelReply = () => {
      replyingToId.value = null;
      replyContent.value = '';
    };

    // Enviar respuesta
    const submitReply = async (parentId) => {
      if (!replyContent.value.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Respuesta vacía',
          detail: 'Por favor escribe algo antes de enviar',
          life: 3000
        });
        return;
      }

      processingCommentId.value = parentId;

      try {
        await commentService.createComment(
          {
            postId: props.postId,
            parentId,
            content: replyContent.value.trim()
          },
          {
            id: authStore.currentUser.id,
            name: authStore.currentUser.name
          }
        );

        // Notificar al componente padre para actualizar comentarios
        emit('update');

        // Resetear estados
        replyingToId.value = null;
        replyContent.value = '';

        toast.add({
          severity: 'success',
          summary: 'Respuesta enviada',
          detail: 'Tu respuesta ha sido publicada correctamente',
          life: 3000
        });
      } catch (err) {
        console.error('Error al enviar respuesta:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo publicar tu respuesta',
          life: 3000
        });
      } finally {
        processingCommentId.value = null;
      }
    };

    // Verificar si el usuario puede editar/eliminar
    const canModifyComment = (comment) => {
      if (!authStore.currentUser) return false;
      return comment.authorId === authStore.currentUser.id || authStore.isAdmin;
    };

    return {
      commentTree,
      formatDate,
      editingCommentId,
      editCommentContent,
      replyingToId,
      replyContent,
      processingCommentId,
      startEditing,
      cancelEditing,
      saveEdit,
      deleteComment,
      startReply,
      cancelReply,
      submitReply,
      canModifyComment
    };
  }
};
</script>

<template>
  <div class="comment-list">
    <div v-if="comments.length === 0" class="text-center p-3 text-500">
      No hay comentarios todavía. ¡Sé el primero en comentar!
    </div>

    <div v-else class="comments-container">
      <!-- Comentarios de nivel principal -->
      <div 
        v-for="comment in commentTree" 
        :key="comment.id"
        class="comment mb-3 p-3 border-1 border-300 border-round"
      >
        <!-- Cabecera del comentario -->
        <div class="comment-header flex justify-content-between align-items-center mb-2">
          <div class="author-info flex align-items-center">
            <Avatar 
              :label="comment.authorName?.charAt(0).toUpperCase() || 'U'"
              shape="circle"
              class="mr-2"
              size="small"
            />
            <span class="font-semibold">{{ comment.authorName }}</span>
          </div>
          <span class="text-sm text-500">{{ formatDate(comment.createdAt) }}</span>
        </div>

        <!-- Contenido del comentario (modo edición) -->
        <div v-if="editingCommentId === comment.id" class="comment-edit mb-2">
          <Textarea 
            v-model="editCommentContent" 
            rows="3"
            class="w-full mb-2"
            autoResize
          />
          <div class="flex justify-content-end gap-2">
            <Button 
              label="Cancelar" 
              class="p-button-text"
              @click="cancelEditing"
              :disabled="processingCommentId === comment.id"
            />
            <Button 
              label="Guardar" 
              @click="saveEdit(comment.id)"
              :loading="processingCommentId === comment.id"
            />
          </div>
        </div>

        <!-- Contenido del comentario (modo normal) -->
        <div v-else class="comment-content mb-2">
          <p class="m-0 whitespace-pre-line">{{ comment.content }}</p>

          <div v-if="comment.updatedAt" class="text-xs text-500 mt-1">
            (Editado el {{ formatDate(comment.updatedAt) }})
          </div>
        </div>
<script>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '../../../stores/auth';
import { CommentService } from '../../application/services/comment.service';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

export default {
  name: 'CommentList',
  components: {
    Avatar,
    Button,
    Textarea
  },
  props: {
    comments: {
      type: Array,
      default: () => []
    },
    postId: {
      type: [Number, String],
      required: true
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const toast = useToast();
    const authStore = useAuthStore();
    const commentService = new CommentService();

    const editingCommentId = ref(null);
    const editCommentContent = ref('');
    const replyingToId = ref(null);
    const replyContent = ref('');
    const processingCommentId = ref(null);

    // Estructurar comentarios en árbol (para respuestas)
    const commentTree = computed(() => {
      const tree = [];
      const lookup = {};

      // Primero crear lookup de todos los comentarios
      props.comments.forEach(comment => {
        lookup[comment.id] = {
          ...comment,
          children: []
        };
      });

      // Luego organizar en árbol
      props.comments.forEach(comment => {
        if (comment.parentId) {
          // Si tiene padre, agregar como hijo
          if (lookup[comment.parentId]) {
            lookup[comment.parentId].children.push(lookup[comment.id]);
          } else {
            // Si no encuentra el padre, agregar al nivel principal
            tree.push(lookup[comment.id]);
          }
        } else {
          // Comentarios de nivel principal
          tree.push(lookup[comment.id]);
        }
      });

      return tree;
    });

    // Formatear fecha
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    // Iniciar edición de comentario
    const startEditing = (comment) => {
      editingCommentId.value = comment.id;
      editCommentContent.value = comment.content;
    };

    // Cancelar edición
    const cancelEditing = () => {
      editingCommentId.value = null;
      editCommentContent.value = '';
    };

    // Guardar edición
    const saveEdit = async (commentId) => {
      if (!editCommentContent.value.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Comentario vacío',
          detail: 'El comentario no puede estar vacío',
          life: 3000
        });
        return;
      }

      processingCommentId.value = commentId;

      try {
        await commentService.updateComment(
          commentId,
          { content: editCommentContent.value.trim() },
          {
            id: authStore.currentUser.id,
            isAdmin: authStore.isAdmin
          }
        );

        // Notificar al componente padre para actualizar comentarios
        emit('update');

        // Resetear estados
        editingCommentId.value = null;
        editCommentContent.value = '';

        toast.add({
          severity: 'success',
          summary: 'Comentario actualizado',
          detail: 'Tu comentario ha sido actualizado correctamente',
          life: 3000
        });
      } catch (err) {
        console.error('Error al actualizar comentario:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el comentario',
          life: 3000
        });
      } finally {
        processingCommentId.value = null;
      }
    };

    // Eliminar comentario
    const deleteComment = async (commentId) => {
      if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        return;
      }

      processingCommentId.value = commentId;

      try {
        await commentService.deleteComment(commentId, {
          id: authStore.currentUser.id,
          isAdmin: authStore.isAdmin
        });

        // Notificar al componente padre para actualizar comentarios
        emit('update');

        toast.add({
          severity: 'success',
          summary: 'Comentario eliminado',
          detail: 'El comentario ha sido eliminado correctamente',
          life: 3000
        });
      } catch (err) {
        console.error('Error al eliminar comentario:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el comentario',
          life: 3000
        });
      } finally {
        processingCommentId.value = null;
      }
    };

    // Iniciar respuesta
    const startReply = (commentId) => {
      replyingToId.value = commentId;
      replyContent.value = '';
    };

    // Cancelar respuesta
    const cancelReply = () => {
      replyingToId.value = null;
      replyContent.value = '';
    };

    // Enviar respuesta
    const submitReply = async (parentId) => {
      if (!replyContent.value.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Respuesta vacía',
          detail: 'Por favor escribe algo antes de enviar',
          life: 3000
        });
        return;
      }

      processingCommentId.value = parentId;

      try {
        await commentService.createComment(
          {
            postId: props.postId,
            parentId,
            content: replyContent.value.trim()
          },
          {
            id: authStore.currentUser.id,
            name: authStore.currentUser.name
          }
        );

        // Notificar al componente padre para actualizar comentarios
        emit('update');

        // Resetear estados
        replyingToId.value = null;
        replyContent.value = '';

        toast.add({
          severity: 'success',
          summary: 'Respuesta enviada',
          detail: 'Tu respuesta ha sido publicada correctamente',
          life: 3000
        });
      } catch (err) {
        console.error('Error al enviar respuesta:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo publicar tu respuesta',
          life: 3000
        });
      } finally {
        processingCommentId.value = null;
      }
    };

    // Verificar si el usuario puede editar/eliminar
    const canModifyComment = (comment) => {
      if (!authStore.currentUser) return false;
      return comment.authorId === authStore.currentUser.id || authStore.isAdmin;
    };

    return {
      commentTree,
      formatDate,
      editingCommentId,
      editCommentContent,
      replyingToId,
      replyContent,
      processingCommentId,
      startEditing,
      cancelEditing,
      saveEdit,
      deleteComment,
      startReply,
      cancelReply,
      submitReply,
      canModifyComment
    };
  }
};
</script>

<template>
  <div class="comment-list">
    <div v-if="comments.length === 0" class="text-center p-3 text-500">
      No hay comentarios todavía. ¡Sé el primero en comentar!
    </div>

    <div v-else class="comments-container">
      <!-- Comentarios de nivel principal -->
      <div 
        v-for="comment in commentTree" 
        :key="comment.id"
        class="comment mb-3 p-3 border-1 border-300 border-round"
      >
        <!-- Cabecera del comentario -->
        <div class="comment-header flex justify-content-between align-items-center mb-2">
          <div class="author-info flex align-items-center">
            <Avatar 
              :label="comment.authorName?.charAt(0).toUpperCase() || 'U'"
              shape="circle"
              class="mr-2"
              size="small"
            />
            <span class="font-semibold">{{ comment.authorName }}</span>
          </div>
          <span class="text-sm text-500">{{ formatDate(comment.createdAt) }}</span>
        </div>

        <!-- Contenido del comentario (modo edición) -->
        <div v-if="editingCommentId === comment.id" class="comment-edit mb-2">
          <Textarea 
            v-model="editCommentContent" 
            rows="3"
            class="w-full mb-2"
            autoResize
          />
          <div class="flex justify-content-end gap-2">
            <Button 
              label="Cancelar" 
              class="p-button-text"
              @click="cancelEditing"
              :disabled="processingCommentId === comment.id"
            />
            <Button 
              label="Guardar" 
              @click="saveEdit(comment.id)"
              :loading="processingCommentId === comment.id"
            />
          </div>
        </div>

        <!-- Contenido del comentario (modo normal) -->
        <div v-else class="comment-content mb-2">
          <p class="m-0 whitespace-pre-line">{{ comment.content }}</p>

          <div v-if="comment.updatedAt" class="text-xs text-500 mt-1">
            (Editado el {{ formatDate(comment.updatedAt) }})
          </div>
        </div>

        <!-- Acciones del comentario -->
        <div class="comment-actions flex justify-content-between align-items-center">
          <Button 
            label="Responder" 
            class="p-button-text p-button-sm"
            @click="startReply(comment.id)"
            v-if="!replyingToId && !editingCommentId"
          />

          <div v-if="canModifyComment(comment) && !editingCommentId && !replyingToId" class="comment-controls">
            <Button 
              icon="pi pi-pencil" 
              class="p-button-text p-button-rounded p-button-sm mr-1"
              @click="startEditing(comment)"
              v-tooltip.top="'Editar comentario'"
            />
            <Button 
              icon="pi pi-trash" 
              class="p-button-text p-button-rounded p-button-danger p-button-sm"
              @click="deleteComment(comment.id)"
              :loading="processingCommentId === comment.id"
              v-tooltip.top="'Eliminar comentario'"
            />
          </div>
        </div>

        <!-- Formulario de respuesta -->
        <div v-if="replyingToId === comment.id" class="reply-form mt-3 pt-2 border-top-1 border-300">
          <h5 class="m-0 mb-2 text-sm">Respondiendo a {{ comment.authorName }}</h5>
          <Textarea 
            v-model="replyContent" 
            rows="2"
            class="w-full mb-2"
            placeholder="Escribe tu respuesta..."
            autoResize
          />
          <div class="flex justify-content-end gap-2">
            <Button 
              label="Cancelar" 
              class="p-button-text"
              @click="cancelReply"
              :disabled="processingCommentId === comment.id"
            />
            <Button 
              label="Responder" 
              icon="pi pi-reply"
              @click="submitReply(comment.id)"
              :loading="processingCommentId === comment.id"
            />
          </div>
        </div>

        <!-- Respuestas anidadas -->
        <div v-if="comment.children && comment.children.length > 0" class="nested-comments ml-4 mt-3 pt-2 border-top-1 border-300">
          <div 
            v-for="childComment in comment.children" 
            :key="childComment.id"
            class="nested-comment mt-2 p-2 border-left-2 border-primary"
          >
            <!-- Cabecera del comentario anidado -->
            <div class="comment-header flex justify-content-between align-items-center mb-1">
              <div class="author-info flex align-items-center">
                <Avatar 
                  :label="childComment.authorName?.charAt(0).toUpperCase() || 'U'"
                  shape="circle"
                  class="mr-2"
                  size="small"
                />
                <span class="font-semibold">{{ childComment.authorName }}</span>
              </div>
              <span class="text-xs text-500">{{ formatDate(childComment.createdAt) }}</span>
            </div>

            <!-- Contenido del comentario anidado (modo edición) -->
            <div v-if="editingCommentId === childComment.id" class="comment-edit mb-2">
              <Textarea 
                v-model="editCommentContent" 
                rows="2"
                class="w-full mb-2"
                autoResize
              />
              <div class="flex justify-content-end gap-2">
                <Button 
                  label="Cancelar" 
                  class="p-button-text p-button-sm"
                  @click="cancelEditing"
                  :disabled="processingCommentId === childComment.id"
                />
                <Button 
                  label="Guardar" 
                  class="p-button-sm"
                  @click="saveEdit(childComment.id)"
                  :loading="processingCommentId === childComment.id"
                />
              </div>
            </div>

            <!-- Contenido del comentario anidado (modo normal) -->
            <div v-else class="comment-content mb-1">
              <p class="m-0 whitespace-pre-line">{{ childComment.content }}</p>

              <div v-if="childComment.updatedAt" class="text-xs text-500 mt-1">
                (Editado el {{ formatDate(childComment.updatedAt) }})
              </div>
            </div>

            <!-- Acciones del comentario anidado -->
            <div v-if="canModifyComment(childComment) && !editingCommentId" class="comment-controls text-right">
              <Button 
                icon="pi pi-pencil" 
                class="p-button-text p-button-rounded p-button-sm mr-1"
                @click="startEditing(childComment)"
                v-tooltip.top="'Editar comentario'"
              />
              <Button 
                icon="pi pi-trash" 
                class="p-button-text p-button-rounded p-button-danger p-button-sm"
                @click="deleteComment(childComment.id)"
                :loading="processingCommentId === childComment.id"
                v-tooltip.top="'Eliminar comentario'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment {
  background-color: var(--surface-0);
}

.nested-comment {
  background-color: var(--surface-50);
}

.comment-content p {
  line-height: 1.5;
}
</style>
        <!-- Acciones del comentario -->
        <div class="comment-actions flex justify-content-between align-items-center">
          <Button 
            label="Responder" 
            class="p-button-text p-button-sm"
            @click="startReply(comment.id)"
            v-if="!replyingToId && !editingCommentId"
          />

          <div v-if="canModifyComment(comment) && !editingCommentId && !replyingToId" class="comment-controls">
            <Button 
              icon="pi pi-pencil" 
              class="p-button-text p-button-rounded p-button-sm mr-1"
              @click="startEditing(comment)"
              v-tooltip.top="'Editar comentario'"
            />
            <Button 
              icon="pi pi-trash" 
              class="p-button-text p-button-rounded p-button-danger p-button-sm"
              @click="deleteComment(comment.id)"
              :loading="processingCommentId === comment.id"
              v-tooltip.top="'Eliminar comentario'"
            />
          </div>
        </div>

        <!-- Formulario de respuesta -->
        <div v-if="replyingToId === comment.id" class="reply-form mt-3 pt-2 border-top-1 border-300">
          <h5 class="m-0 mb-2 text-sm">Respondiendo a {{ comment.authorName }}</h5>
          <Textarea 
            v-model="replyContent" 
            rows="2"
            class="w-full mb-2"
            placeholder="Escribe tu respuesta..."
            autoResize
          />
          <div class="flex justify-content-end gap-2">
            <Button 
              label="Cancelar" 
              class="p-button-text"
              @click="cancelReply"
              :disabled="processingCommentId === comment.id"
            />
            <Button 
              label="Responder" 
              icon="pi pi-reply"
              @click="submitReply(comment.id)"
              :loading="processingCommentId === comment.id"
            />
          </div>
        </div>

        <!-- Respuestas anidadas -->
        <div v-if="comment.children && comment.children.length > 0" class="nested-comments ml-4 mt-3 pt-2 border-top-1 border-300">
          <div 
            v-for="childComment in comment.children" 
            :key="childComment.id"
            class="nested-comment mt-2 p-2 border-left-2 border-primary"
          >
            <!-- Cabecera del comentario anidado -->
            <div class="comment-header flex justify-content-between align-items-center mb-1">
              <div class="author-info flex align-items-center">
                <Avatar 
                  :label="childComment.authorName?.charAt(0).toUpperCase() || 'U'"
                  shape="circle"
                  class="mr-2"
                  size="small"
                />
                <span class="font-semibold">{{ childComment.authorName }}</span>
              </div>
              <span class="text-xs text-500">{{ formatDate(childComment.createdAt) }}</span>
            </div>

            <!-- Contenido del comentario anidado (modo edición) -->
            <div v-if="editingCommentId === childComment.id" class="comment-edit mb-2">
              <Textarea 
                v-model="editCommentContent" 
                rows="2"
                class="w-full mb-2"
                autoResize
              />
              <div class="flex justify-content-end gap-2">
                <Button 
                  label="Cancelar" 
                  class="p-button-text p-button-sm"
                  @click="cancelEditing"
                  :disabled="processingCommentId === childComment.id"
                />
                <Button 
                  label="Guardar" 
                  class="p-button-sm"
                  @click="saveEdit(childComment.id)"
                  :loading="processingCommentId === childComment.id"
                />
              </div>
            </div>

            <!-- Contenido del comentario anidado (modo normal) -->
            <div v-else class="comment-content mb-1">
              <p class="m-0 whitespace-pre-line">{{ childComment.content }}</p>

              <div v-if="childComment.updatedAt" class="text-xs text-500 mt-1">
                (Editado el {{ formatDate(childComment.updatedAt) }})
              </div>
            </div>

            <!-- Acciones del comentario anidado -->
            <div v-if="canModifyComment(childComment) && !editingCommentId" class="comment-controls text-right">
              <Button 
                icon="pi pi-pencil" 
                class="p-button-text p-button-rounded p-button-sm mr-1"
                @click="startEditing(childComment)"
                v-tooltip.top="'Editar comentario'"
              />
              <Button 
                icon="pi pi-trash" 
                class="p-button-text p-button-rounded p-button-danger p-button-sm"
                @click="deleteComment(childComment.id)"
                :loading="processingCommentId === childComment.id"
                v-tooltip.top="'Eliminar comentario'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment {
  background-color: var(--surface-50);
}

.comment-content {
  font-size: 0.95rem;
  line-height: 1.5;
}

.nested-comment {
  background-color: var(--surface-0);
}
</style>
