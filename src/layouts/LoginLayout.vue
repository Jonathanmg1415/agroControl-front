<template>
  <q-layout view="lHh Lpr lFf" class="img-background">
    <q-footer class="bg-white">
      <q-toolbar>
        <p class="text-grey-5">Copyright © - pixie inc was here</p>

        <q-space />

        <!--Posibles iconos de redes-->
      </q-toolbar>
    </q-footer>
    <q-page-container class="container-fluid">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent } from "vue";

defineComponent({
  name: "LoginLayout",
});
</script>
