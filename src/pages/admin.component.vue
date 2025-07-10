<script>
import Panel from 'primevue/panel';

export default {
  name: 'AdminComponent',
  components: {
    Panel
  }
}
</script>

<template>
  <div class="page-container">
    <h1>{{ $t('sidebar.admin') }}</h1>

    <Card>
      <template #content>
        <h3>{{ $t('admin.comingSoon') }}</h3>
        <p>{{ $t('admin.implementationMessage') }}</p>
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
