<template>
    <q-page padding>
      <q-card>
        <q-card-section>
          <filtro-productos />
        </q-card-section>
        <q-card-section>
          <lista-productos />
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script setup>
  import { defineAsyncComponent } from "vue";
  
  const ListaProductos = defineAsyncComponent(() =>
    import("src/components/productos/ListaProductos.vue")
  );
  
  const FiltroProductos = defineAsyncComponent(() =>
    import("src/components/productos/FiltroProductos.vue")
  );
  </script>
  