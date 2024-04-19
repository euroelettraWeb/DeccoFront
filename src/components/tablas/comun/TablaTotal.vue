<template>
  <v-card>
    <v-row>
      <v-col v-if="cargado">
        <v-card-title>
          <strong>Consumo Hoy</strong>
        </v-card-title>
        <v-card-subtitle>{{ hoy }} (00:00:00 - Actual)</v-card-subtitle>
        <v-simple-table dense>
          <template #default>
            <thead>
              <tr>
                <th class="text-left"></th>
                <th class="text-right">Litros</th>
                <th class="text-right">Litros/Tonelada</th>
                <th class="text-right">Última hora</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in consumos" :key="item.id">
                <td>{{ item.nombre }}</td>
                <td class="text-right">
                  {{ item.total }}
                </td>
                <td v-if="deccodos" class="text-right">
                  {{ item.totalFruta }}
                </td>
                <td class="text-right">
                  {{ item.ultimaHora }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col v-else class="d-flex justify-center align-center">
        <v-progress-circular
          :size="100"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: "TablaTotal",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref, onUnmounted, computed, watch } from "vue";
import { routerStore } from "../../../stores/index";

const consumos = ref([]);
const deccodos = ref(2);
const cargado = ref(false);
let interval = null;
const props = defineProps({
  variables: { type: Array, default: () => [] },
  marcha: { type: Array, default: () => [] },
  tipo: { type: Number, default: 1 },
});

const cargarDatos = async () => {
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  deccodos.value = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, 2)
  )[0].id;
  let totalesBD = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    props.variables,
    maquinaID,
    routerStore().clienteID
  );
  let ultimaHora = await obtenerDatosVariableGeneral(
    "ultimaHora",
    "totales",
    "individual",
    "sinfiltro",
    props.variables,
    maquinaID,
    routerStore().clienteID
  );

  if (deccodos.value) {
    let totalesFruta = await obtenerDatosVariableGeneral(
      "24H",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      deccodos.value,
      routerStore().clienteID
    );
    consumos.value = [];
    for (let index = 0; index < totalesBD.length; index++) {
      const element = totalesBD[index];
      const elementUltimaHora = ultimaHora[index];
      let n = Math.max(0, element.registros[0].total);
      let d =
        totalesFruta[0].registros[0].total > 0
          ? (n / (totalesFruta[0].registros[0].total / 1000)).toLocaleString(
              "es-ES"
            )
          : 0;
      consumos.value.push({
        id: index,
        nombre: element.descripcion,
        total: Math.max(0, element.registros[0].total).toLocaleString("es-ES"),
        totalFruta: d.toLocaleString("es-ES"),
        ultimaHora: Math.max(
          0,
          elementUltimaHora.registros[0].total
        ).toLocaleString("es-ES"),
      });
    }
    consumos.value.push({
      id: totalesBD.length,
      nombre: "T Fruta",
      total: Math.max(
        0,
        totalesFruta[0].registros[0].total / 1000
      ).toLocaleString("es-ES"),
    });
  } else {
    consumos.value = [];
    for (let index = 0; index < totalesBD.length; index++) {
      const element = totalesBD[index];
      const elementUltimaHora = ultimaHora[index];
      consumos.value.push({
        id: index,
        nombre: element.descripcion,
        total: Math.max(0, element.registros[0].total)
          .toFixed(3)
          .toLocaleString("es-ES"),
        ultimaHora: Math.max(0, elementUltimaHora.registros[0].total)
          .toFixed(3)
          .toLocaleString("es-ES"),
      });
    }
  }
};

const hoy = computed(() => {
  const fechaActual = new Date();
  const dia = fechaActual.getDate().toString().padStart(2, "0");
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
  const año = fechaActual.getFullYear();
  return `${dia}/${mes}/${año}`;
});

watch(
  () => routerStore().lineasID,
  async () => {
    cargado.value = false;
    await cargarDatos();
    cargado.value = true;
  }
);

onMounted(async () => {
  cargado.value = false;
  await cargarDatos();
  cargado.value = true;
  interval = setInterval(() => {
    cargarDatos();
  }, 9000);
});

onUnmounted(() => {
  clearInterval(interval);
  consumos.value = [];
});
</script>
