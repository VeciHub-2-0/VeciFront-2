<script>
import { reactive, ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

export default {
  name: 'RegisterComponent',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const toast = useToast();
    const { t } = useI18n();
    const loading = ref(false);
    const acceptTerms = ref(false);

    const registerForm = reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "vecino",
    });

    const errors = reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      terms: ""
    });

    const roleOptions = [
      { label: t('auth.roleResident'), value: 'vecino' },
      { label: t('auth.roleAdmin'), value: 'administrador' }
    ];

    function validateForm() {
      let isValid = true;

      // Validar nombre
      if (!registerForm.name.trim()) {
        errors.name = t('validation.required', { field: t('auth.name') });
        isValid = false;
      } else {
        errors.name = "";
      }

      // Validar email
      if (!registerForm.email) {
        errors.email = t('validation.required', { field: t('auth.email') });
        isValid = false;
      } else if (!registerForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = t('validation.invalidEmail');
        isValid = false;
      } else {
        errors.email = "";
      }

      // Validar contraseña
      if (!registerForm.password) {
        errors.password = t('validation.required', { field: t('auth.password') });
        isValid = false;
      } else if (registerForm.password.length < 8) {
        errors.password = t('validation.minLength', { field: t('auth.password'), min: 8 });
        isValid = false;
      } else if (!registerForm.password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
        errors.password = t('validation.passwordSpecialChar');
        isValid = false;
      } else {
        errors.password = "";
      }

      // Validar confirmación de contraseña
      if (registerForm.password !== registerForm.confirmPassword) {
        errors.confirmPassword = t('validation.passwordMatch');
        isValid = false;
      } else {
        errors.confirmPassword = "";
      }

      // Validar que se haya seleccionado un rol
      if (!registerForm.role) {
        errors.role = t('validation.required', { field: t('auth.role') });
        isValid = false;
      } else {
        errors.role = "";
      }

      // Validar que se hayan aceptado los términos y condiciones
      if (!acceptTerms.value) {
        errors.terms = t('validation.acceptTerms');
        isValid = false;
      } else {
        errors.terms = "";
      }

      return isValid;
    }

    function handleRegister() {
      if (!validateForm()) return;

      loading.value = true;

      // Simulación de retraso de red
      setTimeout(() => {
        const result = authStore.register({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          role: registerForm.role
        });

        if (result.success) {
          toast.add({
            severity: 'success',
            summary: t('auth.registerSuccess'),
            detail: t('auth.accountCreated'),
            life: 3000
          });
          router.push("/login");
        } else {
          toast.add({
            severity: 'error',
            summary: t('common.error'),
            detail: result.message,
            life: 3000
          });
        }

        loading.value = false;
      }, 800);
    }

    return {
      registerForm,
      errors,
      roleOptions,
      loading,
      acceptTerms,
      handleRegister,
      t
    };
  }
};
</script>

<template>
  <div class="flex justify-content-center">
    <Card class="register-card">
      <template #title>
        <div class="text-center">
          <h2>{{ $t('auth.registerTitle') }}</h2>
          <p class="text-sm text-500">{{ $t('auth.registerSubtitle') }}</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleRegister" class="flex flex-column gap-3">
          <div class="field">
            <label for="name" class="block mb-1">{{ $t('auth.name') }}</label>
            <InputText
              id="name"
              v-model="registerForm.name"
              :class="{'p-invalid': errors.name}"
              :placeholder="$t('auth.namePlaceholder')"
              class="w-full"
            />
            <small class="p-error block">{{ errors.name }}</small>
          </div>

          <div class="field">
            <label for="reg-email" class="block mb-1">{{ $t('auth.email') }}</label>
            <InputText
              id="reg-email"
              v-model="registerForm.email"
              :class="{'p-invalid': errors.email}"
              :placeholder="$t('auth.emailPlaceholder')"
              class="w-full"
            />
            <small class="p-error block">{{ errors.email }}</small>
          </div>

          <div class="field">
            <label for="reg-password" class="block mb-1">{{ $t('auth.password') }}</label>
            <InputText
              id="reg-password"
              v-model="registerForm.password"
              :class="{'p-invalid': errors.password}"
              type="password"
              :placeholder="$t('auth.passwordPlaceholder')"
              class="w-full"
            />
            <small class="p-error block">{{ errors.password }}</small>
          </div>

          <div class="field">
            <label for="confirm-password" class="block mb-1">{{ $t('auth.confirmPassword') }}</label>
            <InputText
              id="confirm-password"
              v-model="registerForm.confirmPassword"
              :class="{'p-invalid': errors.confirmPassword}"
              type="password"
              :placeholder="$t('auth.confirmPasswordPlaceholder')"
              class="w-full"
            />
            <small class="p-error block">{{ errors.confirmPassword }}</small>
          </div>

          <div class="field role-selection">
            <label class="block mb-2">{{ $t('auth.role') }}</label>
            <div class="role-options">
              <div
                v-for="option in roleOptions"
                :key="option.value"
                class="role-option"
                :class="{ 'selected': registerForm.role === option.value }"
                @click="registerForm.role = option.value"
              >
                <div class="role-icon">
                  <i :class="option.value === 'vecino' ? 'pi pi-home' : 'pi pi-cog'"></i>
                </div>
                <div class="role-details">
                  <h3>{{ option.value === 'vecino' ? $t('auth.roleResident') : $t('auth.roleAdmin') }}</h3>
                  <p v-if="option.value === 'vecino'">{{ $t('auth.roleResidentDesc') }}</p>
                  <p v-else>{{ $t('auth.roleAdminDesc') }}</p>
                </div>
                <div class="role-check">
                  <i class="pi pi-check-circle" v-if="registerForm.role === option.value"></i>
                </div>
              </div>
            </div>
            <small class="p-error block">{{ errors.role }}</small>
          </div>

          <div class="mt-4 mb-2">
            <div class="flex align-items-center mb-3">
              <Checkbox v-model="acceptTerms" id="acceptTerms" :binary="true" :class="{'p-invalid': errors.terms}"></Checkbox>
              <label for="acceptTerms" class="ml-2 cursor-pointer">{{ $t('auth.acceptTerms') }}</label>
            </div>
            <small class="p-error block">{{ errors.terms }}</small>
          </div>

          <Button
            type="submit"
            :label="$t('auth.registerButton')"
            icon="pi pi-user-plus"
            class="w-full register-button p-button-lg p-button-raised"
            severity="primary"
            size="large"
            :loading="loading"
          />
        </form>
      </template>

      <template #footer>
        <div class="text-center mt-3">
          <p>{{ $t('auth.haveAccount') }} <router-link to="/login" class="font-bold">{{ $t('auth.loginHere') }}</router-link></p>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.register-card {
  max-width: 500px;
  width: 100%;
  margin: 2rem auto;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.field label {
  font-weight: 500;
}

.register-button {
  margin-top: 1rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
  border: none;
  height: 3.2rem;
  font-size: 1.2rem;
}

.register-button:hover {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
}

/* Estilos mejorados para selección de rol */
.role-selection {
  margin-top: 0.5rem;
}

.role-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.role-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-option:hover {
  background-color: #f8f9fa;
}

.role-option.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-color-alpha-10);
}

.role-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color-alpha-20);
  margin-right: 1rem;
}

.role-icon i {
  font-size: 1.2rem;
  color: var(--primary-color);
}

.role-details {
  flex: 1;
}

.role-details h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.role-details p {
  margin: 0.3rem 0 0;
  font-size: 0.8rem;
  color: #666;
}

.role-check {
  color: var(--primary-color);
  font-size: 1.2rem;
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
</style>
