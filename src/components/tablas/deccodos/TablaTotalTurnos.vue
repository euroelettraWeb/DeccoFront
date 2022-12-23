<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col v-if="cargado">
          <v-row>
            <v-col>
              <v-card-title>Consumo en este periodo en Litros</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mx-4 mb-4">
              <v-simple-table dense>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left" colspan="2"></th>
                      <th
                        v-for="item in unidades"
                        :key="item.id"
                        class="text-left"
                      >
                        {{ item.nombre }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th rowspan="2">T. mañana</th>
                      <td>Auto</td>
                      <td
                        v-for="item in consumosMA"
                        :key="item.id"
                        class="text-center"
                      >
                        {{ item.name }}
                      </td>
                      <td>
                        {{ Math.round(consumosMarchaAuto[0] / 60) }}
                      </td>
                    </tr>
                    <tr>
                      <td>Manual</td>
                      <td
                        v-for="item in consumosMM"
                        :key="item.id"
                        class="text-center"
                      >
                        {{ item.name }}
                      </td>
                      <td>
                        {{ Math.round(consumosMarchaManual[0] / 60) }}
                      </td>
                    </tr>
                    <tr>
                      <th rowspan="2">T. tarde</th>
                      <td>Auto</td>
                      <td
                        v-for="item in consumosTA"
                        :key="item.id"
                        class="text-center"
                      >
                        {{ item.name }}
                      </td>
                      <td>
                        {{ Math.round(consumosMarchaAuto[1] / 60) }}
                      </td>
                    </tr>
                    <tr>
                      <td>Manual</td>
                      <td
                        v-for="item in consumosTM"
                        :key="item.id"
                        class="text-center"
                      >
                        {{ item.name }}
                      </td>
                      <td>
                        {{ Math.round(consumosMarchaManual[1] / 60) }}
                      </td>
                    </tr>
                    <tr>
                      <th rowspan="2">T. noche</th>
                      <td>Auto</td>
                      <td
                        v-for="item in consumosNA"
                        :key="item.id"
                        class="text-center"
                      >
                        {{ item.name }}
                      </td>
                      <td>
                        {{ Math.round(consumosMarchaAuto[2] / 60) }}
                      </td>
                    </tr>
                    <tr>
                      <td>Manual</td>
                      <td
                        v-for="item in consumosNM"
                        :key="item.id"
                        class="text-center"
                      >
                        {{ item.name }}
                      </td>
                      <td>
                        {{ Math.round(consumosMarchaManual[2] / 60) }}
                      </td>
                    </tr>
                    <tr>
                      <th rowspan="2">Total Hoy</th>
                      <td>Auto</td>
                      <td
                        v-for="item in consumosA"
                        :key="item.id"
                        class="text-center"
                      >
                        {{ item.name }}
                      </td>
                      <td>
                        {{ Math.round(consumosMarchaAuto[3] / 60) }}
                      </td>
                    </tr>
                    <tr>
                      <td>Manual</td>
                      <td
                        v-for="item in consumosM"
                        :key="item.id"
                        class="text-center"
                      >
                        {{ item.name }}
                      </td>
                      <td>
                        {{ Math.round(consumosMarchaManual[3] / 60) }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
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
  </v-container>
</template>
<script>
export default {
  name: "TablaTotalTurnos",
};
</script>
<script setup>
import bd from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

let consumosMA = ref([]);
let consumosTA = ref([]);
let consumosNA = ref([]);
let consumosA = ref([]);
let unidades = ref([
  { d: 0, nombre: "Aplicador 2 Discos" },
  { d: 1, nombre: "Aplicador 3 Discos" },
  { d: 2, nombre: "Bomba 1" },
  { d: 3, nombre: "Bomba 2" },
  { d: 4, nombre: "Bomba 3" },
  { d: 5, nombre: "Bomba 4" },
  { d: 6, nombre: "Bomba 5" },
  { d: 7, nombre: "Marcha ( min )" },
]);
let consumosMM = ref([]);
let consumosTM = ref([]);
let consumosNM = ref([]);
let consumosM = ref([]);
let consumosMarchaAuto = ref([]);
let consumosMarchaManual = ref([]);
let cargado = ref(false);

const props = defineProps({
  variables: { type: Array, default: new Array() },
  modo: { type: Array, default: new Array(2) },
  tipo: { type: Number, default: 2 },
});

onMounted(async () => {
  cargado.value = false;

  let maquinaID = (
    await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  let horasMarchaAuto = await bd.obtenerDatosVariableGeneral(
    "24H-Turno",
    "registrosY",
    "multiple",
    "turnosMarchaValor",
    [31, 40, 42, 41],
    maquinaID,
    routerStore().clienteID
  );
  let horasMarchaManual = await bd.obtenerDatosVariableGeneral(
    "24H-Turno",
    "registrosY",
    "multiple",
    "turnosMarchaValor",
    [31, 40, 42, 43],
    maquinaID,
    routerStore().clienteID
  );
  for (let index = 0; index < props.variables.length; index++) {
    const element = props.variables[index];
    let i = await bd.obtenerDatosVariableGeneral(
      "24H-Turno",
      "registrosY",
      "multiple",
      "turnosAutoManual",
      [41, 43, element],
      maquinaID,
      routerStore().clienteID
    );
    // unidades.value.push({
    //   id: index,
    //   nombre: i.nombreCorto,
    // });
    consumosMA.value.push({
      id: index,
      name: Math.max(0, i.registros.auto[0]),
    });
    consumosTA.value.push({
      id: index,
      name: Math.max(0, i.registros.auto[1]),
    });
    consumosNA.value.push({
      id: index,
      name: Math.max(0, i.registros.auto[2]),
    });
    consumosA.value.push({
      id: index,
      name: Math.max(0, i.registros.auto[3]),
    });

    consumosMM.value.push({
      id: index,
      name: Math.max(0, i.registros.manual[0]),
    });
    consumosTM.value.push({
      id: index,
      name: Math.max(0, i.registros.manual[1]),
    });
    consumosNM.value.push({
      id: index,
      name: Math.max(0, i.registros.manual[2]),
    });
    consumosM.value.push({
      id: index,
      name: Math.max(0, i.registros.manual[3]),
    });
  }

  consumosMarchaAuto.value = horasMarchaAuto.total;
  consumosMarchaManual.value = horasMarchaManual.total;
  // unidades.value.push({ id: unidades.value.length, nombre: "Marcha ( min )" });
  cargado.value = true;
});
</script>
