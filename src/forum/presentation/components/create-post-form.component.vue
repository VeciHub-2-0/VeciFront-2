<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { PostService } from '../../application/services/post.service';
import { useAuthStore } from '../../../stores/auth';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';

export default {
  name: 'CreatePostForm',
  components: {
    Button,
    InputText,
    Textarea,
    FileUpload,
    Image
  },
  props: {
    postId: {
      type: [Number, String, null],
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();
    const authStore = useAuthStore();
    const postService = new PostService();

    const submitting = ref(false);
    const uploadedFiles = ref([]);

    const postForm = reactive({
      title: '',
      content: '',
      images: []
    });

    const formErrors = reactive({
      title: '',
      content: ''
    });

    // Manejar la subida de imágenes
    const handleFileUpload = (event) => {
      const files = event.files;
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Añadir la imagen al array de imágenes del post
          postForm.images.push(e.target.result);
          // Añadir a archivos subidos para mostrar previsualización
          uploadedFiles.value.push({
            name: file.name,
            url: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }

      toast.add({
        severity: 'success',
        summary: 'Imágenes cargadas',
        detail: `${files.length} ${files.length === 1 ? 'imagen subida' : 'imágenes subidas'} correctamente`,
        life: 3000
      });
    };

    // Eliminar una imagen
    const removeImage = (index) => {
      postForm.images.splice(index, 1);
      uploadedFiles.value.splice(index, 1);
    };

    // Validar el formulario
    const validateForm = () => {
      let isValid = true;

      // Resetear errores
      formErrors.title = '';
      formErrors.content = '';

      // Validar título
      if (!postForm.title.trim()) {
        formErrors.title = 'El título es obligatorio';
        isValid = false;
      } else if (postForm.title.trim().length < 3) {
        formErrors.title = 'El título debe tener al menos 3 caracteres';
        isValid = false;
      } else if (postForm.title.trim().length > 100) {
        formErrors.title = 'El título debe tener menos de 100 caracteres';
        isValid = false;
      }

      // Validar contenido
      if (!postForm.content.trim()) {
        formErrors.content = 'El contenido es obligatorio';
        isValid = false;
      } else if (postForm.content.trim().length < 5) {
        formErrors.content = 'El contenido debe tener al menos 5 caracteres';
        isValid = false;
      }

      return isValid;
    };

    // Enviar el formulario
    const handleSubmit = async () => {
      if (!validateForm()) {
        toast.add({
          severity: 'warn',
          summary: 'Formulario incompleto',
          detail: 'Por favor, corrige los errores en el formulario',
          life: 3000
        });
        return;
      }

      submitting.value = true;

      try {
        console.log('Enviando formulario:', postForm);
        console.log('Usuario actual:', authStore.currentUser);

        // Verificar si el usuario está autenticado
        if (!authStore.currentUser) {
          throw new Error('Debes iniciar sesión para publicar');
        }

        // Crear nuevo post simplificado
        const newPost = await postService.createPost(
          {
            title: postForm.title,
            content: postForm.content,
            images: postForm.images
          },
          {
            id: authStore.currentUser.id,
            name: authStore.currentUser.name
          }
        );

        toast.add({
          severity: 'success',
          summary: 'Publicación creada',
          detail: 'Tu publicación ha sido creada correctamente',
          life: 3000
        });

        // Redirigir al foro principal después de publicar
        router.push('/forum');
      } catch (err) {
        console.error('Error al guardar la publicación:', err);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'No se pudo guardar la publicación. Inténtalo de nuevo.',
          life: 5000
        });
      } finally {
        submitting.value = false;
      }
    };

    const handleCancel = () => {
      router.push('/forum');
    };

    return {
      submitting,
      postForm,
      formErrors,
      uploadedFiles,
      handleFileUpload,
      removeImage,
      handleSubmit,
      handleCancel
    };
  }
};
</script>

<template>
  <div class="create-post-form">
    <h2 class="form-title mb-4">Crear nueva publicación</h2>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="p-fluid">
      <!-- Título -->
      <div class="field mb-4">
        <label for="title" class="font-semibold block mb-2">Título *</label>
        <InputText 
          id="title" 
          v-model="postForm.title" 
          :class="{'p-invalid': formErrors.title}"
          placeholder="Escribe un título descriptivo"
          aria-describedby="title-help"
        />
        <small id="title-help" class="p-error block">{{ formErrors.title }}</small>
      </div>

      <!-- Contenido -->
      <div class="field mb-4">
        <label for="content" class="font-semibold block mb-2">Descripción *</label>
        <Textarea 
          id="content" 
          v-model="postForm.content" 
          rows="10"
          :class="{'p-invalid': formErrors.content}"
          placeholder="Escribe el contenido de tu publicación"
          aria-describedby="content-help"
          autoResize
        />
        <small id="content-help" class="p-error block">{{ formErrors.content }}</small>
      </div>

      <!-- Subida de imágenes -->
      <div class="field mb-4">
        <label class="font-semibold block mb-2">Imágenes (opcional)</label>
        <FileUpload
          mode="basic"
          name="demo[]"
          :multiple="true"
          accept="image/*"
          :maxFileSize="1000000"
          customUpload
          @uploader="handleFileUpload"
          chooseLabel="Seleccionar imágenes"
          class="mb-3"
        />
        <small class="block text-500 mb-3">Puedes subir hasta 5 imágenes de máximo 1MB cada una.</small>

        <!-- Previsualización de imágenes -->
        <div v-if="uploadedFiles.length > 0" class="image-preview-container mt-3">
          <h4 class="mb-2">Imágenes seleccionadas:</h4>
          <div class="flex flex-wrap gap-3">
            <div v-for="(file, index) in uploadedFiles" :key="index" class="image-preview-item">
              <div class="relative">
                <Image 
                  :src="file.url" 
                  alt="Vista previa" 
                  width="150" 
                  preview 
                  class="border-round"
                />
                <Button 
                  icon="pi pi-times" 
                  class="p-button-rounded p-button-danger p-button-sm image-remove-btn"
                  @click="removeImage(index)"
                  aria-label="Eliminar imagen"
                />
              </div>
              <small class="mt-1 text-center block text-truncate" style="max-width: 150px">
                {{ file.name }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-content-end gap-2 mt-5">
        <Button 
          type="button"
          label="Cancelar" 
          icon="pi pi-times"
          class="p-button-outlined"
          @click="handleCancel"
        />
        <Button 
          type="submit"
          label="Publicar"
          icon="pi pi-check"
          :loading="submitting"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-post-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background-color: var(--surface-card);
  border-radius: 8px;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,0.1), 0 1px 1px 0 rgba(0,0,0,0.07), 0 1px 3px 0 rgba(0,0,0,0.06);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-200);
}

.image-preview-container {
  background-color: var(--surface-50);
  padding: 1rem;
  border-radius: 8px;
}

.image-preview-item {
  position: relative;
  margin-bottom: 1rem;
}

.image-remove-btn {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 1.5rem;
  height: 1.5rem;
}
</style>
