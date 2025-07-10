<script>
import axios from 'axios'
import Card from 'primevue/card'

const API_URL = import.meta.env.VITE_API_BASE_URL

export default {
  name: 'ProfileComponent',
  components: { Card },
  data() {
    return {
      user: null,
      loading: true
    }
  },
  methods: {
    async fetchUser() {
      try {
        const storedUser = localStorage.getItem("user")
        if (!storedUser || storedUser === "undefined") {
          console.warn("No hay usuario en localStorage o está malformado")
          return
        }

        const parsedUser = JSON.parse(storedUser)
        const response = await axios.get(`${API_URL}/Users/${parsedUser.id}`)
        this.user = response.data
      } catch (error) {
        console.error("Error al obtener el perfil:", error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString()
    }
  },
  mounted() {
    this.fetchUser()
  }
}
</script>

<template>
  <div class="page-container">
    <h1>{{ $t('sidebar.profile') }}</h1>

    <Card v-if="user">
      <template #content>
        <h3>{{ user.name }}</h3>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Rol:</strong> {{ user.role || 'Usuario' }}</p>
        <p><strong>Nombre:</strong> {{ user.username }}</p>
      </template>
    </Card>

    <Card v-else>
      <template #content>
        <p>Cargando perfil...</p>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
h1 {
  color: #328E6E;
  margin-bottom: 1rem;
}
</style>
