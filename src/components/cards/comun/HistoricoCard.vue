<template>
  <v-container
    ><v-row>
      <v-col>
        <v-card class="pa-8">
          <v-row
            ><v-col><v-card-title>Historico</v-card-title></v-col>
          </v-row>
          <v-row
            ><v-col
              ><v-card-subtitle>Linea</v-card-subtitle>
              <v-select
                v-model="select"
                :items="nombres"
                label="Linea"
                item-text="nombre"
                item-value="id"
                :hide-selected="true"
                return-object
                dense
                solo
                @change="changeItem"
              ></v-select
            ></v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-card-subtitle>Sistema</v-card-subtitle>
              <v-select
                v-model="select2"
                :items="nombres2"
                label="Sistema"
                item-text="nombre"
                item-value="id"
                :hide-selected="true"
                return-object
                dense
                solo
                @change="changeItem"
              ></v-select
            ></v-col>
          </v-row>
          <v-row>
            <v-col v-if="cargado">
              <DECCODAFHistoricoCard />
              <DECCODOSHistorico />
              <DECCOWSHistorico />
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
      </v-col> </v-row
  ></v-container>
</template>
<script>
export default {
  name: "HistoricoCard",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref, computed, reactive } from "vue";
import { routerStore } from "../../../stores/index";
import DECCODAFHistoricoCard from "../deccodaf/DECCODAFHistorico.vue";
import DECCODOSHistorico from "../deccodos/DECCODOSHistorico.vue";
import DECCOWSHistorico from "../deccowasher/DECCOWSHistorico.vue";
let cargado = ref(false);
let lineaList = {};
let nombres = ref([]);
let select = ref(null);
let nombres2 = ref(["DECCODAF", "DECCODOS", "DECCOWASHER"]); // TODO Llamada BD
let select2 = ref(null);

onMounted(async () => {
  cargado.value = false;
  let lista = [];
  lineaList = await obtenerLinea(routerStore().clienteID);
  for (const iterator of lineaList) {
    lista.push({ id: iterator.id, nombre: iterator.nombre });
  }
  nombres.value = lista;

  cargado.value = true;
});
async function obtenerLinea(clienteID) {
  return (
    await axios.get(`${process.env.VUE_APP_RUTA_API}/${clienteID}/lineas/all`)
  ).data;
}
function changeItem() {}
</script>
