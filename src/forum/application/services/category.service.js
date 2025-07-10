import axios from 'axios';

export class CategoryService {
  constructor() {
    this.apiUrl =  import.meta.env.VITE_API_BASE_URL;
  }

  async getCategories() {
    try {
      const response = await axios.get(`${this.apiUrl}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  async getCategoryById(id) {
    try {
      const response = await axios.get(`${this.apiUrl}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener categoría ${id}:`, error);
      throw error;
    }
  }

  async createCategory(categoryData, user) {
    try {
      // Verificar si el usuario es administrador
      if (!user.isAdmin) {
        throw new Error('Solo los administradores pueden crear categorías');
      }

      const category = {
        ...categoryData,
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(`${this.apiUrl}/categories`, category);
      return response.data;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }

  async updateCategory(id, categoryData, user) {
    try {
      // Verificar si el usuario es administrador
      if (!user.isAdmin) {
        throw new Error('Solo los administradores pueden actualizar categorías');
      }

      const category = await this.getCategoryById(id);
      const updatedCategory = {
        ...category,
        ...categoryData,
        updatedAt: new Date().toISOString()
      };

      const response = await axios.put(`${this.apiUrl}/categories/${id}`, updatedCategory);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar categoría ${id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id, user) {
    try {
      // Verificar si el usuario es administrador
      if (!user.isAdmin) {
        throw new Error('Solo los administradores pueden eliminar categorías');
      }

      await axios.delete(`${this.apiUrl}/categories/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar categoría ${id}:`, error);
      throw error;
    }
  }
}
