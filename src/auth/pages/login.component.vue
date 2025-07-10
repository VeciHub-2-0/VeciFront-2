<script>
import { reactive, ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

export default {
  name: 'LoginComponent',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const toast = useToast();
    const { t } = useI18n();
    const loading = ref(false);
    const rememberMe = ref(false);

    const loginForm = reactive({
      email: "",
      password: "",
    });

    const errors = reactive({
      email: "",
      password: "",
    });

    function validateForm() {
      let isValid = true;

      // Validar email
      if (!loginForm.email) {
        errors.email = t('validation.required', { field: t('auth.email') });
        isValid = false;
      } else if (!loginForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = t('validation.invalidEmail');
        isValid = false;
      } else {
        errors.email = "";
      }

      // Validar contraseña
      if (!loginForm.password) {
        errors.password = t('validation.required', { field: t('auth.password') });
        isValid = false;
      } else {
        errors.password = "";
      }

      return isValid;
    }

    function handleLogin() {
      if (!validateForm()) return;

      loading.value = true;
      console.log('Intentando iniciar sesión con:', loginForm.email, loginForm.password);

      // Simulación de retraso de red
      setTimeout(() => {
        const success = authStore.login(loginForm.email, loginForm.password, rememberMe.value);
        console.log('Resultado de autenticación:', success);

        if (success) {
          console.log('Autenticación exitosa, redirigiendo al foro...');
          toast.add({
            severity: 'success',
            summary: t('auth.welcome'),
            detail: t('auth.loginSuccess'),
            life: 3000
          });

          // Usar nextTick para asegurar que el estado se actualice antes de la redirección
          setTimeout(() => {
            router.push('/forum');
          }, 500);
        } else {
          toast.add({
            severity: 'error',
            summary: t('common.error'),
            detail: t('auth.invalidCredentials'),
            life: 3000
          });
        }

        loading.value = false;
      }, 800);
    }

    return {
      loginForm,
      errors,
      loading,
      rememberMe,
      handleLogin,
      t
    };
  }
};
</script>

<template>
  <div class="flex justify-content-center">
    <Card class="login-card">
      <template #title>
        <div class="text-center">
          <h2>VeciHub</h2>
          <p class="text-sm text-500">{{ $t('auth.loginSubtitle') }}</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-column gap-3">
          <div class="field">
            <label for="email" class="block mb-1">{{ $t('auth.email') }}</label>
            <InputText
              id="email"
              v-model="loginForm.email"
              :class="{'p-invalid': errors.email}"
              :placeholder="$t('auth.emailPlaceholder')"
              class="w-full"
            />
            <small class="p-error block">{{ errors.email }}</small>
          </div>

          <div class="field">
            <label for="password" class="block mb-1">{{ $t('auth.password') }}</label>
            <InputText
              id="password"
              v-model="loginForm.password"
              :class="{'p-invalid': errors.password}"
              type="password"
              :placeholder="$t('auth.passwordPlaceholder')"
              class="w-full"
            />
            <small class="p-error block">{{ errors.password }}</small>
          </div>

          <div class="flex align-items-center justify-content-between mb-3">
            <Checkbox v-model="rememberMe" id="rememberMe" :binary="true"></Checkbox>
            <label for="rememberMe" class="ml-2 cursor-pointer">{{ $t('auth.rememberMe') }}</label>
            <a href="#" class="font-medium text-primary">{{ $t('auth.forgotPassword') }}</a>
          </div>

          <Button
            type="submit"
            :label="$t('auth.loginButton')"
            icon="pi pi-sign-in"
            class="w-full p-button-lg p-button-raised login-button"
            severity="primary"
            size="large"
            :loading="loading"
          />
        </form>
      </template>

      <template #footer>
        <div class="text-center mt-3">
          <p>{{ $t('auth.noAccount') }} <router-link to="/register" class="font-bold">{{ $t('auth.registerHere') }}</router-link></p>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.login-card {
  max-width: 450px;
  width: 100%;
  margin: 2rem auto;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.field label {
  font-weight: 500;
}

/* Aumentar visibilidad del botón de acción */
:deep(.p-button-lg) {
  padding: 0.75rem 1.25rem;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: transform 0.2s;
}

:deep(.p-button-lg:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.login-button {
  margin-top: 1rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
  border: none;
  height: 3.2rem;
  font-size: 1.2rem;
}

.login-button:hover {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
}
</style>
