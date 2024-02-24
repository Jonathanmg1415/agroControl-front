<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark">
    <q-header flat class="bg-transparent q-pa-md">
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
                <q-btn
                  fab
                  flat
                  color="grey-7"
                  icon="person"
                  @click="nextMorph"
                />
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
              <q-btn
                flat
                label="Cancel"
                text-color="secondary"
                @click="nextMorph"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-dark"
      show-if-above
    >
      <q-scroll-area class="fit">
        <div class="q-pt-md q-pb-md">
        </div>

        <q-item>
          <q-item-section>
            <q-separator class="q-mt-md q-mb-xs" color="grey-4" />
          </q-item-section>
        </q-item>

        <q-list padding>

        </q-list>


      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, defineAsyncComponent, computed, onMounted } from "vue";
import { useAuthStore } from "stores/auth-store";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const EssentialLink = defineAsyncComponent(() =>
  import("../components/EssentialLink.vue")
);

const router = useRouter();
const $q = useQuasar();
const leftDrawerOpen = ref(true);
const autenticacionStore = useAuthStore();
const morphGroupModel = ref("btn");

const nextMorphStep = {
  btn: "card1",
  card1: "btn",
};

function nextMorph() {
  morphGroupModel.value = nextMorphStep[morphGroupModel.value];
}

const links1 = computed({
  get() {
    if (autenticacionStore.ejecucion !== null) {
      return autenticacionStore.links.links1;
    } else {
      return [];
    }
  },
});
const links2 = computed({
  get() {
    if (autenticacionStore.ejecucion !== null) {
      return autenticacionStore.links.links2;
    } else {
      return [];
    }
  },
});
const links3 = computed({
  get() {
    if (autenticacionStore.ejecucion !== null) {
      return autenticacionStore.links.links3;
    } else {
      return [];
    }
  },
});
const email = computed({
  get() {
    if (autenticacionStore.ejecucion != null) {
      return autenticacionStore.email;
    } else {
      return "";
    }
  },
});

function logout() {
  $q.loading.show({
    message: "Saliendo ...",
  });
  autenticacionStore
    .logout()
    .then(() => {
      routesStore.linkActualMenu = [];
      router.push("/");
    })
    .finally(() => {
      $q.loading.hide();
    });
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="scss" scoped>

</style>
