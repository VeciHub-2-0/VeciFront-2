<script>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/auth';
import Panel from 'primevue/panel';

export default {
  name: 'DashboardComponent',
  components: {
    Panel
  },
  setup() {
    const { t } = useI18n();
    const authStore = useAuthStore();

    return { t, authStore };
  }
}
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>{{ $t('dashboard.title') }}</h1>
      <p class="welcome-message">{{ $t('dashboard.welcome', { name: authStore.currentUser?.name }) }}</p>
    </div>

    <div class="dashboard-content">
      <div class="grid">
        <!-- Tarjeta de foro -->
        <div class="col-12 md:col-4">
          <div class="dashboard-card">
            <div class="card-icon forum-icon">
              <i class="pi pi-comments"></i>
            </div>
            <div class="card-content">
              <h3>{{ $t('sidebar.forum') }}</h3>
              <p>{{ $t('dashboard.forumDescription') }}</p>
              <router-link to="/forum" class="card-link">
                {{ $t('dashboard.goToForum') }} <i class="pi pi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Tarjeta de eventos -->
        <div class="col-12 md:col-4">
          <div class="dashboard-card">
            <div class="card-icon event-icon">
              <i class="pi pi-calendar"></i>
            </div>
            <div class="card-content">
              <h3>{{ $t('sidebar.events') }}</h3>
              <p>{{ $t('dashboard.eventsDescription') }}</p>
              <router-link to="/events" class="card-link">
                {{ $t('dashboard.goToEvents') }} <i class="pi pi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Tarjeta de votaciones -->
        <div class="col-12 md:col-4">
          <div class="dashboard-card">
            <div class="card-icon poll-icon">
              <i class="pi pi-chart-bar"></i>
            </div>
            <div class="card-content">
              <h3>{{ $t('sidebar.polls') }}</h3>
              <p>{{ $t('dashboard.pollsDescription') }}</p>
              <router-link to="/polls" class="card-link">
                {{ $t('dashboard.goToPolls') }} <i class="pi pi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de acciones rápidas -->
      <div class="quick-actions">
        <h2>{{ $t('dashboard.quickActions') }}</h2>
        <div class="grid">
          <div class="col-6 md:col-3">
            <Button class="p-button-outlined p-button-success action-button" icon="pi pi-plus">
              {{ $t('dashboard.newForumTopic') }}
            </Button>
          </div>
          <div class="col-6 md:col-3">
            <Button class="p-button-outlined p-button-warning action-button" icon="pi pi-calendar-plus">
              {{ $t('dashboard.proposeEvent') }}
            </Button>
          </div>
          <div class="col-6 md:col-3">
            <Button class="p-button-outlined p-button-info action-button" icon="pi pi-inbox">
              {{ $t('dashboard.messages') }}
            </Button>
          </div>
          <div class="col-6 md:col-3">
            <Button class="p-button-outlined p-button-help action-button" icon="pi pi-cog">
              {{ $t('dashboard.settings') }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Información de la comunidad -->
      <div class="community-info">
        <h2>{{ $t('dashboard.communityInfo') }}</h2>
        <div class="grid">
          <div class="col-12 md:col-6">
            <Panel header="Anuncios recientes">
              <p>Próximamente se publicarán anuncios importantes de la comunidad.</p>
            </Panel>
          </div>
          <div class="col-12 md:col-6">
            <Panel header="Contactos importantes">
              <ul class="contact-list">
                <li><i class="pi pi-phone"></i> Administración: (123) 456-7890</li>
                <li><i class="pi pi-phone"></i> Seguridad: (123) 456-7891</li>
                <li><i class="pi pi-phone"></i> Mantenimiento: (123) 456-7892</li>
                <li><i class="pi pi-envelope"></i> info@vecihub.com</li>
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.dashboard-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  color: #328E6E;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.welcome-message {
  font-size: 1.2rem;
  color: #666;
}

.dashboard-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.card-icon i {
  font-size: 1.8rem;
  color: white;
}

.forum-icon {
  background-color: #67AE6E;
}

.event-icon {
  background-color: #F5B041;
}

.poll-icon {
  background-color: #3498DB;
}

.card-content h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.card-content p {
  color: #666;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.card-link {
  color: #328E6E;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.card-link:hover {
  color: #256E55;
}

.quick-actions {
  margin: 2rem 0;
}

.quick-actions h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.5rem;
}

.action-button {
  width: 100%;
  justify-content: center;
  margin-bottom: 1rem;
}

.community-info {
  margin: 2rem 0;
}

.community-info h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.5rem;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-list li {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.contact-list li i {
  margin-right: 0.5rem;
  color: #328E6E;
}
</style>
