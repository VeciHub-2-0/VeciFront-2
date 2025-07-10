<script>
import { useI18n } from 'vue-i18n';

export default {
  name: "footer-content",
  setup() {
    const { t } = useI18n();

    const currentYear = new Date().getFullYear();

    return { t, currentYear };
  }
}
</script>

<template>
  <div class="footer-container">
    <div class="footer-content">
      <!-- Logo y descripción -->
      <div class="footer-section company-info">
        <div class="footer-logo">
          <h2>VeciHub</h2>
          <span class="logo-tagline">{{ $t('footer.tagline') }}</span>
        </div>
        <p class="company-description">{{ $t('footer.description') }}</p>
      </div>

      <!-- Enlaces útiles -->
      <div class="footer-section links">
        <h3>{{ $t('footer.usefulLinks') }}</h3>
        <ul>
          <li><a href="#">{{ $t('footer.aboutUs') }}</a></li>
          <li><a href="#">{{ $t('footer.services') }}</a></li>
          <li><a href="#">{{ $t('footer.contact') }}</a></li>
          <li><a href="#">{{ $t('footer.privacy') }}</a></li>
          <li><a href="#">{{ $t('footer.terms') }}</a></li>
        </ul>
      </div>

      <!-- Contáctanos -->
      <div class="footer-section contact">
        <h3>{{ $t('footer.contactUs') }}</h3>
        <p><i class="pi pi-map-marker"></i> {{ $t('footer.address') }}</p>
        <p><i class="pi pi-phone"></i> +1 (555) 123-4567</p>
        <p><i class="pi pi-envelope"></i> info@vecihub.com</p>
      </div>

      <!-- Boletín y redes sociales -->
      <div class="footer-section newsletter">
        <h3>{{ $t('footer.stayConnected') }}</h3>
        <p>{{ $t('footer.newsletterText') }}</p>
        <div class="newsletter-form">
          <InputText placeholder="Email" class="w-full mb-2" />
          <Button :label="$t('footer.subscribe')" class="p-button-sm w-full" severity="secondary" />
        </div>
        <div class="social-icons">
          <a href="#" aria-label="Facebook"><i class="pi pi-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i class="pi pi-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i class="pi pi-instagram"></i></a>
          <a href="#" aria-label="LinkedIn"><i class="pi pi-linkedin"></i></a>
          <a href="#" aria-label="YouTube"><i class="pi pi-youtube"></i></a>
        </div>
      </div>
    </div>

    <!-- Barra inferior con copyright -->
    <div class="footer-bottom">
      <div class="copyright">
        <p>&copy; {{ currentYear }} VeciHub. {{ $t('footer.rightsReserved') }}</p>
      </div>
      <div class="footer-credits">
        <p>
          {{ $t('authoring-phrase.intro') }} <i class="pi pi-heart" style="color: #67AE6E;" />
          {{ $t('authoring-phrase.use') }} <a href="https://primevue.org" target="_blank" rel="noopener">PrimeVue</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Variables de colores del proyecto */
:root {
  --vecihub-primary: #328E6E;
  --vecihub-header-bg: #FDFAF6;
  --vecihub-text: #000000;
  --vecihub-button: #67AE6E;
  --vecihub-button-hover: #589F61;
  --vecihub-section-bg: #90C67C;
  --vecihub-text-light: #FFFFFF;
  --vecihub-main-bg: #FAF1E6;
  --vecihub-input-bg: #D9D9D9;
  --vecihub-error: #E74C3C;
  --vecihub-warning: #F5B041;
  --vecihub-success: #28B463;
  --vecihub-info: #3498DB;
}

.footer-container {
  width: 100%;
  color: var(--vecihub-text-light);
  background: linear-gradient(135deg, var(--vecihub-primary) 0%, #256E55 100%);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  position: relative;
  padding-bottom: 0.5rem;
  color: var(--vecihub-text-light);
}

.footer-section h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background-color: var(--vecihub-section-bg);
}

.footer-logo h2 {
  font-size: 1.8rem;
  margin: 0;
  color: var(--vecihub-text-light);
}

.logo-tagline {
  font-size: 0.9rem;
  color: #B8E6D9; /* Versión más clara del color principal */
}

.company-description {
  margin-top: 1rem;
  line-height: 1.6;
  color: #E8F4E9; /* Color claro para textos en el footer */
}

.links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.links li {
  margin-bottom: 0.8rem;
}

.links a {
  color: #E8F4E9;
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-block;
  position: relative;
}

.links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: var(--vecihub-section-bg);
  transition: width 0.3s ease;
}

.links a:hover {
  color: var(--vecihub-text-light);
}

.links a:hover::after {
  width: 100%;
}

.contact p {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
}

.contact i {
  margin-right: 0.8rem;
  color: var(--vecihub-section-bg);
  font-size: 1rem;
}

.newsletter p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.newsletter-form {
  margin-bottom: 1rem;
}

/* Estilos del botón de suscripción */
.newsletter-form :deep(.p-button) {
  background-color: var(--vecihub-button);
  border-color: var(--vecihub-button);
  color: var(--vecihub-text-light);
}

.newsletter-form :deep(.p-button:hover) {
  background-color: var(--vecihub-button-hover);
  border-color: var(--vecihub-button-hover);
}

.social-icons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--vecihub-text-light);
  transition: all 0.3s ease;
}

.social-icons a:hover {
  background-color: var(--vecihub-button);
  transform: translateY(-3px);
}

.footer-bottom {
  padding: 1.5rem 2rem;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.footer-bottom p {
  margin: 0;
}

.footer-credits a {
  color: var(--vecihub-section-bg);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-credits a:hover {
  color: var(--vecihub-text-light);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1rem;
  }
}
</style>