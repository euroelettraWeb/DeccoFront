<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col v-for="item in nombres" :key="item.id">
        <CardLineas :linea="item" />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          :disabled="!deccodocontrol"
          @click="routerStore().deccocontrol(routerStore().clienteID)"
          ><v-icon light>mdi-snowflake</v-icon>DECCOCONTROL</v-btn
        >
      </v-col>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LineasView",
};
</script>

<script setup>
import { obtenerMaquina, obtenerLineas } from "../helpers/bd";
import { onMounted, ref, watch } from "vue";
import { routerStore } from "../stores/index";
import CardLineas from "../components/cards/comun/CardLineas.vue";

let lineas = [];
const nombres = ref([]);
const cargado = ref(false);
const deccodocontrol = ref(false);
const clienteID = ref(routerStore().clienteID);
onMounted(async () => {
  cargado.value = false;
  lineas = await obtenerLineas(routerStore().clienteID);

  for (let index = 0; index < lineas.length; index++) {
    let element = lineas[index];
    let maq = await obtenerMaquina("linea", element.id, 0);
    let deccowsID = maq.find((maquina) => maquina.grupoID == 3);
    let deccodosID = maq.find((maquina) => maquina.grupoID == 2);
    let deccodafID = maq.find((maquina) => maquina.grupoID == 1);
    if (deccowsID) lineas[index].deccowsID = deccowsID.activa;
    if (deccodosID) lineas[index].deccodosID = deccodosID.activa;
    if (deccodafID) lineas[index].deccodafID = deccodafID.activa;
  }
  let deccoc = await obtenerMaquina("clienteTipo", routerStore().clienteID, 4);
  if (deccoc) deccodocontrol.value = deccoc.activa;
  nombres.value = lineas;
  watch(clienteID, async (val) => {
    lineas = await obtenerLineas(clienteID.value);

    for (let index = 0; index < lineas.length; index++) {
      let element = lineas[index];
      let maq = await obtenerMaquina("linea", element.id, 0);
      let deccowsID = maq.find((maquina) => maquina.grupoID == 3);
      let deccodosID = maq.find((maquina) => maquina.grupoID == 2);
      let deccodafID = maq.find((maquina) => maquina.grupoID == 1);
      if (deccowsID) lineas[index].deccowsID = deccowsID.activa;
      if (deccodosID) lineas[index].deccodosID = deccodosID.activa;
      if (deccodafID) lineas[index].deccodafID = deccodafID.activa;
    }
    nombres.value = lineas;
    let deccoc = await obtenerMaquina(
      "clienteTipo",
      routerStore().clienteID,
      4
    );
    if (deccoc) deccodocontrol.value = deccoc.activa;
    nombres.value = lineas;
  });
  cargado.value = true;
});
</script>
