<script>
import { useRouter } from 'vue-router';
import Avatar from 'primevue/avatar';

export default {
  name: 'PostCard',
  components: {
    Avatar
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    const goToPost = () => {
      router.push(`/forum/post/${props.post.id}`);
    };

    // Formatear la fecha del post
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

    // Truncar contenido
    const truncateContent = (content) => {
      if (!content) return '';
      return content.length > 200 
        ? content.substring(0, 200) + '...' 
        : content;
    };

    return {
      goToPost,
      formatDate,
      truncateContent
    };
  }
};
</script>

<template>
  <div class="post-card p-3 mb-3 border-1 border-300 border-round cursor-pointer" @click="goToPost">
    <div class="post-header flex justify-content-between align-items-center mb-2">
      <div class="author-info flex align-items-center">
        <Avatar 
          :label="post.authorName?.charAt(0).toUpperCase() || 'U'"
          shape="circle"
          class="mr-2"
          size="small"
        />
        <span class="font-semibold">{{ post.authorName }}</span>
      </div>
      <div class="post-date text-sm text-500">{{ formatDate(post.createdAt) }}</div>
    </div>

    <h3 class="post-title text-lg font-semibold mb-2">{{ post.title }}</h3>

    <div class="post-content mb-3 text-color-secondary">
      {{ truncateContent(post.content) }}
    </div>

    <div class="post-stats flex align-items-center">
      <span class="mr-3">
        <i class="pi pi-heart-fill mr-1" style="font-size: 0.9rem; color: var(--primary-color)"></i>
        {{ post.reactions?.like || 0 }}
      </span>
      <span>
        <i class="pi pi-comments mr-1" style="font-size: 0.9rem"></i>
        {{ post.commentCount || 0 }}
      </span>

      <span v-if="post.updatedAt" class="ml-auto text-xs text-500">(Editado)</span>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  background-color: var(--surface-0);
  transition: all 0.2s;
}

.post-card:hover {
  background-color: var(--surface-100);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.post-title {
  color: var(--text-color);
  line-height: 1.3;
}

.post-content {
  line-height: 1.5;
  opacity: 0.9;
}
</style>
