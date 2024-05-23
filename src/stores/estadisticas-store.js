import { defineStore } from "pinia";
import { axiosInstance } from "boot/axios";
import { useQuasar } from "quasar";
import { ref } from "vue";

const INGRESOS_MES_ROUTE = "/estadisticas/ingresos-egresos-mes";
const MOVIMIENTOS_ULTIMO_MES_ROUTE = "/estadisticas/movimientos-ultimo-mes";

export const useEstadisticasStore = defineStore("estadisticas", () => {
  const $q = useQuasar();

  const totalEgresos = ref(0);
  const totalIngresos = ref(0);
  const fechaInicial = ref(new Date().toISOString().substr(0, 10));
  const fechaFinal = ref(new Date().toISOString().substr(0, 10));
  const ingresos = ref([]);
  const egresos = ref([]);
  const series = ref([]);
  const movimientos = ref([]);

  const calcularTotales = () => {
    let totalIngresosCalculado = 0;
    let totalEgresosCalculado = 0;

    for (const item of series.value) {
      if (item.tipo === "Ingreso") {
        totalIngresosCalculado += item.y;
      } else if (item.tipo === "Egreso") {
        totalEgresosCalculado += item.y;
      }
    }

    totalIngresos.value = totalIngresosCalculado;
    totalEgresos.value = totalEgresosCalculado;
  };

  const consultarIngresosMes = async (inicio, fin) => {
    const params = {
      params: {
        fechaInicial: inicio,
        fechaFinal: fin,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(INGRESOS_MES_ROUTE, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                series.value = response.data.ejecucion.datos.series;
                calcularTotales();

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
  };

  const consultarMovimientosUltimoMes = async (inicio, fin) => {
    const params = {
      params: {
        fechaInicial: inicio,
        fechaFinal: fin,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(MOVIMIENTOS_ULTIMO_MES_ROUTE, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                movimientos.value = response.data.ejecucion.datos.movimientos;
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
  };

  return {
    totalEgresos,
    totalIngresos,
    movimientos,
    ingresos,
    egresos,
    series,
    fechaInicial,
    fechaFinal,
    consultarIngresosMes,
    calcularTotales,
    consultarMovimientosUltimoMes,
  };
});
