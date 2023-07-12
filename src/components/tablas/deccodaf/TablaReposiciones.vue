<template>
  <v-row>
    <v-col>
      <v-switch v-model="mostrar" color="info" label="Numero de reposiciones"
        >Numero de reposiciones</v-switch
      >
      <v-card v-if="mostrar">
        <v-row>
          <v-col v-if="cargado">
            <v-row no-gutters>
              <v-col>
                <v-simple-table>
                  <template #default
                    ><thead>
                      <tr>
                        <th>Modo</th>
                        <th class="text-left">Auto</th>
                        <th class="text-left">Manual</th>
                        <th class="text-left">SRC</th>
                        <th class="text-left">Cajas/palets</th>
                        <th class="text-left">Parcial</th>
                        <th class="text-left">Tiempo-Marcha</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Auto</td>
                        <td v-for="item in niveles" :key="item.id">
                          {{ item.n0 }}
                        </td>
                      </tr>
                      <tr>
                        <td>Manual</td>
                        <td v-for="item in niveles" :key="item.id">
                          {{ item.n0 }}
                        </td>
                      </tr>
                      <tr>
                        <td>Cajas/palets</td>
                        <td v-for="item in niveles" :key="item.id">
                          {{ item.n0 }}
                        </td>
                      </tr>

                      <tr>
                        <td>SRC</td>
                        <td v-for="item in niveles" :key="item.id">
                          {{ item.n0 }}
                        </td>
                      </tr>
                      <tr>
                        <td>Reposiciones</td>
                        <td v-for="item in niveles" :key="item.id">
                          {{ item.n0 }}
                        </td>
                      </tr>
                    </tbody></template
                  ></v-simple-table
                >
              </v-col>
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
    </v-col>
  </v-row>
</template>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

let niveles = ref([]);
let cargado = ref(false);
let mostrar = ref(true);

onMounted(async () => {
  cargado.value = false;
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, 1)
  )[0].id;
  let nivel = await obtenerDatosVariableGeneral(
    "24H",
    "count",
    "individual",
    "sinfiltro",
    [20, 21, 22, 23, 24],
    maquinaID,
    routerStore().clienteID
  );

  for (let index = 0; index < nivel.length; index++) {
    let e = nivel[index].registros;
    niveles.value.push({
      id: index,
      n0: Math.max(0, Math.round(e.count)),
    });
  }
  cargado.value = true;
});
</script>
