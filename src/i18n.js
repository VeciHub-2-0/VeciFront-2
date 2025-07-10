import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import en from './locales/en.json';

// Obtener idioma guardado o usar español por defecto
const savedLocale = localStorage.getItem('vecihub-lang') || navigator.language.startsWith('en') ? 'en' : 'es';

const i18n = createI18n({
    locale: savedLocale,
    fallbackLocale: 'es',
    legacy: false, // Habilitar Composition API
    globalInjection: true,
    messages: { es, en }
});

export default i18n;