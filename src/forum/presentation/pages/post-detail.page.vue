<template>
  <div class="post-detail">
    <div v-if="post">
      <h1>{{ post.title }}</h1>
      <p>{{ post.content }}</p>
      <p><strong>Publicado por:</strong> {{ post.authorName }}</p>
      <p><strong>Fecha:</strong> {{ new Date(post.createdAt).toLocaleString() }}</p>

      <div class="reactions">
        <button @click="react('like')">👍 {{ post.likes }}</button>
        <button @click="react('dislike')">👎 {{ post.dislikes }}</button>
      </div>

      <hr />

      <div class="comments">
        <h2>Comentarios</h2>
        <ul>
          <li v-for="comment in comments" :key="comment.id">
            <p><strong>{{ comment.authorName }}</strong>: {{ comment.content }}</p>
            <small>{{ new Date(comment.createdAt).toLocaleString() }}</small>
          </li>
        </ul>

        <div class="add-comment">
          <h3>Agregar comentario</h3>
          <textarea v-model="commentText" placeholder="Escribe un comentario"></textarea>
          <button @click="submitComment">Enviar</button>
        </div>
      </div>
    </div>

    <div v-else>
      <p>Cargando publicación...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const postId = route.params.id;
const post = ref(null);
const comments = ref([]);
const commentText = ref('');

const user = JSON.parse(localStorage.getItem('user')); // ← importante

const fetchPost = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`);
    post.value = response.data;
  } catch (err) {
    console.error('Error al cargar el post:', err);
  }
};

const fetchComments = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`);
    comments.value = response.data;
  } catch (err) {
    console.error('Error al cargar comentarios:', err);
  }
};

const submitComment = async () => {
  if (!commentText.value.trim() || !user) return;

  const commentPayload = {
    content: commentText.value.trim(),
    authorName: user.name || 'Anónimo',
    authorId: user.id
  };

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`, commentPayload);
    comments.value.push(response.data);
    commentText.value = '';
  } catch (err) {
    console.error('Error al enviar comentario:', err);
  }
};

const react = async (type) => {
  try {
    const payload = { [type]: 1 };
    const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/reactions`, payload);
    post.value = response.data;
  } catch (err) {
    console.error('Error al reaccionar:', err);
  }
};

onMounted(() => {
  fetchPost();
  fetchComments();
});
</script>

<style scoped>
.post-detail {
  max-width: 700px;
  margin: auto;
  padding: 1rem;
}
.reactions button {
  margin-right: 10px;
}
.comments {
  margin-top: 2rem;
}
.add-comment textarea {
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
</style>
