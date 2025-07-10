<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '../../../stores/auth';
import { PostService } from '../../application/services/post.service';
import { CommentService } from '../../application/services/comment.service';
import { CategoryService } from '../../application/services/category.service';
import ForumLayout from './forum-layout.component.vue';
import CommentList from './comment-list.component.vue';
import CommentForm from './comment-form.component.vue';
import ReactionButtons from './reaction-buttons.component.vue';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Textarea from 'primevue/textarea';

export default {
  name: 'PostDetail',
  components: {
    ForumLayout,
    CommentList,
    CommentForm,
    ReactionButtons,
    Button,
    ProgressSpinner,
    Textarea
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const authStore = useAuthStore();

    const postService = new PostService();
    const commentService = new CommentService();

    const postId = route.params.id;
    const post = ref(null);
    const comments = ref([]);
    const loading = ref(true);
    const commentsLoading = ref(true);
    const error = ref(null);
    const commentContent = ref('');
    const submittingComment = ref(false);

    // Cargar el post
    const fetchPost = async () => {
      try {
        loading.value = true;
        error.value = null;
        post.value = await postService.getPostById(postId);
      } catch (err) {
        console.error('Error al cargar el post:', err);
        error.value = 'Error al cargar el post. Inténtalo de nuevo más tarde.';
      } finally {
        loading.value = false;
      }
    };

    // Cargar comentarios
    const fetchComments = async () => {
      try {
        commentsLoading.value = true;
        comments.value = await commentService.getCommentsByPostId(postId);
      } catch (err) {
        console.error('Error al cargar los comentarios:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los comentarios',
          life: 3000
        });
      } finally {
        commentsLoading.value = false;
      }
    };

    // Enviar un nuevo comentario
    const submitComment = async () => {
      if (!commentContent.value.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Comentario vacío',
          detail: 'Por favor escribe algo antes de enviar',
          life: 3000
        });
        return;
      }

      try {
        submittingComment.value = true;
        await commentService.createComment(
          {
            postId: postId,
            parentId: null,
            content: commentContent.value.trim()
          },
          {
            id: authStore.currentUser.id,
            name: authStore.currentUser.name
          }
        );

        // Limpiar y actualizar
        commentContent.value = '';
        await fetchComments();

        toast.add({
          severity: 'success',
          summary: 'Comentario publicado',
          detail: 'Tu comentario ha sido publicado correctamente',
          life: 3000
        });
      } catch (err) {
        console.error('Error al enviar comentario:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo publicar tu comentario',
          life: 3000
        });
      } finally {
        submittingComment.value = false;
      }
    };

    // Manejar reacciones al post
    const handlePostReaction = async (type, action) => {
      try {
        if (action === 'add') {
          await postService.addReaction(postId, type);
        } else {
          await postService.removeReaction(postId, type);
        }

        // Actualizar el post después de la reacción
        post.value = await postService.getPostById(postId);

        toast.add({
          severity: 'success',
          summary: 'Reacción registrada',
          detail: action === 'add' ? 'Has reaccionado al post' : 'Has quitado tu reacción',
          life: 3000
        });
      } catch (err) {
        console.error('Error al procesar la reacción:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo procesar tu reacción',
          life: 3000
        });
      }
    };

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

    // Comprobar si el usuario es el autor
    const isAuthor = () => {
      return post.value && post.value.authorId === authStore.currentUser?.id;
    };

    // Comprobar si el usuario es admin
    const isAdmin = () => {
      return authStore.isAdmin;
    };

    // Editar post
    const editPost = () => {
      router.push(`/forum/edit/${postId}`);
    };

    // Eliminar post
    const deletePost = async () => {
      // Confirmar antes de eliminar
      if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
        return;
      }

      try {
        await postService.deletePost(postId, {
          id: authStore.currentUser.id,
          isAdmin: authStore.isAdmin
        });

        toast.add({
          severity: 'success',
          summary: 'Post eliminado',
          detail: 'El post ha sido eliminado correctamente',
          life: 3000
        });

        // Redirigir al foro
        router.push('/forum');
      } catch (err) {
        console.error('Error al eliminar el post:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el post',
          life: 3000
        });
      }
    };

    onMounted(() => {
      fetchPost();
      fetchComments();
    });

    return {
      post,
      comments,
      loading,
      commentsLoading,
      error,
      commentContent,
      submittingComment,
      fetchPost,
      fetchComments,
      submitComment,
      handlePostReaction,
      formatDate,
      isAuthor,
      isAdmin,
      editPost,
      deletePost
    };
  }
};
</script>

