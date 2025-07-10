<script>
import FooterContent from './public/components/footer-content.component.vue';
import LanguageSwitcher from "./public/components/language-switcher.component.vue";
import NavigationMenu from "./public/components/navigation-menu.component.vue";
import SidebarMenu from "./public/components/sidebar-menu.component.vue";
import menuItems from "./public/config/menu.json";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ref } from 'vue';

export default {
  name: 'App',
  components: {
    LanguageSwitcher,
    FooterContent,
    NavigationMenu,
    SidebarMenu
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const { t } = useI18n();
    const sidebarExpanded = ref(true);

    function handleLogout() {
      authStore.logout();
      router.push('/login');
    }

    function toggleSidebar() {
      sidebarExpanded.value = !sidebarExpanded.value;
    }

    return { authStore, handleLogout, t, sidebarExpanded, toggleSidebar };
  },
  data() {
    return {
      allMenuItems: menuItems
    }
  },
  computed: {
    // Filtrar elementos del menú según el estado de autenticación
    menuItems() {
      if (this.authStore.isAuthenticated) {
        return this.allMenuItems.filter(item => item.requiresAuth);
      } else {
        return this.allMenuItems.filter(item => item.guest);
      }
    }
  },
  watch: {
    '$route' () {
      // Mejora de accesibilidad: enfoque en el contenido principal cuando cambia la ruta
      this.$nextTick(() => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus();
        }
      });
    }
  },
  created() {
    // Verificar autenticación al iniciar
    this.authStore.checkAuth();
  }
}
</script>

<template>
  <div class="app-container">
    <Toast position="bottom-right" />
    <ConfirmDialog />
    <header class="app-header">
      <Toolbar class="vecihub-header">
        <template #start>
          <Button v-if="authStore.isAuthenticated" 
            icon="pi pi-bars" 
            text 
            class="p-button-rounded p-button-text sidebar-toggle"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
          />
          <h1 class="app-title">VeciHub</h1>
        </template>
        <template #center>
          <navigation-menu v-if="!authStore.isAuthenticated" :items="menuItems" />
        </template>
        <template #end>
          <div class="flex align-items-center gap-2">
            <Button v-if="authStore.isAuthenticated" 
              icon="pi pi-sign-out" 
              text 
              severity="secondary" 
              @click="handleLogout" 
              :tooltip="$t('option.logout')"
              class="p-button-text p-button-rounded"
            />
            <language-switcher></language-switcher>
            <span v-if="authStore.currentUser" class="user-info">
              <span class="user-name text-white">{{ authStore.currentUser.name }}</span>
              <Tag :severity="authStore.isAdmin ? 'danger' : 'info'">
                {{ authStore.currentUser.role }}
              </Tag>
            </span>
          </div>
        </template>
      </Toolbar>
    </header>

    <!-- Layout con sidebar cuando el usuario está autenticado -->
          <div class="app-body" :class="{'sidebar-expanded': sidebarExpanded, 'with-auth': authStore.isAuthenticated}">
      <transition name="sidebar">
        <sidebar-menu v-if="authStore.isAuthenticated" />
      </transition>

      <main class="app-main" :class="{'with-sidebar': authStore.isAuthenticated}">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <footer class="app-footer">
      <footer-content></footer-content>
    </footer>

    <!-- Overlay para móviles cuando el sidebar está expandido -->
    <div v-if="authStore.isAuthenticated && sidebarExpanded" 
         class="sidebar-overlay" 
         @click="toggleSidebar">
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #FAF1E6; /* Fondo principal */
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  color: #FFFFFF;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-body {
  display: flex;
  flex: 1;
  position: relative;
}

.app-main {
  flex: 1;
  padding: 1rem;
  min-height: calc(100vh - 140px); /* Restar aproximadamente header y footer */
  transition: margin-left 0.3s ease;
}

.app-main.with-sidebar {
  margin-left: 250px;
  min-height: calc(100vh - 180px);
}

.app-footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: auto;
  padding: 1rem;
  background-color: #f8f8f8;
}

/* Estilos para el sidebar */
.sidebar-toggle {
  margin-right: 1rem;
  color: white !important;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

/* Transiciones */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 500;
  font-size: 0.9rem;
}

/* Transición para cambio de rutas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos de colores personalizados */
.vecihub-header {
  background-color: #328E6E !important;
  color: #FFFFFF;
}

/* Asegurar que la barra lateral siempre esté visible */
.app-body.with-auth .sidebar-container {
  display: flex !important;
}

.app-body.with-auth .sidebar-menu {
  display: block !important;
}

/* Responsive */
@media (max-width: 768px) {
  .app-main {
    padding: 0.5rem;
  }

  .app-title {
    font-size: 1.2rem;
  }

  .user-info {
    display: none;
  }

  .app-main.with-sidebar {
    margin-left: 60px;
  }

  .sidebar-overlay {
    display: block;
  }

  .sidebar-expanded .app-main.with-sidebar {
    margin-left: 250px;
  }
}
</style>