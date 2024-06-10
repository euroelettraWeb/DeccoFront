<template>
  <v-row>
    <v-col v-if="cargado"
      ><h1>{{ lotesCliente[0].x }}</h1></v-col
    >
  </v-row>
</template>
<script setup>
import { onMounted, ref, onUnmounted, watch } from "vue";
import { routerStore } from "../../../stores/index";
import {
  obtenerMaquina,
  obtenerDatosVariableGeneral,
} from "../../../helpers/bd";
const props = defineProps({
  lotecliente: { type: Number, default: null },
  tipo: { type: Number, default: 1 },
});
const lotesCliente = ref([]);
const cargado = ref(false);
let interval = null;
const cargarDatos = async () => {
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  lotesCliente.value = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoLotesCliente",
    [props.lotecliente],
    maquinaID,
    routerStore().clienteID
  );
};
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
  }, 90000);
});
onUnmounted(() => {
  clearInterval(interval);
  lotesCliente.value = [];
});
</script>
