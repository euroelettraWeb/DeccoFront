<template>
  <v-card>
    <v-row>
      <v-col v-if="cargado">
        <v-card-title>Consumo Hoy</v-card-title>
        <v-simple-table dense>
          <template #default>
            <thead>
              <tr>
                <th class="text-left"></th>
                <th>L</th>
                <th>Litros/Tonelada</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in consumos" :key="item.id">
                <td>{{ item.nombre }}</td>
                <td>
                  {{ item.total }}
                </td>
                <td v-if="deccodos">
                  {{ item.totalFruta }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
</template>
<script>
export default {
  name: "TablaTotal",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

let consumos = ref([]);
let deccodos = ref(2);
let cargado = ref(false);

const props = defineProps({
  variables: { type: Array, default: () => [] },
  marcha: { type: Array, default: () => [] },
  tipo: { type: Number, default: 1 },
});

onMounted(async () => {
  cargado.value = false;

  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  deccodos.value = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, 2)
  )[0].id;
  let totalesBD = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    props.variables,
    maquinaID,
    routerStore().clienteID
  );

  if (deccodos.value) {
    let totalesFruta = await obtenerDatosVariableGeneral(
      "24H",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      deccodos.value,
      routerStore().clienteID
    );
    for (let index = 0; index < totalesBD.length; index++) {
      const element = totalesBD[index];
      let n = Math.max(0, element.registros[0].total);
      let d =
        totalesFruta[0].registros[0].total > 0
          ? (n / (totalesFruta[0].registros[0].total / 1000)).toLocaleString(
              "es-ES"
            )
          : 0;
      consumos.value.push({
        id: index,
        nombre: element.descripcion,
        total: Math.max(0, element.registros[0].total).toLocaleString("es-ES"),
        totalFruta: d.toLocaleString("es-ES"),
      });
    }
    consumos.value.push({
      id: totalesBD.length,
      nombre: "T Fruta",
      total: Math.max(
        0,
        totalesFruta[0].registros[0].total / 1000
      ).toLocaleString("es-ES"),
    });
  } else {
    for (let index = 0; index < totalesBD.length; index++) {
      const element = totalesBD[index];
      consumos.value.push({
        id: index,
        nombre: element.descripcion,
        total: Math.max(0, element.registros[0].total)
          .toFixed(3)
          .toLocaleString("es-ES"),
      });
    }
  }

  cargado.value = true;
  setInterval(async () => {
    let totalesBD = await obtenerDatosVariableGeneral(
      "24H",
      "totales",
      "individual",
      "sinfiltro",
      props.variables,
      maquinaID,
      routerStore().clienteID
    );

    if (deccodos.value) {
      let totalesFruta = await obtenerDatosVariableGeneral(
        "24H",
        "totales",
        "individual",
        "sinfiltro",
        [48],
        deccodos.value,
        routerStore().clienteID
      );
      for (let index = 0; index < totalesBD.length; index++) {
        const element = totalesBD[index];
        let n = Math.max(0, element.registros[0].total);
        let d =
          totalesFruta[0].registros[0].total > 0
            ? (n / (totalesFruta[0].registros[0].total / 1000)).toLocaleString(
                "es-ES"
              )
            : 0;
        consumos.value[index] = {
          id: index,
          nombre: element.descripcion,
          totalFruta: d,
          total: Math.max(0, element.registros[0].total).toLocaleString(
            "es-ES"
          ),
        };
      }
      totalesFruta[0].registros[0].total =
        totalesFruta[0].registros[0].total / 1000;
      consumos.value.pop();
      consumos.value.push({
        id: totalesBD.length,
        nombre: "T Fruta",
        total: totalesFruta[0].registros[0].total.toLocaleString("es-ES"),
      });
    } else {
      for (let index = 0; index < totalesBD.length; index++) {
        const element = totalesBD[index];
        consumos.value[index] = {
          id: index,
          nombre: element.descripcion,
          total: Math.max(0, element.registros[0].total).toLocaleString(
            "es-ES"
          ),
        };
      }
    }

    // let horasMarcha = await obtenerDatosVariableGeneral(
    //   "24H",
    //   "registros",
    //   "multiple",
    //   "totalMarcha",
    //   props.marcha,
    //   maquinaID,
    //   routerStore().clienteID
    // );
    // consumos.value.pop();
    // consumos.value.push({
    //   id: unidades.value.length,
    //   name: Math.max(0, Math.round(horasMarcha.total / 60)),
    // });
  }, 3000);
});
</script>
