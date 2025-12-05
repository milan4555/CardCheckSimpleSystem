<script setup>
import { ref } from "vue";
import {ToastifyContainer} from "vue3-toastify";

const items = ref([
  {
    label: 'Kártyaolvasó',
    icon: 'pi pi-id-card'
  },
  {
    label: 'Listák',
    icon: 'pi pi-list'
  }
]);
</script>
<template>
  <RouterView></RouterView>
  <ToastifyContainer></ToastifyContainer>
</template>
