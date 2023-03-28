<template>
  <v-row no-gutters>
    <v-col>
      <v-card>
        <v-row no-gutters
          ><v-col><v-card-title>Historico</v-card-title></v-col>
        </v-row>
        <v-row no-gutters
          ><v-col cols="6"
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
            ></v-select></v-col
          ><v-col cols="6"
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
            ></v-select
          ></v-col>
        </v-row>
        <v-row no-gutters>
          <v-col v-if="cargado">
            <DECCODAFHistoricoCard
              v-if="select2.grupoID === 1"
              :linea="select.id"
              :maquina="select2.id"
            /><!-- :linea="select.id" :sistema="select2.id" -->
            <DECCODOSHistorico
              v-if="select2.grupoID === 2"
              :linea="select.id"
              :maquina="select2.id"
            />
            <DECCOWSHistorico
              v-if="select2.grupoID === 3"
              :linea="select.id"
              :maquina="select2.id"
            />
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
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "HistoricoCard",
};
</script>
<script setup>
import { obtenerLineas, obtenerMaquina } from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";
import DECCODAFHistoricoCard from "../deccodaf/DECCODAFHistorico.vue";
import DECCODOSHistorico from "../deccodos/DECCODOSHistorico.vue";
import DECCOWSHistorico from "../deccowasher/DECCOWSHistorico.vue";
let cargado = ref(false);
let lineaList = ref({});
let nombres = ref([]);
let select = ref(null);
let nombres2 = ref([]);
let select2 = ref({ id: 0, nombre: "" });

onMounted(async () => {
  cargado.value = false;
  let lista = [];
  lineaList.value = await obtenerLineas(routerStore().clienteID);
  for (const iterator of lineaList.value) {
    let sistemas = await obtenerMaquina("linea", iterator.id, 0);
    lista.push({
      id: iterator.id,
      nombre: iterator.nombre,
      sistemas: sistemas,
    });
  }
  nombres.value = lista;

  cargado.value = true;
});
function changeItem() {
  nombres2.value = select.value.sistemas;
}
</script>
