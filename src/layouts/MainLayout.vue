<template>
  <q-layout view="lHh Lpr lFf" class="img-background" @click="closeLeftDrawer">
    <div v-show="leftDrawerOpen" class="menu-overlay" @click.stop>
      <div class="menu-content bg-white text-black">
        <div style="display: flex; justify-content: end;" >
          <q-avatar icon="cancel" color="grey-5" @click="closeLeftDrawer" style="cursor: pointer; color: white"/>
        </div>
        <q-list>
          <q-item
            class="menu-item"
            style="border-radius: 8px; margin: 0.5vmax;"
            clickable
            v-for="(item, index) in menuItems"
            :key="index"
            @click="navigate(item.route)"
          >
            <q-avatar :icon="item.icon" />
            <q-item-section class="menu-text">{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-header flat class="bg-primary rounded-lg shadow-2">
      <q-toolbar
        class="toolbarShadow"
        style="border-radius: 10px 10px 10px 10px"
      >
        <q-btn
          flat
          dense
          round
          text-color="white"
          icon="menu"
          aria-label="Menu"
          @click.stop="toggleLeftDrawer"
          v-if="!leftDrawerOpen"
        />

        <q-space />

        <div class="row q-col-gutter-sm">
          <q-item-label class="text-white col-lg-6 col-md-6 col-sm-6 col-xs-6"
            >Salida Segura</q-item-label
          >
          <q-btn
            flat
            size="md"
            icon="logout"
            class="text-white cursor-pointer col-lg-6 col-md-6 col-sm-6 col-xs-6"
            @click="logout"
          />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="container-fluid" style="background: #f0f3ff">
      <router-view />
    </q-page-container>
    <q-footer class="bg-primary shadow-2">
      <div class="rounded-lg shadow-1 p-4 flex justify-center items-center">
        <p class="text-white text-bold text-center">
          Copyright © - Pixie inc was here
        </p>
        <q-space />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, defineComponent } from "vue";
import { useAuthStore } from "stores/auth-store";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const router = useRouter();
const email = ref();
const $q = useQuasar();
const autenticacionStore = useAuthStore();

const leftDrawerOpen = ref(false);

const menuItems = [
  { label: "Inicio", route: "/main", icon: "home" },
  { label: "Productos", route: "/main/productos", icon: "shopping_bag" },
  { label: "Ingresos", route: "/main/ingresos", icon: "shopping_cart_checkout" },
  { label: "Egresos", route: "/main/egresos", icon: "receipt_long" },
  { label: "Estadisticas", route: "/main/estadisticas", icon: "show_chart" },
  // Agrega más elementos según necesites
];

defineComponent({
  name: "MainLayout",
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  $q.dialog({
    title: "Cierre de sesión",
    message: "Usted está saliendo de la aplicación",
    ok: "Continuar",
    cancel: "Cancelar",
  })
    .onOk(() => {
      email.value = "";
      autenticacionStore.logout();
      router.push("/");
    })
    .onCancel(() => {
      router.currentRoute;
    });
}

function navigate(route) {
  router.push(route);
  closeLeftDrawer();
}

function closeLeftDrawer() {
  if (leftDrawerOpen.value) {
    leftDrawerOpen.value = false;
  }
}
</script>

<style scoped>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.178); /* Fondo semi-transparente */
  z-index: 1000; /* Asegura que el menú esté sobre otros elementos */
}

.menu-content {
  position: relative;
  top: 10%;
  left: 2%;
  width: 15vmax; /* Ancho del menú */
  height: 24vmax;
  padding: 20px;
  border-radius: 10px;
}

.menu-text {
  text-align: center; /* Centra el texto */
}

.menu-content .q-list {
  margin-bottom: 60px; /* Espacio para el botón de cerrar */
}

.menu-item:hover {
  background-color: #c3e6cb; /* Color de fondo al pasar el ratón */
}

.menu-content .q-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
}
</style>
