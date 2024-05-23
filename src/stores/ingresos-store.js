import { defineStore } from "pinia";
import { axiosInstance } from "../boot/axios";
import { date } from "quasar";
import { ref } from "vue";

const RUTA_LISTAR_INGRESOS = "/ingresos";
const RUTA_CREAR_INGRESO = "/ingresos/crear";
const RUTA_EXPORTAR_EGRESOS = "/egresos/exportar";

export const useIngresosStore = defineStore("ingresosStore", () => {
  const timeStamp = Date.now();
  const today = date.formatDate(timeStamp, "YYYY/MM/DD");
  const afterD = date.formatDate(
    date.subtractFromDate(timeStamp, { year: 1 }),
    "YYYY/MM/DD"
  );

  const filter = ref({
    fechaInicial: afterD,
    fechaFinal: today,
  });

  const filterOriginal = ref({
    fechaInicial: afterD,
    fechaFinal: today,
  });

  const records = ref({
    data: [],
    dataExportar: [],
  });

  const paginationOriginal = ref({
    sortBy: "fecha",
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    limite: 10,
  });

  const paginationOriginalExportar = ref({
    sortBy: "fecha",
    descending: true,
    page: 1,
    rowsPerPage: 999,
    rowsNumber: 0,
    limite: 999,
  });

  const pagination = ref({
    sortBy: "fecha",
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    limite: 10,
  });

  const paginationExportar = ref({
    sortBy: "fecha",
    descending: true,
    page: 1,
    rowsPerPage: 999,
    rowsNumber: 0,
    limite: 999,
  });

  async function cargarIngresos(original) {
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
            .get(RUTA_LISTAR_INGRESOS, params)
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

  async function crearIngreso(ingreso) {
    const params = {
      params: {
        fecha: ingreso.fecha,
        nombre: ingreso.nombre,
        descripcion: ingreso.descripcion,
        valor: ingreso.valor,
      },
    };

    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_CREAR_INGRESO, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
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
    paginationOriginalExportar,
    paginationExportar,
    paginationOriginal,
    filterOriginal,
    cargarIngresos,
    pagination,
    records,
    filter,
    crearIngreso, // Agregar la función al store
  };
});
