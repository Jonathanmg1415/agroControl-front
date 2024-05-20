import { defineStore } from "pinia";
import { axiosInstance } from "../boot/axios";
import { date } from "quasar";
import { ref } from "vue";

const RUTA_LISTAR_EGRESOS = "/egresos";
/* const RUTA_GUARDAR_PAGO = '/transaccionpago/guardar';
const RUTA_EXPORTAR_PAGO = '/transaccionpago/exportar'; */

export const useEgresosStore = defineStore("egresosStore", () => {
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

  async function cargarEgresos(original) {
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
            .get(RUTA_LISTAR_EGRESOS, params)
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

  /*   async function guardarRegistropago(params) {
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .post(RUTA_GUARDAR_PAGO, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                resolve(response.data.ejecucion.datos);
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
  } */

  /*   async function exportarTransaccionpago(original) {
    const params = {
      params: {
        filter: filter.value,
        pagination: original
          ? paginationOriginalExportar.value
          : paginationExportar.value,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_EXPORTAR_PAGO, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                records.value.dataExportar =
                  response.data.ejecucion.datos.transacciones;
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
  } */

  return {
    paginationOriginalExportar,
    //exportarTransaccionpago,
    //guardarRegistropago,
    paginationExportar,
    paginationOriginal,
    filterOriginal,
    cargarEgresos,
    pagination,
    records,
    filter,
  };
});
