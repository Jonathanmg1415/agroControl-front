<template>
  <q-layout view="lHh Lpr lFf" class="img-background">
    <q-header class="bg-green-5 rounded-lg shadow-2">
      <q-toolbar class="flex  ">
        <q-img :src="''" alt="Agrocontrol Logo" height="50px" width="50px" />
        <span class="text-white text-h6 ml-4 text-shadow-lg">Agrocontrol</span>
      </q-toolbar>
    </q-header>
    <q-page-container class="container-fluid">
      <router-view />
    </q-page-container>
    <q-footer class="bg-green-5 shadow-2">
      <div class="rounded-lg shadow-1 p-4 flex justify-center items-center">  <p class="text-grey-5 text-center">Copyright © Pixie inc was here</p>
        <q-space />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { defineComponent } from "vue";

defineComponent({
  name: "LoginLayout",
});
</script>
