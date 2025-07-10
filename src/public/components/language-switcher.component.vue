<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    const languages = [
      { code: 'es', name: 'ES' },
      { code: 'en', name: 'EN' }
    ];

    const selectedLanguage = computed(() => {
      return languages.find(lang => lang.code === locale.value) || languages[0];
    });

    function changeLocale(code) {
      locale.value = code;
      localStorage.setItem('vecihub-lang', code);
    }

    return {
      locale,
      languages,
      selectedLanguage,
      changeLocale
    };
  }
};
</script>

<template>
  <div class="language-switcher">
    <Button 
      :label="selectedLanguage.name"
      class="p-button-sm p-button-outlined p-button-rounded p-button-secondary"
      aria-haspopup="true"
      aria-controls="language-menu"
      icon="pi pi-globe"
      @click="$refs.menu.toggle($event)"
    />

    <Menu ref="menu" id="language-menu" :model="languages.map(lang => ({
      label: lang.name,
      command: () => changeLocale(lang.code),
      class: locale === lang.code ? 'active-language' : ''
    }))" :popup="true" />
  </div>
</template>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
}

:deep(.active-language) {
  background-color: var(--primary-color-alpha-10);
  font-weight: bold;
}

:deep(.p-button-sm) {
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
}
</style>