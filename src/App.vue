<script>
import FooterContent from './public/components/footer-content.component.vue';
import LanguageSwitcher from "./public/components/language-switcher.component.vue";
export default {
  name: 'App',
  components: {
    LanguageSwitcher,
    FooterContent
  },
  data() {
    return {
      items: [
        {label: 'option.home', to: '/home'},
        {label: 'option.about', to: '/about'},
        {label: 'option.categories', to: '/publishing/categories'},
      ]
    }
  },
}
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
 <header>
   <pv-Toolbar class="bg-primary">
     <template #start>
       <h3> ACME Learning Centenario</h3>
     </template>
     <template #center>
      <div class="flex-column">
        <pv-Button v-for="item in items" :key="item.label" as-child v-slot="slotProps">
          <router-link :to="item.to" :class="slotProps['class']">{{$t(item.label)}}</router-link>
        </pv-Button>
      </div>
     </template>
     <template #end>
       <language-switcher></language-switcher>
     </template>
   </pv-Toolbar>
   </header>
  <main>
    <router-view></router-view>
  </main>
  <footer>
    <footer-content></footer-content>
  </footer>
</template>
<style scoped>
footer {
  position: absolute;
  bottom: 0;
  padding: 10px;
}
</style>