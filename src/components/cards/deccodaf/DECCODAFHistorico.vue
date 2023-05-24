<template>
  <v-row no-gutters>
    <v-col>
      <v-card>
        <v-row no-gutters>
          <v-col>
            <v-card-title> DECCODAF </v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col><v-btn>Fechas</v-btn></v-col>
          <v-col><v-btn>Lotes</v-btn></v-col>
        </v-row>
        <v-row class="pl-8">
          <v-col
            ><date-picker
              class="selectdates"
              apply-button-label="Use"
              :date-input="dateInput"
              :format="'DD MM YYYY HH:mm'"
              :same-date-format="sameDateFormat"
              @date-applied="dateApplied"
              @on-reset="onReset"
          /></v-col>
          <v-col
            ><v-btn @click="print()"><v-icon>mdi-file-pdf-box</v-icon></v-btn
            ><v-btn @click="toExcel()"
              ><v-icon>mdi-microsoft-excel</v-icon></v-btn
            ></v-col
          >
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-row>
              <v-col v-if="cargado7">
                <v-simple-table dense>
                  <template #default>
                    <thead>
                      <tr>
                        <th></th>
                        <th>L</th>
                        <th v-if="deccodos">Litros/Tonelada</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in consumos" :key="item.id">
                        <td>
                          {{ item.nombre }}
                        </td>
                        <td>
                          {{ item.total }}
                        </td>
                        <td v-if="deccodos">
                          {{ item.totalPorToneladaFruta }}
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
              <v-col v-if="cargado8">
                <v-simple-table dense>
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left"></th>
                        <th>Min</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="alarmaItem in alarmas" :key="alarmaItem.id">
                        <td>{{ alarmaItem.nombre }}</td>
                        <td>
                          {{ alarmaItem.name }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-simple-table dense>
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left"></th>
                        <th>Min</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="tiempoItem in tiempos" :key="tiempoItem.id">
                        <td>{{ tiempoItem.nombre }}</td>
                        <td>
                          {{ tiempoItem.name }}
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
                ></v-progress-circular> </v-col
            ></v-row>
            <GraficoEstadoCardGen
              :serie="series"
              title="Estado"
              :categories="[
                'Activo',
                'MarchaParo',
                'Remoto',
                'Manual',
                'Falta de consenso',
              ]"
              :tooltipy="false"
              :legend="false"
              :cargado="cargado1"
            />
            <GraficoEstadoCardGen
              :serie="series4"
              title="Alarmas"
              :categories="[
                'Falta Inicio Ciclo',
                'Tope Palets Alcanzado',
                'Termico Agitador',
                'Fallo Agua',
                'Fallo Aire',
                'Agitador',
              ]"
              :tooltipy="false"
              :legend="false"
              :cargado="cargado1"
            />
            <GraficoLineaCardGen
              :serie="seriesL"
              title="Dosis"
              :cargado="cargado3"
            />
            <FrutaProcesadaHistorico
              v-if="deccodos"
              :serie="seriesL4"
              title="Kilos"
              :cargado="cargado6"
            />
            <GraficoEstadoCardGen
              :serie="series3"
              title="Estado de los niveles y bidon"
              :tooltipy="true"
              :legend="true"
              :categories="[
                'Nivel Garrafa P1',
                'Nivel Garrafa P2',
                'Nivel Garrafa P3',
                'Nivel Garrafa P4',
                'Nivel Garrafa P5',
                'Flujo de producto',
              ]"
              :cargado="cargado9"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "DECCODAFHistoricoCard",
};
function print() {
  window.print();
}
</script>
<script setup>
import { utils, writeFileXLSX } from "xlsx";
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref, onUnmounted } from "vue";
import { routerStore } from "../../../stores/index";
import moment from "moment";
import DatePicker from "vue-time-date-range-picker/dist/vdprDatePicker";
import GraficoEstadoCardGen from "../comun/GraficoEstadoCardGen.vue";
import GraficoLineaCardGen from "../comun/GraficoLineaCardGen.vue";
import FrutaProcesadaHistorico from "../comun/FrutaProcesadaHistorico.vue";

