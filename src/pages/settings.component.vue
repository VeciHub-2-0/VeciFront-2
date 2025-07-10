<script>
import Panel from 'primevue/panel';
import Card from 'primevue/card';

export default {
  name: 'SettingsComponent',
  components: {
    Panel,
    Card
  }
}
</script>

<template>
  <div class="page-container">
    <h1>{{ $t('sidebar.settings') }}</h1>

    <Card>
      <template #content>
        <h3>{{ $t('settings.comingSoon') }}</h3>
        <p>{{ $t('settings.implementationMessage') }}</p>
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
