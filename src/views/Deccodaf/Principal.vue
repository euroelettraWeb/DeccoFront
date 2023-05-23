<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <LoteCliente />
        <v-switch v-model="turnos" color="info" label="Turnos">Turnos</v-switch>
        <TablaTurnos v-if="turnos" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="mb-4">
          <v-row>
            <v-col v-if="cargado">
              <v-row>
                <v-col>
                  <v-card-title>Productos</v-card-title>
                </v-col>
              </v-row>
              <v-row class="mx-2" no-gutters>
                <v-col>
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-left">Producto 1</th>
                          <th class="text-left">Producto 2</th>
                          <th class="text-left">Producto 3</th>
                          <th class="text-left">Producto 4</th>
                          <th class="text-left">Producto 5</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <v-text-field
                              v-model="producto1"
                              prepend-icon="mdi-bottle-tonic"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              v-model="producto2"
                              prepend-icon="mdi-bottle-tonic"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              v-model="producto3"
                              prepend-icon="mdi-bottle-tonic"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              v-model="producto4"
                              prepend-icon="mdi-bottle-tonic"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              v-model="producto5"
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
        <v-row>
          <v-col>
            <TablaTotalTurnos
              v-if="turnos && turnosA.length > 1"
              :variables="[25, 26, 27, 28, 29, 30]"
              :marcha="[1, 12, 14]"
              :tipo="1"
            />
            <TablaTotal
              v-else
              :variables="[25, 26, 27, 28, 29, 30]"
              :marcha="[1, 12, 14]"
            />
          </v-col>
          <v-col>
            <TablaAlarmasTurnos
              v-if="turnos && turnosA.length > 1"
              :variables="[12, 14, 73, 74, 75]"
              :marcha="[1, 12, 14, 73, 74, 75]"
              :tipo="1"
            />
            <TablaAlarmas
              v-else
              :variables="[12, 14, 73, 74, 75]"
              :marcha="[1, 12, 14, 73, 74, 75]"
              :tipo="1"
            />
          </v-col>
        </v-row>
        <LoteDecco :tipo="1" title="Lote Fungicida" />
        <Estado
          :activo="1"
          :auto-manual="[13, 15]"
          :marcha="[1, 12, 14, 73, 74, 75]"
          :alarma="[12, 14, 73, 74, 75]"
          :tipo="1"
          :categories="[
            'Activo',
            'MarchaParo',
            'Remoto',
            'Manual',
            'Falta de consenso',
          ]"
        />
        <GraficaEstadoCard
          :variables="[12, 73, 74, 75]"
          :height="300"
          title="Alarmas"
          :tipo="1"
          :categories="[
            'Falta Inicio Ciclo',
            'Tope Palets Alcanzado',
            'Termico Agitador',
            'Fallo Agua ',
            'Fallo Aire',
          ]"
        />
        <GraficaLineaCard
          title="Dosis de fungicida"
          :variables="[7, 8, 9, 10, 11]"
          :tipo="1"
        />
        <!-- <div>
           Tabla Reposiciones y grafica 
        </div> -->
        <FrutaProcesadaComun :fruta="48" :tipo="2" />
        <GraficaEstadoCard
          :variables="[2, 3, 4, 5, 6]"
          :height="300"
          title="Estado de los agitadores"
          :tipo="1"
          :categories="[
            'Agitador Producto 1',
            'Agitador Producto 2',
            'Agitador Producto 3',
            'Agitador Producto 4',
            'Agitador Producto 5',
          ]"
        />
        <GraficaEstadoCard
          :variables="[20, 21, 22, 23, 24]"
          :height="300"
          title="Estado de los niveles de las garrafas"
          :tipo="1"
          :estados="['Aviso', '']"
          :categories="[
            'Nivel Garrafa P1',
            'Nivel Garrafa P2',
            'Nivel Garrafa P3',
            'Nivel Garrafa P4',
            'Nivel Garrafa P5',
          ]"
        />
        <!-- <v-btn
          color="info"
          class="mt-2"
          @click="
            routerStore().menu(
              'deccodaf:Otras',
              routerStore().clienteID,
              routerStore().lineasID
            )
          "
          >Otras Variables</v-btn
        > -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCODAFPrincipal",
};
</script>
<script setup>
import axios from "axios";
import { routerStore } from "../../stores/index";
import {
  obtenerMaquina,
  obtenerProductos,
  obtenerTurnos,
} from "../../helpers/bd";
import Estado from "../../components/cards/comun/Estado.vue";
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import { onMounted, ref } from "vue";
import TablaTurnos from "../../components/tablas/comun/TablaTurnos.vue";
import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import TablaAlarmasTurnos from "../../components/tablas/comun/TablaAlarmasTurnos.vue";
import TablaNivelesGarrafa from "../../components/tablas/deccodaf/TablaNivelesGarrafa.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
import LoteCliente from "../../components/cards/comun/LoteCliente.vue";

const turnos = ref(true);

const producto1 = ref(null);
const producto2 = ref(null);
const producto3 = ref(null);
const producto4 = ref(null);
const producto5 = ref(null);

const productos = ref(null);
const cargado = ref(false);
const guardado = ref(false);
const mensaje = ref("");

async function save() {
  let array = [
    producto1.value,
    producto2.value,
    producto3.value,
    producto4.value,
    producto5.value,
  ];
  let maquina = await obtenerMaquina("lineaTipo", routerStore().lineasID, 1);
  if (!productos.value) {
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
        id: productos.value[index].id,
        activo: productos.value[index].activo,
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
}
const turnosA = ref([]);
onMounted(async () => {
  cargado.value = false;
  turnosA.value = await obtenerTurnos(routerStore().clienteID);
  turnos.value = turnosA.value.length > 0 ? true : false;
  guardado.value = false;
  let maquina = await obtenerMaquina("lineaTipo", routerStore().lineasID, 1);
  let t = await obtenerProductos("maquina", maquina[0].id);
  if (t.length > 1) {
    producto1.value = t[0].nombre;
    producto2.value = t[1].nombre;
    producto3.value = t[2].nombre;
    producto4.value = t[3].nombre;
    producto5.value = t[4].nombre;
    productos.value = t;
  }
  cargado.value = true;
});
</script>
