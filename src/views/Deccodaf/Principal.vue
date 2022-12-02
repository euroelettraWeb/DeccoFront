<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCODAF - {{ nombreLinea }}
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
        <TablaTurnos v-if="turnos" :tipo="1" />
        <TablaTotalTurnos
          v-if="turnos"
          :variables="[25, 26, 27, 28, 29, 30]"
          :marcha="[1, 12, 14]"
          :tipo="1"
        />
        <TablaTotal
          v-else
          :variables="[25, 26, 27, 28, 29, 30]"
          :marcha="[1, 12, 14]"
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
        <Estado
          :activo="1"
          :auto="13"
          :manual="15"
          :alarma="12"
          :fc="14"
          :tipo="1"
        />
        <Dosis
          title="Dosis de fungicida"
          :variables="[7, 8, 9, 10, 11]"
          :tipo="1"
        />
        <FrutaProcesadaComun :fruta="19" :tipo="1" />
        <v-btn
          color="info"
          @click="
            routerStore().menu(
              'deccodaf:Otras',
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
  name: "DECCODAFPrincipal",
};
</script>
<script setup>
import axios from "axios";
import { routerStore } from "../../stores/index";
import bd from "../../helpers/bd";
import Estado from "../../components/cards/comun/Estado.vue";
import Dosis from "../../components/cards/comun/Dosis.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import { onMounted, ref } from "vue";
import TablaTurnos from "../../components/tablas/comun/TablaTurnos.vue";
import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";

let nombreLinea = ref("");
let nombreCliente = ref("");
let turnos = ref(true);

let producto1 = ref(null);
let producto2 = ref(null);
let producto3 = ref(null);
let producto4 = ref(null);
let producto5 = ref(null);

let productos = ref(null);
let cargado = ref(false);

async function save() {
  let array = [
    producto1.value,
    producto2.value,
    producto3.value,
    producto4.value,
    producto5.value,
  ];
  let maquina = await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, 1);
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
  }
}

onMounted(async () => {
  cargado.value = false;
  nombreLinea.value = (await bd.obtenerLinea(routerStore().lineasID))[0].nombre;
  nombreCliente.value = (
    await bd.obtenerCliente(routerStore().clienteID)
  )[0].nombre;
  let maquina = await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, 1);
  let t = await bd.obtenerProductos("maquina", maquina[0].id);
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
