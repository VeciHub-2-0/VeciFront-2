import axios from 'axios';

export class PostService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async getPosts(limit = 20, page = 1) {
    try {
      const response = await axios.get(`${this.apiUrl}/posts`, {
        params: {
          _sort: 'createdAt',
          _order: 'desc',
          _limit: limit,
          _page: page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener posts:', error);
      throw error;
    }
  }

  async getPostById(id) {
    try {
      const response = await axios.get(`${this.apiUrl}/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener post ${id}:`, error);
      throw error;
    }
  }

  async createPost(postData, author) {
    try {
        console.log('Creando post con datos:', { postData, author });

        // Crear estructura básica del post
        const post = {
          id: Date.now(), // Generar ID temporal (el servidor lo reemplazará)
          title: postData.title,
          content: postData.content,
          images: postData.images || [],
          authorId: author.id,
          authorName: author.name,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          reactions: { like: 0, dislike: 0 },
          commentCount: 0,
          categoryId: 1 // Categoría fija (General)
        };

        console.log('Enviando post al servidor:', post);
        const response = await axios.post(`${this.apiUrl}/posts`, post);
        console.log('Respuesta del servidor:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al crear post:', error);
        console.error('Detalles del error:', error.response?.data || error.message);
      throw error;
    }
  }

  async updatePost(id, postData, user) {
    try {
      // Primero verificamos si el usuario puede editar el post
      const post = await this.getPostById(id);

      if (post.authorId !== user.id && !user.isAdmin) {
        throw new Error('No tienes permiso para editar este post');
      }

      const updatedPost = {
        ...post,
        ...postData,
        updatedAt: new Date().toISOString()
      };

      const response = await axios.put(`${this.apiUrl}/posts/${id}`, updatedPost);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar post ${id}:`, error);
      throw error;
    }
  }

  async deletePost(id, user) {
    try {
      // Primero verificamos si el usuario puede eliminar el post
      const post = await this.getPostById(id);

      if (post.authorId !== user.id && !user.isAdmin) {
        throw new Error('No tienes permiso para eliminar este post');
      }

      await axios.delete(`${this.apiUrl}/posts/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar post ${id}:`, error);
      throw error;
    }
  }

  async addReaction(postId, type) {
    try {
      const post = await this.getPostById(postId);

      // Actualizar contador de reacciones
      post.reactions[type] = (post.reactions[type] || 0) + 1;

      const response = await axios.patch(`${this.apiUrl}/posts/${postId}`, {
        reactions: post.reactions
      });

      return response.data;
    } catch (error) {
      console.error(`Error al añadir reacción al post ${postId}:`, error);
      throw error;
    }
  }

  async removeReaction(postId, type) {
    try {
      const post = await this.getPostById(postId);

      // Actualizar contador de reacciones (no permitir números negativos)
      post.reactions[type] = Math.max(0, (post.reactions[type] || 0) - 1);

      const response = await axios.patch(`${this.apiUrl}/posts/${postId}`, {
        reactions: post.reactions
      });

      return response.data;
    } catch (error) {
      console.error(`Error al quitar reacción del post ${postId}:`, error);
      throw error;
    }
  }
    async getComments(postId) {
    try {
      const response = await axios.get(`${this.apiUrl}/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener comentarios del post ${postId}:`, error);
      throw error;
    }
  }

  async addComment(postId, commentData, user) {
    try {
      const comment = {
        content: commentData.content,
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(`${this.apiUrl}/posts/${postId}/comments`, comment);
      return response.data;
    } catch (error) {
      console.error(`Error al enviar comentario en post ${postId}:`, error);
      throw error;
    }
  }

}
