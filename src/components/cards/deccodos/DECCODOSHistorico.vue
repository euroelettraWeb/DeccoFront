<template>
  <v-row no-gutters>
    <v-col>
      <v-card>
        <v-row>
          <v-col>
            <v-card-title> DECCODOS </v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col><v-btn @click="fechas">Fechas</v-btn></v-col>
          <v-col><v-btn @click="lotesMode">Lotes</v-btn></v-col>
        </v-row>
        <v-row v-if="cargadoLotesChoose">
          <v-col><v-btn @click="select('cliente')">Cliente</v-btn></v-col>
          <v-col><v-btn @click="select('Decco')">Decco</v-btn></v-col>
        </v-row>
        <v-row class="pl-8" no-gutters>
          <v-col v-if="cargadoFechas" cols="10"
            ><date-picker
              class="selectdates"
              apply-button-label="Use"
              :date-input="dateInput"
              :format="'DD MM YYYY HH:mm'"
              :same-date-format="sameDateFormat"
              @date-applied="historico"
              @on-reset="onReset"
          /></v-col>
          <v-col v-if="cargadoLotesSelect">
            <v-select :items="lotes" @click="lotesChoose"></v-select>
            <v-select
              v-if="mostrarAplicaciones"
              :items="aplicaciones"
              @click="lotesAplicaciones"
            ></v-select>
            <v-btn v-if="mostrarAplicaciones" @click="mostrarTodo">Todo</v-btn>
          </v-col>
          <v-col
            ><v-btn @click="print()"><v-icon>mdi-file-pdf-box</v-icon></v-btn
            ><v-btn @click="toExcel()"
              ><v-icon>mdi-microsoft-excel</v-icon></v-btn
            ></v-col
          >
        </v-row>
        <v-row>
          <v-col v-if="datoslotes">
            <h2>{{ loteActual }}</h2>
            <h3>{{ inicio }} {{ fin }}</h3>
          </v-col>
        </v-row>
        <v-row v-if="cargado" no-gutters>
          <v-col>
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
              v-if="cargado && cargadoFechas"
              :serie="series4"
              title="Lotes"
              :colores="['#00c853', '#d50000']"
              :tooltipy="true"
              :legend="true"
              :cargado="cargado10"
            />
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

const cargado = ref(false);
const cargado1 = ref(false);
const cargado2 = ref(false);
const cargado3 = ref(false);
const cargado4 = ref(false);
const cargado5 = ref(false);
const cargado6 = ref(false);
const cargado7 = ref(false);
const cargado8 = ref(false);
const cargado10 = ref(false);
const cargadoFechas = ref(false);
const cargadoLotesChoose = ref(false);
const cargadoLotesSelect = ref(false);
const mostrarAplicaciones = ref(false);
const datosLote = ref(false);

const series = ref([]);
const series2 = ref([]);
const series4 = ref([]);
const seriesL = ref([]);
const seriesL2 = ref([]);
const seriesL3 = ref([]);
const seriesL4 = ref([]);
const lotes = ref([]);
const aplicaciones = ref([]);

const consumos = ref([]);
const alarmas = ref([]);
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
const sameDateFormat = {
  from: "DD MM YYYY, HH:mm",
  to: "HH:mm",
};
const inicio = ref("");
const fin = ref("");
const loteActual = ref("");

const dateInput = {
  placeholder: "Seleccionar fechas",
  inputClass: "selectdates",
};

onMounted(async () => {
  cargado.value = false;
  await toDaily();
  cargado.value = true;
});
onUnmounted(() => {
  reset(null);
});
async function fechas() {
  //Quitamos lotes
  cargado.value = false;
  cargadoLotesChoose.value = false;
  cargadoLotesSelect.value = false;
  lotes.value = [];
  onReset();
  await toDaily();
  cargadoFechas.value = true;
  cargado.value = true;
}

function lotesMode() {
  //quitamos fechas y datos
  cargadoFechas.value = false;
  cargado.value = false;
  cargadoLotesChoose.value = true;
  onReset();
}

async function select(columna) {
  if (columna == "cliente") {
    const lot = await obtenerDatosVariableGeneral(
      "todo",
      "valores",
      "individual",
      "sinfiltro",
      null,
      props.maquina,
      routerStore().clienteID
    );
    //TODO obtener lista de lotes dependiendo del parametro
    lotes.value = lot;
  }
  if (columna == "Decco") {
    const lot = await obtenerDatosVariableGeneral(
      "todo",
      "valores",
      "individual",
      "sinfiltro",
      null,
      props.maquina,
      routerStore().clienteID
    );
    //TODO obtener lista de lotes dependiendo del parametro
    lotes.value = lot;
  }
  cargadoLotesSelect.value = true;
}
async function lotesChoose(value) {
  loteActual.value = value;
  let ap = await obtenerIncioFin(null, props.maquina, value);
  //TODO Cargar fechas
  //if 1 aplicacion
  if (ap.length != 2) {
    historico(ap[0], ap[1]);
    datosLote.value = true;
  } else {
    //if 2+ aplicacion
    // cargar listaAplicaciones
    aplicaciones.value = ap.map((r) => {
      return {
        id: r.x + r.z,
        name: r.x + " - " + r.y,
        value: { inicio: r.x, fin: r.y },
      };
    });
    mostrarAplicaciones.value = true;
  }
}
function lotesAplicaciones(aplicacion) {
  cargado.value = false;
  historico(aplicacion.value.incio, aplicacion.value.fin);
  datosLote.value = true;
  cargado.value = true;
}

