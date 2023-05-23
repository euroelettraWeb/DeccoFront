<template>
  <v-row no-gutters>
    <v-col>
      <v-card>
        <v-row>
          <v-col>
            <v-card-title> DECCODOS </v-card-title>
          </v-col>
        </v-row>
        <v-row class="pl-8" no-gutters>
          <v-col
            ><date-picker
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
          <v-col v-if="cargado">
            <v-row>
              <v-col v-if="cargado7">
                <v-simple-table dense>
                  <template #default>
                    <thead>
                      <tr>
                        <th></th>
                        <th>L</th>
                        <th>Litros/Tonelada</th>
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
                        <td>
                          {{ item.totalFruta }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
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
                'Alarma',
                'Presencia Fruta',
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
              :serie="seriesL4"
              title="Kilos"
              :cargado="cargado4"
            />
            <GraficoEstadoCardGen
              :serie="series2"
              title="Limpieza de cepillos"
              :height="200"
              :tooltipy="true"
              :legend="true"
              :categories="['Limpieza Cepillos']"
              :cargado="cargado2"
            />
            <GraficoLineaCardGen
              :serie="seriesL2"
              title="Cajas por Ciclo y Peso por Caja"
              :cargado="cargado5"
            />
            <GraficoLineaCardGen
              :serie="seriesL3"
              title="Cajas/Min"
              :cargado="cargado6"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "DECCODOSHistoricoCard",
};
function print() {
  window.print();
}
</script>
<script setup>
import { utils, writeFileXLSX } from "xlsx";
import { obtenerDatosVariableGeneral } from "../../../helpers/bd";
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
  let estado = {};
  let marcha = {};
  let funcMaquina = {};
  let dosis = {};
  let cporu = {};
  let cajas = {};
  let kilos = {};
  let alarma = {};
  series.value = [];
  series2.value = [];
  seriesL.value = [];
  seriesL2.value = [];
  seriesL3.value = [];
  seriesL4.value = [];

  cargado.value = false;
  cargado1.value = false;
  cargado2.value = false;
  cargado3.value = false;
  cargado4.value = false;
  cargado5.value = false;
  cargado6.value = false;
  cargado7.value = false;
  cargado8.value = false;
  estado = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [31],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  let autoManual = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [41, 43],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    estado[1].data.push(element);
  }
  cargado1.value = true;
  marcha = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    [31, 40, 42],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  for (let index = 0; index < marcha[0].data.length; index++) {
    const element = marcha[0].data[index];
    estado[0].data.push(element);
  }
  for (let index = 0; index < marcha[1].data.length; index++) {
    const element = marcha[1].data[index];
    estado[1].data.push(element);
  }
  funcMaquina = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [40, 42, 81],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  for (let index = 0; index < funcMaquina[1].data.length; index++) {
    const element = funcMaquina[1].data[index];
    if (element.x == "Alarma") {
      element.fillColor = "#fdd835";
    } else {
      element.fillColor = "#3949ab";
    }
    estado[1].data.push(element);
  }
  series.value = estado;
  cargado1.value = true;
  let cepillos = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [44],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  series2.value = cepillos;
  cargado2.value = true;
  dosis = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLinea",
    [32, 33, 34, 35, 36, 37, 38, 39],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesL.value = dosis;
  cargado3.value = true;
  kilos = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoAcumuladores",
    [48],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  let kilosM = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "unidadTiempo",
    [48],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value,
    "Kg/min"
  );
  kilos.push(...kilosM);
  seriesL4.value = kilos;
  cargado4.value = true;
  cajas = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "unidadTiempo",
    [47],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value,
    "Cajas/Min"
  );
  seriesL3.value = cajas;
  cargado5.value = true;
  cporu = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLinea",
    [45, 46],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesL2.value = cporu;
  cargado6.value = true;
  totales = await obtenerDatosVariableGeneral(
    "historico",
    "totales",
    "individual",
    "sinfiltro",
    [51, 52, 53, 54, 55, 56],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  let totalFruta = await obtenerDatosVariableGeneral(
    "historico",
    "totales",
    "individual",
    "sinfiltro",
    [48],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  consumos.value = [];
  for (let index = 0; index < totales.length; index++) {
    const element = totales[index];
    let n = Math.max(0, element.registros[0].total);
    let d =
      totalFruta[0].registros[0].total > 0
        ? (n / (totalFruta[0].registros[0].total / 1000)).toLocaleString(
            "es-ES"
          )
        : 0;
    consumos.value.push({
      id: index,
      nombre: element.descripcion,
      total: Math.max(0, element.registros[0].total).toLocaleString("es-ES"),
      totalFruta: d,
    });
  }
  consumos.value.push({
    id: consumos.value.length,
    nombre: totalFruta[0].nombreCorto + "( T )",
    total: Math.max(0, totalFruta[0].registros[0].total / 1000).toLocaleString(
      "es-ES"
    ),
  });
  let marchat = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "multiple",
    "totalMarcha",
    [31, 40, 42],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  cargado7.value = true;
  alarma = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "totalRangos",
    [40, 42],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  let totalA = [];
  for (let index = 0; index < alarma.length; index++) {
    const element = alarma[index];
    totalA.push({
      id: index,
      nombre: element.nombreCorto,
      name: Math.max(0, Math.round(element.registros.total1 / 60)),
    });
  }
  totalA.push({
    id: "Marcha" + totalA.length,
    nombre: "Marcha",
    total: Math.max(0, marchat.total).toFixed(0),
  });
  alarmas.value = totalA;
  cargado8.value = true;
  cargado.value = true;
}

let cargado = ref(false);
let cargado1 = ref(false);
let cargado2 = ref(false);
let cargado3 = ref(false);
let cargado4 = ref(false);
let cargado5 = ref(false);
let cargado6 = ref(false);
let cargado7 = ref(false);
let cargado8 = ref(false);

let series = ref([]);
let series2 = ref([]);
let seriesL = ref([]);
let seriesL2 = ref([]);
let seriesL3 = ref([]);
let seriesL4 = ref([]);

let consumos = ref([]);
let alarmas = ref([]);
let totales = {};

let sameDateFormat = {
  from: "DD MM YYYY, HH:mm",
  to: "HH:mm",
};
let inicio = ref("");
let fin = ref("");

let dateInput = {
  placeholder: "Seleccionar fechas",
  inputClass: "selectdates",
};
let estado = {};
let marcha = {};
let funcMaquina = {};
let dosis = {};
let cporu = {};
let cajas = {};
let kilos = {};
let alarma = {};
onMounted(async () => {
  cargado.value = false;
  cargado1.value = false;
  estado = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [31],
    props.maquina,
    routerStore().clienteID
  );
  let autoManual = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [41, 43],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    estado[1].data.push(element);
  }
  series.value = estado;
  cargado1.value = true;
  cargado2.value = false;
  marcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    [31, 40, 42],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < marcha[0].data.length; index++) {
    const element = marcha[0].data[index];
    estado[0].data.push(element);
  }
  for (let index = 0; index < marcha[1].data.length; index++) {
    const element = marcha[1].data[index];
    estado[1].data.push(element);
  }
  funcMaquina = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [40, 42, 81],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < funcMaquina[1].data.length; index++) {
    let element = funcMaquina[1].data[index];
    if (element.x == "Alarma") {
      element.fillColor = "#fdd835";
    } else {
      element.fillColor = "#3949ab";
    }
    estado[1].data.push(element);
  }
  let cepillos = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [44],
    props.maquina,
    routerStore().clienteID
  );
  series2.value = cepillos;
  cargado2.value = true;
  cargado3.value = false;
  dosis = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoLinea",
    [32, 33, 34, 35, 36, 37, 38, 39],
    props.maquina,
    routerStore().clienteID
  );
  seriesL.value = dosis;
  cargado3.value = true;
  cargado4.value = false;
  kilos = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoAcumuladores",
    [48],
    props.maquina,
    routerStore().clienteID
  );
  let kilosM = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "unidadTiempo",
    [48],
    props.maquina,
    routerStore().clienteID,
    null,
    null,
    "Kg/min"
  );
  kilos.push(...kilosM);
  seriesL4.value = kilos;
  cargado4.value = true;
  cargado5.value = false;
  cajas = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "unidadTiempo",
    [47],
    props.maquina,
    routerStore().clienteID,
    null,
    null,
    "Cajas/Min"
  );
  seriesL3.value = cajas;
  cargado5.value = true;
  cargado6.value = false;
  cporu = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoLinea",
    [45, 46],
    props.maquina,
    routerStore().clienteID
  );
  seriesL2.value = cporu;
  cargado6.value = true;
  cargado7.value = false;
  totales = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [51, 52, 53, 54, 54, 56],
    props.maquina,
    routerStore().clienteID
  );
  let totalFruta = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [48],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < totales.length; index++) {
    const element = totales[index];
    let n = Math.max(0, element.registros[0].total);
    let d =
      totalFruta[0].registros[0].total > 0
        ? (n / (totalFruta[0].registros[0].total / 1000)).toLocaleString(
            "es-ES"
          )
        : 0;
    consumos.value.push({
      id: element.descripcion + index,
      nombre: element.descripcion,
      total: Math.max(0, element.registros[0].total).toLocaleString("es-ES"),
      totalFruta: d,
    });
  }
  consumos.value.push({
    id: consumos.value.length,
    nombre: totalFruta[0].nombreCorto,
    total: Math.max(0, totalFruta[0].registros[0].total / 1000).toLocaleString(
      "es-ES"
    ),
  });
  let horasMarcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "totalMarcha",
    [31, 40, 42],
    props.maquina,
    routerStore().clienteID
  );
  cargado7.value = true;
  cargado8.value = false;
  alarma = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "totalRangos",
    [40, 42],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < alarma.length; index++) {
    const element = alarma[index];
    alarmas.value.push({
      id: index,
      nombre: element.nombreCorto,
      name: Math.max(0, Math.round(element.registros.total1 / 60)),
    });
  }
  alarmas.value.push({
    id: consumos.value.length,
    nombre: "Marcha",
    name: Math.max(0, Math.round(horasMarcha.total / 60)),
  });
  cargado8.value = true;
  cargado.value = true;
});
onUnmounted(() => {
  series.value = [];
  series2.value = [];
  seriesL.value = [];
  seriesL2.value = [];
  seriesL3.value = [];
  seriesL4.value = [];
  consumos.value = [];
  alarmas.value = [];
});
async function toExcel() {
  let dosisA = [];
  const wb = utils.book_new();
  for (let index = 0; index < seriesL.value.length; index++) {
    const element = seriesL.value[index];
    dosisA = element.data.map((e) => {
      return {
        fecha: moment(e.x).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
        valor: e.y,
      };
    });
    let ws = utils.json_to_sheet(dosisA);
    let name = seriesL.value[index].name.replace("/", "-");
    utils.book_append_sheet(wb, ws, name);
  }
  let kilosA = [];
  kilosA = seriesL4.value[0].data.map((e) => {
    return {
      fecha: moment(e.x).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
      valor: e.y,
    };
  });
  let wsk = utils.json_to_sheet(kilosA);
  utils.book_append_sheet(wb, wsk, "Kilos");
  kilosA = seriesL4.value[1].data.map((e) => {
    return {
      fecha: moment(e.x).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
      valor: e.y,
    };
  });
  let ws = utils.json_to_sheet(kilosA);
  utils.book_append_sheet(wb, ws, "Kg-min");
  let alarmasA = alarmas.value;
  // const ws2 = utils.json_to_sheet(kilosA);
  // utils.book_append_sheet(wb, ws2, "Fruta");
  let consumosA = [];
  consumosA = consumos.value.map((e) => {
    return {
      nombre: e.nombre,
      total: e.total,
      totalPorToneladaFruta: e.totalPorToneladaFruta,
    };
  });
  const ws3 = utils.json_to_sheet(consumosA);
  utils.book_append_sheet(wb, ws3, "Consumos");
  alarmasA = alarmas.value.map((e) => {
    return {
      nombre: e.nombre,
      total: e.name,
    };
  });
  const ws4 = utils.json_to_sheet(alarmasA);
  utils.book_append_sheet(wb, ws4, "Alarmas");
  writeFileXLSX(wb, "DECCODOS" + inicio.value + "-" + fin.value + ".xlsx");
}
</script>
<style>
.vdpr-datepicker .selectdates {
  border: 1px solid #000;
  padding: 12px;
  width: 300px;
}
</style>