<template>
  <div class="post-detail-page">
    <ForumLayout>
      <!-- Loader mientras carga -->
      <div v-if="loading" class="text-center p-5">
        <ProgressSpinner style="width:50px;height:50px" />
        <div class="mt-3">Cargando post...</div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="p-error p-4 text-center">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        {{ error }}
        <Button label="Reintentar" class="p-button-sm mt-3" @click="fetchPost" />
      </div>

      <!-- Contenido del post -->
      <div v-else class="post-container">
        <!-- Cabecera del post -->
        <div class="post-header">
          <div class="flex justify-content-between align-items-start mb-3">
            <h1 class="post-title m-0">{{ post.title }}</h1>

            <!-- Acciones (editar/eliminar) -->
            <div v-if="isAuthor() || isAdmin()" class="post-actions">
              <Button 
                icon="pi pi-pencil" 
                class="p-button-text p-button-rounded mr-2"
                @click="editPost"
                v-tooltip="'Editar post'"
              />
              <Button 
                icon="pi pi-trash" 
                class="p-button-text p-button-rounded p-button-danger"
                @click="deletePost"
                v-tooltip="'Eliminar post'"
              />
            </div>
          </div>

          <div class="post-meta mb-4">
            <span class="author font-semibold">{{ post.authorName }}</span>
            <span class="separator">•</span>
            <span class="date">{{ formatDate(post.createdAt) }}</span>
            <span v-if="post.updatedAt" class="edited ml-2 text-500">(Editado)</span>
          </div>
        </div>

        <!-- Contenido del post -->
        <div class="post-content mb-4">
          <p class="whitespace-pre-line">{{ post.content }}</p>
        </div>

        <!-- Reacciones -->
        <div class="post-reactions mb-4 pt-3 border-top-1 border-300">
          <ReactionButtons 
            :reactions="post.reactions" 
            @reaction="handlePostReaction"
          />
        </div>

        <!-- Sección de comentarios -->
        <div class="comments-section pt-4 border-top-1 border-300">
          <h2 class="comments-title mb-3">Comentarios ({{ comments.length }})</h2>

          <!-- Loader de comentarios -->
          <div v-if="commentsLoading" class="text-center p-3">
            <ProgressSpinner style="width:30px;height:30px" />
            <div class="mt-2">Cargando comentarios...</div>
          </div>

          <!-- Formulario para nuevo comentario -->
          <div class="comment-form mb-4">
            <h3 class="comment-form-title mb-2">Deja un comentario</h3>
            <Textarea 
              v-model="commentContent" 
              rows="3"
              class="w-full mb-2"
              placeholder="Escribe tu comentario..."
              :disabled="submittingComment"
              autoResize
            />
            <div class="flex justify-content-end">
              <Button 
                label="Comentar" 
                icon="pi pi-send"
                @click="submitComment"
                :loading="submittingComment"
              />
            </div>
          </div>

          <!-- Lista de comentarios -->
          <CommentList 
            :comments="comments" 
            :postId="post.id"
            @update="fetchComments"
          />
        </div>
      </div>
    </ForumLayout>
  </div>
</template>

<style scoped>
.post-detail-page {
  padding: 1rem;
}

.post-container {
  max-width: 800px;
  margin: 0 auto;
}

.post-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.3;
}

.post-meta {
  color: var(--text-color-secondary);
  font-size: 0.95rem;
}

.post-meta .separator {
  margin: 0 0.5rem;
}

.post-content {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-color);
}

.comments-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
}

.comment-form-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}
</style>
        // Cargar el post
        post.value = await postService.getPostById(props.postId);

        // Cargar la categoría
        if (post.value.categoryId) {
          category.value = await categoryService.getCategoryById(post.value.categoryId);
        }

        // Cargar los comentarios
        comments.value = await commentService.getCommentsByPostId(props.postId);
      } catch (err) {
        console.error('Error al cargar el post:', err);
        error.value = 'Error al cargar el post. Inténtalo de nuevo más tarde.';
      } finally {
        loading.value = false;
      }
    };

    // Actualizar las reacciones del post
    const handleReaction = async (type, action) => {
      try {
        if (action === 'add') {
          await postService.addReaction(props.postId, type);
        } else {
          await postService.removeReaction(props.postId, type);
        }

        // Recargar el post para obtener las reacciones actualizadas
        post.value = await postService.getPostById(props.postId);

        toast.add({
          severity: 'success',
          summary: 'Reacción registrada',
          detail: action === 'add' ? 'Has reaccionado al post' : 'Has quitado tu reacción',
          life: 3000
        });
      } catch (err) {
        console.error('Error al procesar la reacción:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo procesar tu reacción',
          life: 3000
        });
      }
    };

    // Crear un nuevo comentario
    const handleCommentSubmit = async (commentData) => {
      try {
        const newComment = await commentService.createComment(
          {
            postId: props.postId,
            ...commentData
          },
          {
            id: authStore.currentUser.id,
            name: authStore.currentUser.name
          }
        );

        // Añadir el comentario a la lista
        comments.value.push(newComment);

        // Actualizar el contador de comentarios en el post
        if (post.value) {
          post.value.commentCount = (post.value.commentCount || 0) + 1;
        }

        toast.add({
          severity: 'success',
          summary: 'Comentario añadido',
          detail: 'Tu comentario ha sido publicado',
          life: 3000
        });
      } catch (err) {
        console.error('Error al crear comentario:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo publicar tu comentario',
          life: 3000
        });
      }
    };

    // Eliminar el post
    const handleDeletePost = async () => {
      try {
        // Confirmar antes de eliminar
        if (!confirm('¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.')) {
          return;
        }

        await postService.deletePost(props.postId, {
          id: authStore.currentUser.id,
          isAdmin: authStore.isAdmin
        });

        toast.add({
          severity: 'success',
          summary: 'Post eliminado',
          detail: 'El post ha sido eliminado correctamente',
          life: 3000
        });

        // Redirigir al foro
        router.push('/forum');
      } catch (err) {
        console.error('Error al eliminar post:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el post',
          life: 3000
        });
      }
    };

    // Editar el post
    const handleEditPost = () => {
      router.push(`/forum/edit/${props.postId}`);
    };

    // Cargar los datos al montar el componente
    onMounted(() => {
      fetchPost();
    });

    return {
      post,
      category,
      comments,
      loading,
      error,
      isAuthor,
      formattedDate,
      handleReaction,
      handleCommentSubmit,
      handleDeletePost,
      handleEditPost,
      fetchPost,
      isAdmin: computed(() => authStore.isAdmin)
    };
  }
};
</script>