const props = defineProps({
  linea: { type: Number, default: 1 },
  maquina: { type: Number, default: 1 },
});

function onReset() {
  inicio.value = "";
  fin.value = "";
}
async function dateApplied(date1, date2) {
  inicio.value = moment(date1).format("YYYY-MM-DDTHH:mm:ss");
  fin.value = moment(date2).format("YYYY-MM-DDTHH:mm:ss");
  series.value = [];
  seriesL.value = [];
  seriesL4.value = [];
  alarmas.value = [];

  cargado.value = false;
  cargado1.value = false;
  cargado3.value = false;
  cargado4.value = false;
  cargado5.value = false;
  cargado6.value = false;
  cargado7.value = false;
  cargado8.value = false;
  cargado9.value = false;
  cargado10.value = false;
  let estado = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [1],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );

  const autoManual = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [13, 15],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  estado[1].data.push(...autoManual[1].data);
  cargado1.value = true;
  const marcha = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    [1, 12, 14, 73, 74, 75],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  estado[0].data.push(...marcha[0].data);
  estado[1].data.push(...marcha[1].data);
  const funcMaquina = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [12],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  funcMaquina[1].data.forEach((element) => {
    element.fillColor =
      element.x === "Falta de consenso" ? "#3949ab" : "#fdd835";
    estado[1].data.push(element);
  });
  series.value = estado;
  cargado1.value = true;
  const alarmasR = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [12, 73, 74, 75],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  series4.value = alarmasR;
  cargado10.value = true;
  const otros = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [20, 21, 22, 23, 24],
    props.maquina,
    routerStore().clienteID,
    null,
    null,
    ["Aviso", ""]
  );
  series3.value = otros;
  cargado9.value = true;
  const dosis = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLinea",
    [7, 8, 9, 10, 11],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesL.value = dosis;
  cargado3.value = true;
  const totales = await obtenerDatosVariableGeneral(
    "historico",
    "totales",
    "individual",
    "sinfiltro",
    [25, 26, 27, 28, 29, 30],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  if (deccodos.value) {
    const totalFruta = await obtenerDatosVariableGeneral(
      "historico",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      deccodos.value,
      routerStore().clienteID,
      inicio.value,
      fin.value
    );
    let kilos = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoAcumuladores",
      [48],
      deccodos.value,
      routerStore().clienteID,
      inicio.value,
      fin.value
    );
    const kilosM = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "unidadTiempo",
      [48],
      deccodos.value,
      routerStore().clienteID,
      inicio.value,
      fin.value,
      "Kg/min"
    );
    kilos.push(...kilosM);
    seriesL4.value = kilos;
    const consumosValue = totales.map((element, index) => {
      const { registros, descripcion } = element;
      const n = Math.max(0, registros[0].total);
      const totalFrutaRegistrosTotal = totalFruta[0].registros[0].total;

      const d =
        totalFrutaRegistrosTotal > 0
          ? (n / (totalFrutaRegistrosTotal / 1000)).toFixed(2)
          : "0";

      return {
        id: descripcion + index,
        nombre: descripcion,
        total: n.toLocaleString("es-ES"),
        totalPorToneladaFruta: d,
      };
    });
    const totalFrutaConsumo = {
      id: totalFruta[0].nombreCorto + consumosValue.length,
      nombre: totalFruta[0].nombreCorto,
      total: (totalFruta[0].registros[0].total / 1000).toLocaleString("es-ES"),
    };

    consumos.value = [...consumosValue, totalFrutaConsumo];
    cargado6.value = true;
  } else {
    const consumosValue = totales.map((element, index) => ({
      id: element.descripcion + index,
      nombre: element.descripcion,
      total: Math.max(0, element.registros[0].total).toLocaleString("es-ES"),
    }));
    consumos.value = [...consumosValue];
  }
  const marchat = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "multiple",
    "totalMarcha",
    [1, 12, 14, 73, 74, 75],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  cargado7.value = true;
  const alarma = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "totalRangos",
    [12, 14, 73, 74, 75],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  const acc = alarma.reduce((total, element, index) => {
    const val = Math.max(0, Math.round(element.registros.total1 / 60));
    alarmas.value.push({
      id: element.nombreCorto + index,
      nombre: element.nombreCorto,
      name: val,
    });
    return total + val;
  }, 0);
  tiempos.value[0].name = acc;
  tiempos.value[1].name = Math.max(0, Math.round(marchat.total / 60));
  cargado8.value = true;
  cargado.value = true;
}

