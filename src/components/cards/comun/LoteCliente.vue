<template>
  <v-row>
    <v-col
      ><h1>Lote Cliente {{ lote }}</h1></v-col
    >
  </v-row>
</template>
<script setup>
import {
  obtenerMaquina,
  obtenerDatosVariableGeneral,
} from "../../../helpers/bd";
import { onMounted, onUnmounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

const props = defineProps({
  tipo: { type: Number, default: 1 },
  variable: { type: Number, default: 1 },
});
const cargado = ref(false);
const lote = ref("");
onMounted(async () => {
  cargado.value = false;

  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  let loteFruta = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [props.variable],
    maquinaID,
    routerStore().clienteID
  );
  lote.value = loteFruta;
  cargado.value = true;
  socket.on(
    `variable_${maquinaID}_${props.variable}_actualizada`,
    async (data) => {
      let loteFruta = await obtenerDatosVariableGeneral(
        "24H",
        "ultimo",
        "individual",
        "sinfiltro",
        [props.variable],
        maquinaID,
        routerStore().clienteID
      );
      lote.value = loteFruta;
    }
  );
});
onUnmounted(() => {
  socket.removeAllListeners();
});
</script>
