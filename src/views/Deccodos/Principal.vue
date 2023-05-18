<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-switch v-model="turnos" color="info" label="Turnos">Turnos</v-switch>
        <TablaTurnos v-if="turnos" />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-card class="mb-4">
          <v-row>
            <v-col v-if="cargado">
              <v-card-title>Productos</v-card-title>
              <v-row no-gutters>
                <v-col>
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-left">Tanque 1</th>
                          <th class="text-left">Tanque 2</th>
                          <th class="text-left">Tanque 3</th>
                          <th class="text-left">Tanque 4</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <v-text-field
                              v-model="tanque1"
                              prepend-icon="mdi-bottle-tonic"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              v-model="tanque2"
                              prepend-icon="mdi-bottle-tonic"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              v-model="tanque3"
                              prepend-icon="mdi-bottle-tonic"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              v-model="tanque4"
                              prepend-icon="mdi-bottle-tonic"
                            ></v-text-field>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  ><v-btn color="info" class="mx-4 mb-4" @click="save">
                    <v-icon light> mdi-content-save </v-icon> Guardar
                  </v-btn></v-col
                >
              </v-row>
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
        <v-snackbar v-model="guardado" :timeout="5000" color="primary">
          {{ mensaje }}</v-snackbar
        >
        <SeleccionarProducto v-if="productos" />
        <v-row
          ><v-col>
            <TablaTotalTurnos
              v-if="turnos && turnosA.length > 1"
              :variables="[49, 50, 51, 52, 53, 54, 55]"
              :modo="[13, 15]"
              :tipo="2" />
            <TablaTotal
              v-else
              :variables="[49, 50, 51, 52, 53, 54, 55]"
              :marcha="[31, 40, 42]"
              :tipo="2" /></v-col
          ><v-col>
            <TablaAlarmasTurnos
              v-if="turnos && turnosA.length > 1"
              :variables="[40, 42]"
              :marcha="[31, 40, 42]"
              :tipo="2" />
            <TablaAlarmas
              v-else
              :variables="[40, 42]"
              :marcha="[31, 40, 42]"
              :tipo="2"
          /></v-col>
        </v-row>
        <Estado
          :activo="31"
          :auto-manual="[41, 43]"
          :marcha="[31, 40, 42]"
          :alarma="[40, 42, 81]"
          :tipo="2"
          :categories="[
            'Activo',
            'MarchaParo',
            'Remoto',
            'Manual',
            'Falta de consenso',
            'Alarma',
            'Presencia Fruta',
          ]"
        />
        <GraficaLineaCard
          :variables="[32, 33, 34, 35, 36, 37, 38, 39]"
          title="Dosis"
          :tipo="2"
        />
        <FrutaProcesadaComun :variables="48" :tipo="2" />
        <v-btn
          color="info"
          class="mt-2"
          @click="
            routerStore().menu(
              'deccodos:Otras',
              routerStore().clienteID,
              routerStore().lineasID
            )
          "
          >Otras Variables</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCODOSPrincipal",
};
</script>
<script setup>
import axios from "axios";
import Estado from "../../components/cards/comun/Estado.vue";
import TablaTurnos from "../../components/tablas/comun/TablaTurnos.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import { routerStore } from "../../stores/index";
import {
  obtenerMaquina,
  obtenerProductos,
  obtenerTurnos,
} from "../../helpers/bd";
import { onMounted, ref } from "vue";
import TablaTotalTurnos from "../../components/tablas/deccodos/TablaTotalTurnos.vue";
// import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";
import SeleccionarProducto from "../../components/cards/deccodos/SeleccionarProducto.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import TablaAlarmasTurnos from "../../components/tablas/comun/TablaAlarmasTurnos.vue";

let turnos = ref(true);

let tanque1 = ref(null);
let tanque2 = ref(null);
let tanque3 = ref(null);
let tanque4 = ref(null);
let tanques = ref(null);

let cargado = ref(false);
let productos = ref(true);
let guardado = ref(false);
let mensaje = ref("");

async function save() {
  productos.value = false;
  let array = [tanque1.value, tanque2.value, tanque3.value, tanque4.value];
  let maquina = await obtenerMaquina("lineaTipo", routerStore().lineasID, 2);
  if (!tanques.value) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      axios
        .post(`${process.env.VUE_APP_RUTA_API}/productos/nuevo`, {
          nombre: element,
          maquinaID: maquina[0].id,
        })
        .then(() => {});
    }
    mensaje.value = "Guardado";
    guardado.value = true;
  } else {
    let update = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      update.push({
        nombre: element,
        id: tanques.value[index].id,
        activo: tanques.value[index].activo,
      });
    }
    axios.post(
      `${process.env.VUE_APP_RUTA_API}/productos/actualizar/multiple`,
      {
        productos: update,
      }
    );
    mensaje.value = "Guardado";
    guardado.value = true;
  }
  productos.value = true;
}
let turnosA = ref([]);
onMounted(async () => {
  cargado.value = false;
  turnosA.value = await obtenerTurnos(routerStore().clienteID);
  turnos.value = turnosA.value.length > 0 ? true : false;
  let maquina = await obtenerMaquina("lineaTipo", routerStore().lineasID, 2);
  let t = await obtenerProductos("maquina", maquina[0].id);
  if (t.length > 1) {
    tanque1.value = t[0].nombre;
    tanque2.value = t[1].nombre;
    tanque3.value = t[2].nombre;
    tanque4.value = t[3].nombre;
    tanques.value = t;
  }
  cargado.value = true;
});
</script>