<template>
  <div class="post-detail">
    <!-- Loader mientras carga -->
    <div v-if="loading" class="text-center p-5">
      <ProgressSpinner style="width:50px;height:50px" />
      <div class="mt-3">Cargando post...</div>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="p-error p-4 text-center">
      <i class="pi pi-exclamation-triangle mr-2"></i>
      {{ error }}
      <Button label="Reintentar" class="p-button-sm mt-3" @click="fetchPost" />
    </div>

    <!-- Contenido del post -->
    <div v-else-if="post" class="post-content">
      <!-- Cabecera -->
      <div class="post-header mb-4">
        <div class="flex justify-content-between align-items-center mb-2">
          <Tag 
            :value="category?.name || 'Sin categoría'"
            severity="info"
            class="mr-2"
          />
          <span class="text-sm text-500">{{ formattedDate }}</span>
        </div>

        <h1 class="post-title mb-2">{{ post.title }}</h1>

        <div class="post-author flex align-items-center">
          <Avatar 
            :label="post.authorName?.charAt(0).toUpperCase() || 'U'"
            shape="circle"
            class="mr-2"
          />
          <span>{{ post.authorName || 'Usuario' }}</span>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="post-body mb-4">
        <p v-if="post.content" class="post-text">{{ post.content }}</p>

        <!-- Imágenes si hay -->
        <div v-if="post.images && post.images.length > 0" class="post-images mt-3">
          <Image 
            v-for="(img, index) in post.images" 
            :key="index"
            :src="img" 
            alt="Imagen del post"
            width="200" 
            preview 
            class="mr-2 mb-2"
          />
        </div>
      </div>

      <!-- Acciones y reacciones -->
      <div class="post-actions flex justify-content-between align-items-center mb-4 pt-3 border-top-1 border-300">
        <ReactionButtons 
          :reactions="post.reactions" 
          @reaction="handleReaction"
        />

        <div class="post-controls" v-if="isAuthor || isAdmin">
          <Button 
            icon="pi pi-pencil" 
            class="p-button-rounded p-button-text mr-2"
            @click="handleEditPost"
            v-tooltip.top="'Editar post'"
          />
          <Button 
            icon="pi pi-trash" 
            class="p-button-rounded p-button-text p-button-danger"
            @click="handleDeletePost"
            v-tooltip.top="'Eliminar post'"
          />
        </div>
      </div>

      <!-- Comentarios -->
      <div class="post-comments mt-5">
        <h3 class="comments-title mb-3">
          Comentarios ({{ post.commentCount || 0 }})
        </h3>

        <CommentForm @submit="handleCommentSubmit" />

        <CommentList 
          :comments="comments" 
          :postId="post.id"
          @update="fetchPost"
        />
      </div>
    </div>

    <!-- Post no encontrado -->
    <div v-else class="text-center p-5">
      <i class="pi pi-question-circle text-500" style="font-size: 2rem"></i>
      <h3 class="mt-3 mb-2">Post no encontrado</h3>
      <p class="text-500 mb-3">El post que buscas no existe o ha sido eliminado.</p>
      <Button 
        label="Volver al foro" 
        icon="pi pi-arrow-left"
        class="p-button-raised"
        @click="$router.push('/forum')"
      />
    </div>
  </div>
</template>

<style scoped>
.post-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.3;
}

.post-author {
  color: var(--text-color-secondary);
}

.post-text {
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-line;
}

.comments-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--surface-200);
}
</style>
