<template>
  <v-row
    ><v-col
      ><v-simple-table dense>
        <template #default>
          <thead>
            <tr>
              <th></th>
              <th v-for="head in headers" :key="head.id">{{ head.name }}</th>
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
                  </tr>
                  <tr>
                    <td>{{ total.value1 }}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>Kilos</td>
              <td v-for="kg in kilos" :key="kg.id">{{ kg.total }}</td>
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
const consumos = ref([{ id: 0, name: "", totales: [] }]);
const kilos = ref([]);
const props = defineProps({
  maquina: { type: Number, default: 1 },
  inicio: { type: String, default: "" },
  fin: { type: String, default: "" },
  series: { type: Array, default: () => [] },
  clienteID: { type: Number, default: 1 },
});

onMounted(async () => {
  const [totales, kilosA] = await Promise.all([
    obtenerDatosVariableGeneral(
      "historico",
      "registrosYZ",
      "individual",
      "totalZValor",
      [82, 83],
      props.maquina,
      props.clienteID,
      props.inicio,
      props.fin,
      [49, 50]
    ),
    obtenerDatosVariableGeneral(
      "historico",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      props.maquina,
      props.clienteID,
      props.inicio,
      props.fin
    ),
  ]);
  const mapTotales2 = totales[0].registros[0].total.map((element) => ({
    id: 0 + "2",
    name: element.name,
    totales: [
      { id: 0, value: Math.floor(element.total * 100) / 100, value1: 0 },
    ],
  }));
  const mapTotales3 = totales[1].registros[0].total.map((element) => ({
    id: 0 + "3",
    name: element.name,
    totales: [
      { id: 0, value: 0, value1: Math.floor(element.total * 100) / 100 },
    ],
  }));

  kilos.value.push({
    id: kilosA[0].registros[0].total,
    total: kilosA[0].registros[0].total / 1000,
  });

  mapTotales3.forEach((element) => {
    const index = mapTotales2.findIndex((e) => e.name === element.name);
    if (index === -1) {
      mapTotales2.push(element);
    } else {
      mapTotales2[index].totales[0].value = element.totales[0].value1;
    }
  });

  if (!moment(props.inicio).isSame(props.fin, "day")) {
    let dates = getDatesBetween(props.inicio, props.fin);
    headers.value.push(...dates);
    let acc = 1;
    for (let index = 0; index < dates.length; index++) {
      const element = dates[index].name;
      const [totales2D, kilosD] = await Promise.all([
        obtenerDatosVariableGeneral(
          "historico",
          "registrosYZ",
          "individual",
          "totalZValor",
          [82, 83],
          props.maquina,
          props.clienteID,
          moment(element).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
          moment(element).endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
          [49, 50]
        ),
        obtenerDatosVariableGeneral(
          "historico",
          "totales",
          "individual",
          "sinfiltro",
          [48],
          props.maquina,
          props.clienteID,
          moment(element).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
          moment(element).endOf("day").format("YYYY-MM-DDTHH:mm:ss")
        ),
      ]);
      totales2D[0].registros[0].total.forEach((element) => {
        const index = mapTotales2.findIndex((e) => e.name === element.name);
        mapTotales2[index].totales.push({
          id: "valor2" + element.name + acc,
          value: Math.floor(element.total * 100) / 100,
          value1: 0,
        });
      });
      totales2D[1].registros[0].total.forEach((element) => {
        const index = mapTotales2.findIndex((e) => e.name === element.name);
        if (!mapTotales2[index].totales[acc]) {
          mapTotales2[index].totales.push({
            id: "valor3" + element.name + acc,
            value: 0,
            value1: Math.floor(element.total * 100) / 100,
          });
        } else {
          mapTotales2[index].totales[acc].value1 =
            Math.floor(element.total * 100) / 100;
        }
        acc++;
      });
      kilos.value.push({
        id: element + acc + kilosD[0].registros[0].total,
        total: kilosD[0].registros[0].total / 1000,
      });
    }
  }
  consumos.value = mapTotales2;
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
      id: currentDate.valueOf(),
      name: currentDate.format("YYYY-MM-DD"),
    });
    currentDate = currentDate.add(1, "day");
  }

  return dates;
}
</script>