const cargado = ref(false);
const cargado1 = ref(false);
const cargado3 = ref(false);
const cargado4 = ref(false);
const cargado5 = ref(false);
const cargado6 = ref(false);
const cargado7 = ref(false);
const cargado8 = ref(false);
const cargado9 = ref(false);
const cargado10 = ref(false);

const series = ref([]);
const series3 = ref([]);
const series4 = ref([]);
const seriesL = ref([]);
const seriesL4 = ref([]);

const consumos = ref([]);
const tiempos = ref([
  {
    id: 0,
    nombre: "Paro",
    name: 0,
  },
  {
    id: 1,
    nombre: "Marcha",
    name: 0,
  },
]);
const alarmas = ref([]);
const deccodos = ref(null);

const sameDateFormat = {
  from: "DD MM YYYY, HH:mm",
  to: "HH:mm",
};
const inicio = ref("");
const fin = ref("");

const dateInput = {
  placeholder: "Seleccionar fechas",
  inputClass: "selectdates",
};
onMounted(async () => {
  cargado.value = false;
  cargado1.value = false;
  const maquina = await obtenerMaquina("lineaTipo", props.linea, 2);
  deccodos.value = maquina[0].id;
  let estado = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [1],
    props.maquina,
    routerStore().clienteID
  );
  const autoManual = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [13, 15],
    props.maquina,
    routerStore().clienteID
  );
  estado[1].data.push(...autoManual[1].data);
  cargado1.value = true;
  const marcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    [1, 12, 14, 73, 74, 75],
    props.maquina,
    routerStore().clienteID
  );
  estado[0].data.push(...marcha[0].data);
  estado[1].data.push(...marcha[1].data);
  const funcMaquina = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [12, 14, 73, 74, 75],
    props.maquina,
    routerStore().clienteID
  );
  funcMaquina[1].data.forEach((element) => {
    element.fillColor =
      element.x === "Falta de consenso" ? "#3949ab" : "#fdd835";
    estado[1].data.push(element);
  });
  series.value = estado;
  cargado1.value = true;
  cargado10.value = false;
  const alarmasR = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [12, 73, 74, 75],
    props.maquina,
    routerStore().clienteID
  );
  series4.value = alarmasR;
  cargado10.value = true;
  cargado9.value = false;
  const otros = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [20, 21, 22, 23, 24],
    props.maquina,
    routerStore().clienteID,
    null,
    null,
    ["Aviso", ""]
  );
  series3.value = otros;
  cargado9.value = true;
  cargado3.value = false;
  const dosis = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoLinea",
    [7, 8, 9, 10, 11],
    props.maquina,
    routerStore().clienteID
  );
  seriesL.value = dosis;
  cargado3.value = true;
  cargado7.value = false;
  const totales = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [25, 26, 27, 28, 29, 30],
    props.maquina,
    routerStore().clienteID
  );
  if (deccodos.value) {
    const totalFruta = await obtenerDatosVariableGeneral(
      "24H",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      deccodos.value,
      routerStore().clienteID
    );
    let kilos = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "individual",
      "formatoAcumuladores",
      [48],
      deccodos.value,
      routerStore().clienteID
    );
    const kilosM = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "individual",
      "unidadTiempo",
      [48],
      deccodos.value,
      routerStore().clienteID,
      null,
      null,
      "Kg/min"
    );
    kilos.push(...kilosM);
    seriesL4.value = kilos;
    const consumosValue = totales.map((element, index) => {
      const { registros, descripcion } = element;
      const n = Math.max(0, registros[0].total);
      const totalFrutaRegistrosTotal = totalFruta[0].registros[0].total;

      const d =
        totalFrutaRegistrosTotal > 0
          ? (n / (totalFrutaRegistrosTotal / 1000)).toFixed(2)
          : "0";

      return {
        id: descripcion + index,
        nombre: descripcion,
        total: n.toLocaleString("es-ES"),
        totalPorToneladaFruta: d,
      };
    });
    const totalFrutaConsumo = {
      id: totalFruta[0].nombreCorto + consumosValue.length,
      nombre: totalFruta[0].nombreCorto,
      total: (totalFruta[0].registros[0].total / 1000).toLocaleString("es-ES"),
    };

    consumos.value = [...consumosValue, totalFrutaConsumo];
    cargado6.value = true;
  } else {
    const consumosValue = totales.map((element, index) => ({
      id: element.descripcion + index,
      nombre: element.descripcion,
      total: Math.max(0, element.registros[0].total).toLocaleString("es-ES"),
    }));
    consumos.value = [...consumosValue];
  }
  cargado7.value = true;
  cargado8.value = false;
  const horasMarcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "totalMarcha",
    [1, 12, 14, 73, 74, 75],
    props.maquina,
    routerStore().clienteID
  );
  const alarma = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "totalRangos",
    [12, 14, 73, 74, 75],
    props.maquina,
    routerStore().clienteID
  );
  const acc = alarma.reduce((total, element, index) => {
    const val = Math.max(0, Math.round(element.registros.total1 / 60));
    alarmas.value.push({
      id: element.nombreCorto + index,
      nombre: element.nombreCorto,
      name: val,
    });
    return total + val;
  }, 0);
  tiempos.value[0].name = acc;
  tiempos.value[1].name = Math.max(0, Math.round(horasMarcha.total / 60));
  cargado8.value = true;
  cargado.value = true;
});
onUnmounted(() => {
  series.value = [];
  seriesL.value = [];
  seriesL4.value = [];
  consumos.value = [];
  alarmas.value = [];
});
async function toExcel() {
  const wb = utils.book_new();
  for (let index = 0; index < seriesL.value.length; index++) {
    const element = seriesL.value[index];
    const dosisA = element.data.map((e) => {
      return {
        fecha: moment(e.x).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
        valor: e.y,
      };
    });
    const ws = utils.json_to_sheet(dosisA);
    utils.book_append_sheet(wb, ws, "Dosis" + index);
  }
  const kilosA = seriesL4.value[0].data.map((e) => {
    return {
      fecha: moment(e.x).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
      valor: e.y,
    };
  });
  const wsk = utils.json_to_sheet(kilosA);
  utils.book_append_sheet(wb, wsk, "Kilos");
  kilosA = seriesL4.value[1].data.map((e) => {
    return {
      fecha: moment(e.x).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
      valor: e.y,
    };
  });
  const ws = utils.json_to_sheet(kilosA);
  utils.book_append_sheet(wb, ws, "Kg-min");
  // const ws2 = utils.json_to_sheet(kilosA);
  // utils.book_append_sheet(wb, ws2, "Fruta");
  const consumosA = consumos.value.map((e) => {
    return {
      nombre: e.nombre,
      total: e.total,
      totalPorToneladaFruta: e.totalPorToneladaFruta,
    };
  });
  const ws3 = utils.json_to_sheet(consumosA);
  utils.book_append_sheet(wb, ws3, "Consumos");
  const alarmasA = alarmas.value.map((e) => {
    return {
      nombre: e.nombre,
      total: e.name,
    };
  });
  const ws4 = utils.json_to_sheet(alarmasA);
  utils.book_append_sheet(wb, ws4, "Alarmas");
  writeFileXLSX(wb, "DECCODAF" + inicio.value + "-" + fin.value + ".xlsx");
}
</script>
<style>
.vdpr-datepicker .selectdates {
  border: 1px solid #000;
  padding: 12px;
  width: 300px;
}
</style>
