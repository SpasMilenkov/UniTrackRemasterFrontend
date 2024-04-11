<script setup lang="ts">
import Menubar from 'primevue/menubar';
import { ref } from "vue";
import router from './router';
import Footer from "./components/FooterComponent.vue"
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/')
    }
  },
  {
    label: 'Login',
    icon: 'pi pi-star',
    command: () => {
      router.push('login')
    }
  },
  {
    label: 'Register',
    icon: 'pi pi-search',
    command: () => {
      router.push('/register')
    }
  },
]);

</script>

<template>
  <Menubar :model="items">
    <template #item="{ item, props, hasSubmenu }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
      <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
      </a>
    </template>
  </Menubar>
  <div>
    <router-view></router-view>
  </div>
  <Footer></Footer>
</template>

<style scoped></style>