async function mostrarTodo() {
  cargado.value = false;
  historicoVarios(aplicaciones);
  datosLote.value = true;
  cargado.value = true;
}

async function toDaily() {
  cargado1.value = false;
  // cargado10.value = false;
  // const lote = await obtenerDatosVariableGeneral(
  //   "historico",
  //   "registros",
  //   "individual",
  //   "formatoRangos",
  //   [57],
  //   props.maquina,
  //   routerStore().clienteID,
  //   inicio.value,
  //   fin.value
  // );
  // series4.value = lote;
  // cargado10.value = true;
  let estado = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [31],
    props.maquina,
    routerStore().clienteID
  );
  const autoManual = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [41, 43],
    props.maquina,
    routerStore().clienteID
  );
  estado[1].data.push(...autoManual[1].data);
  series.value = estado;
  cargado1.value = true;
  cargado2.value = false;
  const marcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    [31, 40, 42],
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
    [40, 42, 81],
    props.maquina,
    routerStore().clienteID
  );
  funcMaquina[1].data.forEach((element) => {
    element.fillColor =
      element.x === "Falta de consenso" ? "#3949ab" : "#fdd835";
    estado[1].data.push(element);
  });
  const cepillos = await obtenerDatosVariableGeneral(
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
  const dosis = await obtenerDatosVariableGeneral(
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
  let kilos = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoAcumuladores",
    [48],
    props.maquina,
    routerStore().clienteID
  );
  const kilosM = await obtenerDatosVariableGeneral(
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
  const cajas = await obtenerDatosVariableGeneral(
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
  const cporu = await obtenerDatosVariableGeneral(
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
  const totales = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [51, 52, 53, 54, 54, 56],
    props.maquina,
    routerStore().clienteID
  );
  const totalFruta = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [48],
    props.maquina,
    routerStore().clienteID
  );
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
  const horasMarcha = await obtenerDatosVariableGeneral(
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
  const alarma = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "totalRangos",
    [40, 42],
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
}

async function historico(date1, date2) {
  inicio.value = moment(date1).format("YYYY-MM-DDTHH:mm:ss");
  fin.value = moment(date2).format("YYYY-MM-DDTHH:mm:ss");
  reset([]);

  cargado.value = false;
  cargado1.value = false;
  cargado2.value = false;
  cargado3.value = false;
  cargado4.value = false;
  cargado5.value = false;
  cargado6.value = false;
  cargado7.value = false;
  cargado8.value = false;
  // cargado10.value = false;
  // const lote = await obtenerDatosVariableGeneral(
  //   "historico",
  //   "registros",
  //   "individual",
  //   "formatoRangos",
  //   [57],
  //   props.maquina,
  //   routerStore().clienteID,
  //   inicio.value,
  //   fin.value
  // );
  // series4.value = lote;
  // cargado10.value = true;
  let estado = await obtenerDatosVariableGeneral(
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
  const autoManual = await obtenerDatosVariableGeneral(
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
  estado[1].data.push(...autoManual[1].data);
  const marcha = await obtenerDatosVariableGeneral(
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
  estado[0].data.push(...marcha[0].data);
  estado[1].data.push(...marcha[1].data);
  const funcMaquina = await obtenerDatosVariableGeneral(
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
  funcMaquina[1].data.forEach((element) => {
    element.fillColor =
      element.x === "Falta de consenso" ? "#3949ab" : "#fdd835";
    estado[1].data.push(element);
  });
  series.value = estado;
  cargado1.value = true;
  const cepillos = await obtenerDatosVariableGeneral(
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
  const dosis = await obtenerDatosVariableGeneral(
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
  let kilos = await obtenerDatosVariableGeneral(
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
  const kilosM = await obtenerDatosVariableGeneral(
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
  const totalFruta = await obtenerDatosVariableGeneral(
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
  const marchat = await obtenerDatosVariableGeneral(
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
  const alarma = await obtenerDatosVariableGeneral(
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

async function historicoVarios(dates) {
  inicio.value = moment(dates[0].value.inicio).format("YYYY-MM-DDTHH:mm:ss");
  fin.value = moment(dates[dates.length - 1].value.fin).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  reset([]);
  tiempos.value[0].name = 0;
  tiempos.value[1].name = 0;

  cargado.value = false;
  cargado1.value = false;
  cargado2.value = false;
  cargado3.value = false;
  cargado4.value = false;
  cargado5.value = false;
  cargado6.value = false;
  cargado7.value = false;
  cargado8.value = false;
  cargado10.value = false;
  for (let index = 0; index < dates.length; index++) {
    const inicioE = dates[index].value.inicio;
    const finE = dates[index].value.fin;
    const lote = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoRangos",
      [57],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    series4.value = lote;

    let estado = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoRangos",
      [31],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    const autoManual = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoRangos",
      [41, 43],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    estado[1].data.push(...autoManual[1].data);
    const marcha = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "multiple",
      "marchaFormatoRangos",
      [31, 40, 42],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    estado[0].data.push(...marcha[0].data);
    estado[1].data.push(...marcha[1].data);
    const funcMaquina = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoRangos",
      [40, 42, 81],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    funcMaquina[1].data.forEach((element) => {
      element.fillColor =
        element.x === "Falta de consenso" ? "#3949ab" : "#fdd835";
      estado[1].data.push(element);
    });
    if (series.value !== 0) {
      series.value[0].push(...estado[0].data);
      series.value[1].push(...estado[1].data);
    } else series.value = estado;
    const cepillos = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoRangos",
      [44],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    if (series2.value !== 0) {
      series2.value[0].data.push(...cepillos[0].data);
      series2.value[1].data.push(...cepillos[1].data);
    } else series2.value = cepillos;
    const dosis = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoLinea",
      [32, 33, 34, 35, 36, 37, 38, 39],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    if (seriesL.value !== 0) {
      for (let i = 0; i < seriesL.value.length; i++) {
        seriesL.value[i].data.push(null, ...dosis[i].data);
      }
    } else seriesL.value = dosis;
    let kilos = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoAcumuladores",
      [48],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    const kilosM = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "unidadTiempo",
      [48],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE,
      "Kg/min"
    );
    if (seriesL4.value !== 0) {
      seriesL4.value[1].data.push(null, ...kilosM[0].data);
      seriesL4.value[0].data.push(null, ...kilos[0].data);
    } else {
      kilos.push(...kilosM);
      seriesL4.value = kilos;
    }
    const cajas = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "unidadTiempo",
      [47],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE,
      "Cajas/Min"
    );
    if (seriesL3.value !== 0)
      seriesL3.value[0].data.push(null, ...cajas[0].data);
    else seriesL3.value = cajas;
    const cporu = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoLinea",
      [45, 46],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    if (seriesL2.value !== 0) {
      for (let i = 0; i < seriesL2.value.length; i++) {
        seriesL2.value[i].data.push(null, ...cporu[i].data);
      }
    } else seriesL2.value = cporu;
    const totales = await obtenerDatosVariableGeneral(
      "historico",
      "totales",
      "individual",
      "sinfiltro",
      [51, 52, 53, 54, 55, 56],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    const totalFruta = await obtenerDatosVariableGeneral(
      "historico",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
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

    if (consumos.value !== 0) {
      let cons = [...consumosValue, totalFrutaConsumo];
      for (let j = 0; j < consumos.value.length; j++) {
        const object = consumos.value[index];
        const update = cons.find((obj) => obj.id === object.id);
        if (update) {
          object.total += update.total;
          if (object.totalPorToneladaFruta)
            object.totalPorToneladaFruta += update;
        }
      }
    } else consumos.value = [...consumosValue, totalFrutaConsumo];
    const marchat = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "multiple",
      "totalMarcha",
      [31, 40, 42],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    const alarma = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "totalRangos",
      [40, 42],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    const alarmaValue = alarma.map((element, index) => {
      const val = Math.max(0, Math.round(element.registros.total1 / 60));
      return {
        id: element.nombreCorto + index,
        nombre: element.nombreCorto,
        name: val,
      };
    });
    if (alarmas.value.length !== 0) {
      for (let j = 0; j < alarmas.value.length; j++) {
        const object = alarmas.value[j];
        const update = alarmaValue.find((obj) => obj.id === object.id);
        if (update) {
          object.name += update.name;
        }
      }
    } else {
      alarmas.value = alarmaValue;
    }
    tiempos.value[0].name += alarmaValue.reduce(
      (total, element) => total + element.name,
      0
    );
    tiempos.value[1].name += Math.max(0, Math.round(marchat.total / 60));
  }
  cargado.value = true;
  cargado1.value = true;
  cargado2.value = true;
  cargado3.value = true;
  cargado4.value = true;
  cargado5.value = true;
  cargado6.value = true;
  cargado7.value = true;
  cargado8.value = true;
  cargado10.value = true;
}

function reset(value) {
  series.value = value;
  series2.value = value;
  seriesL.value = value;
  seriesL2.value = value;
  seriesL3.value = value;
  seriesL4.value = value;
  consumos.value = value;
  alarmas.value = value;
}

function onReset() {
  inicio.value = "";
  fin.value = "";
}

async function toExcel() {
  const wb = utils.book_new();
  seriesL.value.forEach((element) => {
    const dosisA = element.data.map((e) => ({
      fecha: moment(e.x).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
      valor: e.y,
    }));
    const ws = utils.json_to_sheet(dosisA);
    const name = element.name.replace("/", "-");
    utils.book_append_sheet(wb, ws, name);
  });
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
  const tiemposA = tiempos.value.map((e) => {
    return {
      nombre: e.nombre,
      total: e.name,
    };
  });
  const ws5 = utils.json_to_sheet(tiemposA);
  utils.book_append_sheet(wb, ws5, "Funcionamiento");
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
