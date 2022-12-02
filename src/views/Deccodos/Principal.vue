<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCODOS - {{ nombreLinea }}
    </h1>
    <v-row>
      <v-col>
        <v-switch
          v-model="turnos"
          color="info"
          prepend-icon="mdi-clock"
          label="Turnos"
          >Turnos</v-switch
        >
        <TablaTurnos v-if="turnos" />
        <TablaTotalTurnos
          v-if="turnos"
          :variables="[49, 50, 51, 52, 53, 54, 55]"
          :marcha="[31, 40, 42]"
          :tipo="2"
        />
        <TablaTotal
          v-else
          :variables="[49, 50, 51, 52, 53, 54, 55]"
          :marcha="[31, 40, 42]"
          :tipo="2"
        />
        <v-container>
          <v-card>
            <v-row>
              <v-col v-if="cargado">
                <v-row>
                  <v-col>
                    <v-card-title>Productos</v-card-title>
                  </v-col>
                </v-row>
                <v-row class="mx-2">
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
                <v-row>
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
            </v-row> </v-card
        ></v-container>
        <SeleccionarProducto v-if="productos" />
        <Estado
          :activo="31"
          :auto="41"
          :manual="43"
          :alarma="40"
          :fc="42"
          :tipo="2"
        />
        <Dosis
          :variables="[34, 35, 36, 37, 38]"
          title="Dosis Bombas"
          :tipo="2"
        />
        <GraficaEstadoCard
          :variables="[32, 33]"
          :height="300"
          title="Aplicadores"
          :tipo="2"
        />
        <FrutaProcesadaComun :fruta="48" :tipo="2" />
        <v-btn
          color="info"
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
import bd from "../../helpers/bd";
import { onMounted, ref } from "vue";
import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import Dosis from "../../components/cards/comun/Dosis.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
import SeleccionarProducto from "../../components/cards/deccodos/SeleccionarProducto.vue";

let nombreLinea = ref("");
let nombreCliente = ref("");
let turnos = ref(true);

let tanque1 = ref(null);
let tanque2 = ref(null);
let tanque3 = ref(null);
let tanque4 = ref(null);
let tanques = ref(null);

let cargado = ref(false);
let productos = ref(true);

async function save() {
  productos.value = false;
  let array = [tanque1.value, tanque2.value, tanque3.value, tanque4.value];
  let maquina = await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, 2);
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
  }
  productos.value = true;
}

onMounted(async () => {
  cargado.value = false;
  nombreLinea.value = (await bd.obtenerLinea(routerStore().lineasID))[0].nombre;
  nombreCliente.value = (
    await bd.obtenerCliente(routerStore().clienteID)
  )[0].nombre;
  let maquina = await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, 2);
  let t = await bd.obtenerProductos("maquina", maquina[0].id);
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
