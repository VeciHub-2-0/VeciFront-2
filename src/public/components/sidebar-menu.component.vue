<script>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'SidebarMenu',
  setup() {
    const { t } = useI18n();
    const authStore = useAuthStore();
    const router = useRouter();

    const isAdmin = computed(() => authStore.isAdmin);

    // Método para navegar programáticamente
    const navigateTo = (path) => {
      console.log('Navegando programáticamente a:', path);
      router.push(path);
    };

    return { t, isAdmin, navigateTo };
  }
}
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar-content">
      <!-- Logo y branding -->
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <i class="pi pi-home"></i>
          <span>VeciHub</span>
        </div>
      </div>

      <!-- Navegación principal -->
      <div class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/dashboard" class="sidebar-link">
              <i class="pi pi-th-large"></i>
              <span>{{ $t('sidebar.dashboard') }}</span>
            </router-link>
          </li>

          <li>
            <router-link to="/forum" class="sidebar-link">
              <i class="pi pi-comments"></i>
              <span>{{ $t('sidebar.forum') }}</span>
            </router-link>
          </li>

          <li>
            <router-link to="/events" class="sidebar-link">
              <i class="pi pi-calendar"></i>
              <span>{{ $t('sidebar.events') }}</span>
            </router-link>
          </li>

          <li>
            <router-link to="/polls" class="sidebar-link">
              <i class="pi pi-chart-bar"></i>
              <span>{{ $t('sidebar.polls') }}</span>
            </router-link>
          </li>

          <li v-if="isAdmin">
            <router-link to="/admin" class="sidebar-link">
              <i class="pi pi-cog"></i>
              <span>{{ $t('sidebar.admin') }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Separador -->
      <div class="sidebar-divider"></div>

      <!-- Usuario y configuración -->
      <div class="sidebar-footer">
        <ul>
          <li>
            <router-link to="/profile" class="sidebar-link">
              <i class="pi pi-user"></i>
              <span>{{ $t('sidebar.profile') }}</span>
            </router-link>
          </li>

          <li>
            <router-link to="/settings" class="sidebar-link">
              <i class="pi pi-cog"></i>
              <span>{{ $t('sidebar.settings') }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  width: 250px;
  height: 100vh;
  background-color: #FFFFFF;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 60px; /* Espacio para el header principal */
}

.sidebar-header {
  padding: 1.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #328E6E;
}

.sidebar-logo i {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.sidebar-nav ul, .sidebar-footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li, .sidebar-footer li {
  margin-bottom: 0.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #000000;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.sidebar-link i {
  font-size: 1.2rem;
  margin-right: 0.75rem;
  width: 1.5rem;
  text-align: center;
  color: #67AE6E;
}

.sidebar-link:hover {
  background-color: rgba(144, 198, 124, 0.15);
  border-left-color: #67AE6E;
}

.sidebar-link.router-link-active {
  background-color: rgba(144, 198, 124, 0.25);
  border-left-color: #328E6E;
  font-weight: 500;
}

.sidebar-link.router-link-active i {
  color: #328E6E;
}

.sidebar-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
  margin: 1rem 0;
}

.sidebar-footer {
  padding: 1rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .sidebar-container {
    width: 60px;
    display: flex !important;
    z-index: 1001;
  }

  .sidebar-link span {
    display: none;
  }

  .sidebar-link i {
    margin-right: 0;
    font-size: 1.3rem;
  }

  .sidebar-link {
    justify-content: center;
    padding: 0.75rem;
  }

  .sidebar-logo span {
    display: none;
  }

  .sidebar-logo i {
    margin-right: 0;
    font-size: 1.8rem;
  }
}
</style>
