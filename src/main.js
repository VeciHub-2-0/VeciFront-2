console.log("🔥 ENV VARS:", import.meta.env);
import { createApp } from 'vue'
import './style.css'
import './assets/css/variables.css'
import App from './App.vue'
import i18n from './i18n.js'
import PrimeVue from 'primevue/config';

// Importar componentes individuales de PrimeVue
import SelectButton from 'primevue/selectbutton';
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Card from "primevue/card";
import Panel from "primevue/panel";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import DataTable from "primevue/datatable";
import Drawer from "primevue/drawer";
import FileUpload from "primevue/fileupload";
import FloatLabel from "primevue/floatlabel";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import Rating from "primevue/rating";
import Row from "primevue/row";
import Select from "primevue/select";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";

// Servicios de PrimeVue - IMPORTACIÓN CORREGIDA
import ConfirmationService from "primevue/confirmationservice";
import DialogService from "primevue/dialogservice";
import ToastService from "primevue/toastservice";

import router from "./router/index.js";
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css';
import Material from '@primeuix/themes/material';
import pinia from "./pinia.js";

const app = createApp(App);

// Configuración básica
app.use(i18n);
app.use(PrimeVue, { ripple: true, theme: { preset: Material } });
app.use(router);
app.use(pinia);

// Servicios
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

// Registrar componentes con nombres originales (más fácil para mantenimiento)
app.component('Button', Button);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('Column', Column);
app.component('ConfirmDialog', ConfirmDialog);
app.component('DataTable', DataTable);
app.component('Dialog', Dialog);
app.component('Drawer', Drawer);
app.component('FileUpload', FileUpload);
app.component('FloatLabel', FloatLabel);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('InputNumber', InputNumber);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('Rating', Rating);
app.component('Row', Row);
app.component('Select', Select);
app.component('SelectButton', SelectButton);
app.component('Tag', Tag);
app.component('Textarea', Textarea);
app.component('Toast', Toast);
app.component('Toolbar', Toolbar);
app.component('Panel', Panel);

// También registrar con prefijo pv- para compatibilidad con código existente
app.component('pv-button', Button);
app.component('pv-card', Card);
app.component('pv-checkbox', Checkbox);
app.component('pv-input-text', InputText);
app.component('pv-panel', Panel);

// Montar la aplicación
app.mount('#app');
