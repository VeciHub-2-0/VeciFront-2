<script>
import Panel from 'primevue/panel';
import Card from 'primevue/card';

export default {
  name: 'PollsComponent',
  components: {
    Panel,
    Card
  }
}
</script>

<template>
  <div class="page-container">
    <h1>{{ $t('sidebar.polls') }}</h1>
    <p>{{ $t('dashboard.pollsDescription') }}</p>

    <Card>
      <template #content>
        <h3>{{ $t('polls.comingSoon') }}</h3>
        <p>{{ $t('polls.implementationMessage') }}</p>
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
