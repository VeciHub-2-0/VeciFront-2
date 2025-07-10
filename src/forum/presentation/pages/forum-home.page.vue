<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { PostService } from '../../application/services/post.service';
import ForumLayout from '../components/forum-layout.component.vue';
import PostCard from '../components/post-card.component.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import ProgressSpinner from 'primevue/progressspinner';

export default {
  name: 'ForumHomePage',
  components: {
    ForumLayout,
    PostCard,
    InputText,
    Button,
    Dropdown,
    ProgressSpinner
  },
  setup() {
    const router = useRouter();
    const postService = new PostService();

    const posts = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const searchQuery = ref('');
    const sortOption = ref('recent');

    // Opciones de ordenación
    const sortOptions = [
      { label: 'Más recientes', value: 'recent' },
      { label: 'Más comentados', value: 'comments' },
      { label: 'Más populares', value: 'reactions' }
    ];

    // Cargar posts
    const fetchPosts = async () => {
      try {
        loading.value = true;
        error.value = null;

        const postsList = await postService.getPosts();

        // Aplicar ordenación
        posts.value = sortPosts(postsList);
      } catch (err) {
        console.error('Error al cargar posts:', err);
        error.value = 'Error al cargar los posts. Inténtalo de nuevo más tarde.';
      } finally {
        loading.value = false;
      }
    };

    // Ordenar posts según la opción seleccionada
    const sortPosts = (postsList) => {
      switch (sortOption.value) {
        case 'comments':
          return [...postsList].sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        case 'reactions':
          return [...postsList].sort((a, b) => {
            const reactionsA = (a.reactions?.like || 0) + (a.reactions?.love || 0);
            const reactionsB = (b.reactions?.like || 0) + (b.reactions?.love || 0);
            return reactionsB - reactionsA;
          });
        case 'recent':
        default:
          return [...postsList].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
      }
    };

    // Filtrar posts por búsqueda
    const filteredPosts = () => {
      if (!searchQuery.value.trim()) return posts.value;

      const query = searchQuery.value.toLowerCase().trim();
      return posts.value.filter(post => {
        return (
          post.title?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query) ||
          post.authorName?.toLowerCase().includes(query)
        );
      });
    };

    // Ir a la página de creación de post
    const createPost = () => {
      router.push('/forum/new');
    };

    // Ir a la vista detallada de un post
    const goToPost = (postId) => {
      router.push(`/forum/post/${postId}`);
    };

    // Reordenar posts cuando cambia la opción de ordenación
    watch(sortOption, () => {
      posts.value = sortPosts(posts.value);
    });

    // Cargar datos al montar el componente
    onMounted(() => {
      fetchPosts();
    });

    return {
      posts,
      loading,
      error,
      searchQuery,
      sortOption,
      sortOptions,
      filteredPosts,
      fetchPosts,
      createPost,
      goToPost
    };
  }
};
</script>

<template>
  <div class="forum-home-page">
    <ForumLayout>
      <!-- Filtros y búsqueda -->
      <div class="forum-filters mb-4 flex align-items-center justify-content-between flex-wrap gap-2">
        <div class="search-container flex-grow-1">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <InputText 
              v-model="searchQuery" 
              placeholder="Buscar en el foro..." 
              class="w-full"
            />
          </span>
        </div>

        <div class="sort-container">
          <Dropdown 
            v-model="sortOption" 
            :options="sortOptions" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Ordenar por" 
            class="w-full"
          />
        </div>

        <div class="d-block d-md-none w-full">
          <Button 
            label="Nuevo Post" 
            icon="pi pi-plus"
            @click="createPost"
            class="w-full"
          />
        </div>
      </div>

      <!-- Loader mientras carga -->
      <div v-if="loading" class="text-center p-5">
        <ProgressSpinner style="width:50px;height:50px" />
        <div class="mt-3">Cargando posts...</div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="p-error p-4 text-center">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        {{ error }}
        <Button label="Reintentar" class="p-button-sm mt-3" @click="fetchPosts" />
      </div>

      <!-- Lista de posts -->
      <div v-else>
        <!-- Sin resultados de búsqueda -->
        <div v-if="filteredPosts().length === 0 && searchQuery" class="text-center p-4">
          <i class="pi pi-search" style="font-size: 2rem; opacity: 0.3"></i>
          <h3 class="mt-3 mb-2">No se encontraron resultados</h3>
          <p class="text-500">No hay posts que coincidan con "{{ searchQuery }}"</p>
          <Button 
            label="Limpiar búsqueda" 
            class="p-button-outlined mt-2"
            @click="searchQuery = ''"
          />
        </div>

        <!-- Sin posts en el foro -->
        <div v-else-if="posts.length === 0" class="text-center p-5">
          <i class="pi pi-comments" style="font-size: 3rem; opacity: 0.3"></i>
          <h3 class="mt-3 mb-2">No hay posts todavía</h3>
          <p class="text-500 mb-3">¡Sé el primero en crear un post en el foro!</p>
          <Button 
            label="Crear el primer post" 
            icon="pi pi-plus"
            @click="createPost"
          />
        </div>

        <!-- Lista de posts -->
        <div v-else class="posts-list">
          <PostCard 
            v-for="post in filteredPosts()" 
            :key="post.id"
            :post="post"
            @click="goToPost(post.id)"
          />
        </div>
      </div>
    </ForumLayout>
  </div>
</template>

<style scoped>
.forum-home-page {
  padding: 1rem;
}

@media (max-width: 768px) {
  .forum-filters {
    gap: 1rem;
  }

  .search-container,
  .sort-container {
    width: 100%;
  }
}
</style>
