import { defineStore } from "pinia";
import { axiosInstance } from "../boot/axios";
import { ref } from "vue";

const RUTA_LISTAR_PRODUCTOS = "/productos";

export const useProductosStore = defineStore("productosStore", () => {
  const filter = ref({
    tipoProductoBusqueda: "",
    productoBusqueda: "",
  });

  const filterOriginal = ref({
    tipoProductoBusqueda: "",
    productoBusqueda: "",
  });

  const records = ref({
    data: [],
  });

  const paginationOriginal = ref({
    sortBy: "nombre",
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    limite: 10,
  });

  const pagination = ref({
    sortBy: "nombre",
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    limite: 10,
  });

  const paginationEgreso = ref({
    sortBy: "nombre",
    descending: false,
    page: 1,
    rowsPerPage: 999,
    rowsNumber: 999,
    limite: 999,
  });

  async function cargarProductos(original) {
    const params = {
      params: {
        filter: filter.value,
        pagination: original ? paginationOriginal.value : pagination.value,
      },
    };

    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_LISTAR_PRODUCTOS, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                records.value.data = response.data.ejecucion.datos.records.data;
                pagination.value = response.data.ejecucion.datos.pagination;
                resolve();
              } else {
                reject(new Error(response.data.ejecucion.respuesta.mensaje));
              }
            })
            .catch((error) => {
              reject(error);
            });
        } catch (error) {
          reject(error);
        }
      });
      return p;
    } catch (error) {
      console.log("Error en el proceso:", error.message);
    }
  }

  async function cargarProductosEgreso() {
    const params = {
      params: {
        filter: filter.value,
        pagination: paginationEgreso.value,
      },
    };

    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_LISTAR_PRODUCTOS, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                records.value.data = response.data.ejecucion.datos.records.data;
                pagination.value = response.data.ejecucion.datos.pagination;
                resolve();
              } else {
                reject(new Error(response.data.ejecucion.respuesta.mensaje));
              }
            })
            .catch((error) => {
              reject(error);
            });
        } catch (error) {
          reject(error);
        }
      });
      return p;
    } catch (error) {
      console.log("Error en el proceso:", error.message);
    }
  }

  return {
    cargarProductosEgreso,
    paginationOriginal,
    paginationEgreso,
    cargarProductos,
    filterOriginal,
    pagination,
    records,
    filter,
  };
});
