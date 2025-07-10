import { defineStore } from "pinia";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentUser: null,
    isAuthenticated: false,
  }),
  getters: {
    isAdmin: (state) => state.currentUser?.role === "admin",
    isResident: (state) => state.currentUser?.role === "user",
  },
  actions: {
    async login(email, password) {
  try {
    console.log("### INICIANDO SESIÓN ###");
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { token, user } = response.data;

    if (!user || !user.id) {
      console.warn("La respuesta no contiene un usuario válido:", response.data);
      return { success: false, message: "Usuario inválido recibido del backend" };
    }

    this.currentUser = user;
    this.isAuthenticated = true;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); // ← aquí se guarda bien

    console.log("✅ Usuario guardado en localStorage:", JSON.stringify(user));
    return { success: true };
  } catch (error) {
    console.error("❌ Error de login:", error.response?.data || error.message);
    return { success: false, message: "Credenciales inválidas" };
  }
}
,

    async register({ name, email, password }) {
      try {
        const response = await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          password,
        });
        return { success: true, message: response.data.message };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || "Error en el registro",
        };
      }
    },

    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    checkAuth() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user && user !== "undefined") {
        this.isAuthenticated = true;
        this.currentUser = JSON.parse(user);
      } else {
        this.logout();
      }
    },
  },
});
