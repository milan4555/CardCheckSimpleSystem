<script setup>
import { ref } from "vue";

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
  <div class="card">
    <Menubar :model="items" />
  </div>
  <RouterView></RouterView>
</template>
