<template>
  <v-row
    ><v-col
      ><v-simple-table dense>
        <template #default>
          <thead>
            <tr v-for="head in headers" :key="head.id">
              <th>{{ head.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in consumos" :key="item.id">
              <td>
                {{ item.name }}
              </td>
              <td v-for="total in item.totales" :key="total.id">
                <table>
                  <tr>
                    <td>{{ total.value }}</td>
                    <td>{{ total.value1 }}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr v-for="kg in kilos" :key="kg.id">
              <td>{{ kg.total }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table></v-col
    ></v-row
  >
</template>
<script setup>
import { obtenerDatosVariableGeneral } from "../../../helpers/bd";
import { ref, onMounted, onUnmounted } from "vue";
import moment from "moment";

const headers = ref([{ id: 0, name: "Total" }]);
const consumos = ref([]);
const kilos = ref([]);
const props = defineProps({
  maquina: { type: Number, default: 1 },
  inicio: { type: String, default: "" },
  fin: { type: String, default: "" },
  series: { type: Array, default: () => [] },
  clienteID: { type: String, default: "" },
});

onMounted(async () => {
  const [totales2, totales3] = await Promise.all([
    obtenerDatosVariableGeneral(
      "historico",
      "registrosY",
      "multiple",
      "sinfiltro",
      [49, 82],
      props.maquina,
      props.clienteID,
      props.inicio,
      props.fin
    ),
    obtenerDatosVariableGeneral(
      "historico",
      "registrosY",
      "multiple",
      "sinfiltro",
      [50, 83],
      props.maquina,
      props.clienteID,
      props.inicio,
      props.fin
    ),
  ]);

  const mapTotales2 = totales2.total.map((element) => ({
    id: 0,
    name: element.name,
    totales: [{ id: 0, value: element.total, value1: 0 }],
  }));

  const mapTotales3 = totales3.total.map((element) => ({
    id: 0,
    name: element.name,
    totales: [{ id: 0, value: 0, value1: element.total }],
  }));

  mapTotales3.forEach((element) => {
    const index = mapTotales2.findIndex((e) => e.name === element.name);
    if (index === -1) {
      mapTotales2.push(element);
    } else {
      mapTotales2[index].totales[0].value = element.totales[0].value1;
    }
  });

  consumos.value = mapTotales2;
  if (!moment(props.inicio).isSame(props.fin, "day")) {
    let dates = getDatesBetween(props.inicio, props.fin);
    headers.value.push(...dates);
    const promises = dates.map(async (element, i) => {
      const [totales2D, totales3D, kilosD] = await Promise.all([
        obtenerDatosVariableGeneral(
          "historico",
          "registrosYZ",
          "multiple",
          "totalZValor",
          [49, 82],
          props.maquina,
          props.clienteID,
          moment(element).startOf("day"),
          moment(element).endOf("day")
        ),
        obtenerDatosVariableGeneral(
          "historico",
          "registrosYZ",
          "multiple",
          "totalZValor",
          [50, 83],
          props.maquina,
          props.clienteID,
          moment(element).startOf("day"),
          moment(element).endOf("day")
        ),
        obtenerDatosVariableGeneral(
          "historico",
          "registros",
          "individual",
          "unidadTiempo",
          [48],
          props.maquina,
          props.clienteID,
          moment(element).startOf("day"),
          moment(element).endOf("day")
        ),
      ]);

      totales2D.total.forEach((element) => {
        const index = consumos.value.findIndex((e) => e.name === element.name);
        consumos.value[index].totales.push({
          id: i + 1,
          value: element.total,
          value1: 0,
        });
      });

      totales3D.total.forEach((element) => {
        const index = consumos.value.findIndex((e) => e.name === element.name);
        if (!consumos.value[index].totales[i + 1]) {
          consumos.value[index].totales.push({
            id: i + 1,
            value: 0,
            value1: element.total,
          });
        } else {
          consumos.value[index].totales[i + 1].value1 = element.total;
        }
      });
      kilosD.total.forEach((element) => {
        kilos.value.push(element[0].registros[0].total);
      });
    });

    await Promise.all(promises);
    const kilosA = await obtenerDatosVariableGeneral(
      "historico",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      props.maquina,
      props.clienteID,
      props.inicio,
      props.fin
    );
    kilos.value.push(kilosA[0].registros[0].total);
  }
});
onUnmounted(() => {
  consumos.value = null;
});
function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = moment(startDate);
  const lastDate = moment(endDate);
  while (currentDate <= lastDate) {
    dates.push();

    dates.push({
      id: currentDate,
      name: currentDate.format("YYYY-MM-DD"),
    });
    currentDate = currentDate.add(1, "day");
  }

  return dates;
}
</script>
