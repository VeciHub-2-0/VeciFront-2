import axios from 'axios';

export class CommentService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async getCommentsByPostId(postId) {
    try {
      const response = await axios.get(`${this.apiUrl}/comments`, {
        params: {
          postId,
          _sort: 'createdAt',
          _order: 'asc'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener comentarios del post ${postId}:`, error);
      throw error;
    }
  }

  async createComment(commentData, author) {
    try {
      const comment = {
        ...commentData,
        authorId: author.id,
        authorName: author.name,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        reactions: { like: 0, dislike: 0 }
      };

      const response = await axios.post(`${this.apiUrl}/comments`, comment);

      // Actualizar el contador de comentarios en el post
      await this.updatePostCommentCount(commentData.postId);

      return response.data;
    } catch (error) {
      console.error('Error al crear comentario:', error);
      throw error;
    }
  }

  async updateComment(id, commentData, user) {
    try {
      // Verificar si el usuario puede editar el comentario
      const comment = await this.getCommentById(id);

      if (comment.authorId !== user.id && !user.isAdmin) {
        throw new Error('No tienes permiso para editar este comentario');
      }

      const updatedComment = {
        ...comment,
        content: commentData.content,
        updatedAt: new Date().toISOString()
      };

      const response = await axios.put(`${this.apiUrl}/comments/${id}`, updatedComment);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar comentario ${id}:`, error);
      throw error;
    }
  }

  async deleteComment(id, user) {
    try {
      // Verificar si el usuario puede eliminar el comentario
      const comment = await this.getCommentById(id);

      if (comment.authorId !== user.id && !user.isAdmin) {
        throw new Error('No tienes permiso para eliminar este comentario');
      }

      await axios.delete(`${this.apiUrl}/comments/${id}`);

      // Actualizar el contador de comentarios en el post
      await this.updatePostCommentCount(comment.postId);

      return true;
    } catch (error) {
      console.error(`Error al eliminar comentario ${id}:`, error);
      throw error;
    }
  }

  async getCommentById(id) {
    try {
      const response = await axios.get(`${this.apiUrl}/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener comentario ${id}:`, error);
      throw error;
    }
  }

  async updatePostCommentCount(postId) {
    try {
      // Contar comentarios para este post
      const commentsResponse = await axios.get(`${this.apiUrl}/comments`, {
        params: { postId, _limit: 1000 }
      });

      const commentCount = commentsResponse.data.length;

      // Actualizar el contador en el post
      await axios.patch(`${this.apiUrl}/posts/${postId}`, {
        commentCount
      });

      return commentCount;
    } catch (error) {
      console.error(`Error al actualizar contador de comentarios para post ${postId}:`, error);
      throw error;
    }
  }
}
