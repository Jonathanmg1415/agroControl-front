<template>
  <q-layout view="lHh Lpr lFf" class="img-background">
    <q-header flat class="bg-green-5 rounded-lg shadow-2 q-pa-md">
      <q-toolbar
        class="toolbarShadow"
        style="border-radius: 10px 10px 10px 10px"
      >
        <q-btn
          flat
          dense
          round
          text-color="grey-7"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          v-if="!leftDrawerOpen"
        />

        <q-space />

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap flex">
          <div
            class="row flex flex-center absolute"
            style="right: 1vmax; top: -0.3vmax"
          >
            <span v-if="morphGroupModel === 'btn'" class="text-grey-7">Opciones de usuario</span>
            <q-btn
              v-morph:btn:userGroup:300.resize="morphGroupModel"
              fab
              flat
              color="grey-7"
              icon="person"
              @click="nextMorph"
            >
            </q-btn>
          </div>

          <q-card
            v-morph:card1:userGroup:500.resize="morphGroupModel"
            class="bg-white settingsMenu"
            flat
          >
            <q-card-section class="sectionShadow">
              <div class="row justify-between flex flex-center">
                <span class="text-grey-7">{{ email }}</span>
                <q-btn fab flat color="grey-7" icon="person" @click="nextMorph" />
              </div>

              <q-separator />

              <q-item clickable @click="logout">
                <q-item-section>
                  <div class="text-secondary">
                    <q-icon name="logout" color="grey-7" />
                    Salir
                  </div>
                </q-item-section>
              </q-item>
              <q-btn flat label="Cancel" text-color="secondary" @click="nextMorph" />
            </q-card-section>
          </q-card>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="container-fluid">
      <router-view />
    </q-page-container>
    <q-footer class="bg-green-5 shadow-2">
      <div class="rounded-lg shadow-1 p-4 flex justify-center items-center">
        <p class="text-grey-5 text-center">Copyright © - pixie inc was here</p>
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
