<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useI18n } from 'vue-i18n';

export default {
  name: 'NavigationMenu',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { t } = useI18n();

    function handleLogout() {
      authStore.logout();
      router.push('/login');
    }

    return { handleLogout, t };
  }
}
</script>

<template>
  <nav>
    <template v-for="item in items" :key="item.label">
      <!-- Manejo especial para el enlace de logout -->
      <Button 
        v-if="item.to === '/logout'" 
        :label="t(item.labelKey)"
        @click="handleLogout"
        text
        class="p-button-text"
      />
      <!-- Enlaces regulares -->
      <Button 
        v-else
        :label="t(item.labelKey)"
        text
        class="p-button-text"
        @click="$router.push(item.to)"
      />
    </template>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  gap: 0.5rem;
}
</style>

<style scoped>
nav {
  display: flex;
  gap: 0.5rem;
}
</style>
