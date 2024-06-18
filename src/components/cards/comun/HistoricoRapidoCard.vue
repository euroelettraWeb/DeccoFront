<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>Historico</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div class="text-subtitle">Linea</div>
              <v-select
                v-model="select"
                :items="nombres"
                label="Linea"
                item-text="nombre"
                item-value="id"
                :hide-selected="true"
                hide-details
                return-object
                dense
                solo
                @change="changeItem"
              />
            </v-col>
            <v-col cols="6">
              <div class="text-subtitle">Sistema</div>
              <v-select
                v-model="select2"
                :items="nombres2"
                label="Sistema"
                item-text="nombre"
                item-value="id"
                :hide-selected="true"
                hide-details
                return-object
                dense
                solo
              ></v-select
            ></v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-if="select && select2">
          <DECCODAFHistoricoCard
            v-if="select2.grupoID === 1"
            :linea="select.id"
            :maquina="select2.id"
          />
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
        </v-card-text>
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

const cargado = ref(false);
const lineaList = ref({});
const nombres = ref([]);
const select = ref(null);
const nombres2 = ref([]);
const select2 = ref(null);

function changeItem() {
  select2.value = null;
  nombres2.value = select.value.sistemas;
}

onMounted(async () => {
  cargado.value = false;
  let lista = [];
  lineaList.value = await obtenerLineas(routerStore().clienteID);
  for (const iterator of lineaList.value) {
    let sistemas = await obtenerMaquina("linea", iterator.id, 0);
    for (let sistema of sistemas) {
      sistema.nombre =
        sistema.nombre.split("-")[sistema.nombre.split("-").length - 1];
    }
    lista.push({
      id: iterator.id,
      nombre: iterator.nombre,
      sistemas: sistemas,
    });
  }
  nombres.value = lista;
  cargado.value = true;
});
</script>
