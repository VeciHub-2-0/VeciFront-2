<!-- PostDetailComponent.vue -->
<template>
  <div class="post-detail">
    <!-- contenido del post -->

    <div class="comments-section">
      <h4>Comentarios</h4>
      <ul>
        <li v-for="comment in comments" :key="comment.id">
          <strong>{{ comment.authorName }}</strong>: {{ comment.content }}
        </li>
      </ul>

      <textarea v-model="newComment" placeholder="Escribe tu comentario..."></textarea>
      <button @click="submitComment">Comentar</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { PostService } from '@/forum/application/services/post.service';

export default {
  props: ['postId'],
  setup(props) {
    const postService = new PostService();
    const comments = ref([]);
    const newComment = ref('');
    const user = JSON.parse(localStorage.getItem('user'));

    const loadComments = async () => {
      comments.value = await postService.getComments(props.postId);
    };

    const submitComment = async () => {
      if (!newComment.value.trim()) return;
      await postService.addComment(props.postId, { content: newComment.value }, user);
      newComment.value = '';
      await loadComments(); // refrescar
    };

    onMounted(() => {
      loadComments();
    });

    return {
      comments,
      newComment,
      submitComment
    };
  }
}
</script>

<style scoped>
.comments-section {
  margin-top: 2rem;
}
.comments-section textarea {
  width: 100%;
  height: 80px;
}
</style>
