<template>
  <v-row no-gutters>
    <v-col>
      <v-card>
        <v-row no-gutters>
          <v-col>
            <v-card-title> DECCODAF </v-card-title>
          </v-col>
        </v-row>
        <v-row class="mb-2">
          <v-col><v-btn @click="fechas">Fechas</v-btn></v-col>
          <v-col><v-btn @click="lotesMode">Lotes</v-btn></v-col>
        </v-row>
        <v-row v-if="cargadoLotesChoose" class="mb-2">
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
          <v-col v-if="datosLote">
            <h2>{{ loteActual }}</h2>
            <h3>{{ inicio }} {{ fin }}</h3>
          </v-col>
        </v-row>
        <v-row v-if="cargado" no-gutters>
          <v-col>
            <v-row>
              <v-col v-if="cargadoConsumos">
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
              <v-col v-if="cargadoAlarmas">
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
              :serie="seriesLotes"
              title="Lotes"
              :colores="['#00c853', '#d50000']"
              :tooltipy="true"
              :legend="true"
              :cargado="cargadoLotes"
            />
            <GraficoEstadoCardGen
              :serie="seriesEstado"
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
              :cargado="cargadoEstado"
            />
            <GraficoEstadoCardGen
              :serie="seriesAlarmas"
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
              :cargado="cargadoAlarmasG"
            />
            <GraficoLineaCardGen
              :serie="seriesDosis"
              title="Dosis"
              :cargado="cargadoDosis"
            />
            <FrutaProcesadaHistorico
              v-if="deccodos"
              :serie="seriesFruta"
              title="Kilos"
              :cargado="cargadoFruta"
            />
            <GraficoEstadoCardGen
              :serie="seriesNiveles"
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
              :cargado="cargadoNiveles"
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
  obtenerIncioFin,
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

const cargado = ref(false);
const cargadoEstado = ref(false);
const cargadoAlarmasG = ref(false);
const cargadoDosis = ref(false);
const cargadoFruta = ref(false);
const cargadoConsumos = ref(false);
const cargadoAlarmas = ref(false);
const cargadoNiveles = ref(false);
const cargadoLotes = ref(false);
const cargadoFechas = ref(false);
const cargadoLotesChoose = ref(false);
const cargadoLotesSelect = ref(false);
const mostrarAplicaciones = ref(false);
const datosLote = ref(false);

const seriesEstado = ref([]);
const seriesAlarmas = ref([]);
const seriesNiveles = ref([]);
const seriesLotes = ref([]);
const seriesDosis = ref([]);
const seriesFruta = ref([]);
const lotes = ref([]);
const aplicaciones = ref([]);

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
const loteActual = ref("");

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
        range: { inicio: r.x, fin: r.y },
      };
    });
    mostrarAplicaciones.value = true;
  }
}
function lotesAplicaciones(aplicacion) {
  cargado.value = false;
  historico(aplicacion.range.incio, aplicacion.range.fin);
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
  cargadoEstado.value = false;
  const maquina = await obtenerMaquina("lineaTipo", props.linea, 2);
  deccodos.value = maquina[0].id;
  // cargadoLotes.value = false;
  // const lote = await obtenerDatosVariableGeneral(
  //   "24H",
  //   "registros",
  //   "individual",
  //   "formatoRangos",
  //   [57],
  //   props.maquina,
  //   routerStore().clienteID
  // );
  // seriesLotes.value = lote;
  // cargadoLotes.value = true;
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
  seriesEstado.value = estado;
  cargadoEstado.value = true;
  cargadoAlarmasG.value = false;
  const alarmasR = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [12, 73, 74, 75],
    props.maquina,
    routerStore().clienteID
  );
  seriesAlarmas.value = alarmasR;
  cargadoAlarmasG.value = true;
  cargadoNiveles.value = false;
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
  seriesNiveles.value = otros;
  cargadoNiveles.value = true;
  cargadoDosis.value = false;
  const dosis = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoLinea",
    [7, 8, 9, 10, 11],
    props.maquina,
    routerStore().clienteID
  );
  seriesDosis.value = dosis;
  cargadoDosis.value = true;
  cargadoConsumos.value = false;
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
    cargadoFruta.value = false;
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
    seriesFruta.value = kilos;
    cargadoFruta.value = true;
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
  } else {
    const consumosValue = totales.map((element, index) => ({
      id: element.descripcion + index,
      nombre: element.descripcion,
      total: Math.max(0, element.registros[0].total).toLocaleString("es-ES"),
    }));
    consumos.value = [...consumosValue];
  }
  cargadoConsumos.value = true;
  cargadoAlarmas.value = false;
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
  cargadoAlarmas.value = true;
}

async function historico(date1, date2) {
  inicio.value = moment(date1).format("YYYY-MM-DDTHH:mm:ss");
  fin.value = moment(date2).format("YYYY-MM-DDTHH:mm:ss");
  reset([]);

  cargado.value = false;
  cargadoEstado.value = false;
  cargadoAlarmasG.value = false;
  cargadoDosis.value = false;
  cargadoFruta.value = false;
  cargadoConsumos.value = false;
  cargadoAlarmas.value = false;
  cargadoNiveles.value = false;
  // cargadoLotes.value = false;
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
  // seriesLotes.value = lote;
  // cargadoLotes.value = true;
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
  seriesEstado.value = estado;
  cargadoEstado.value = true;
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
  seriesAlarmas.value = alarmasR;
  cargadoAlarmasG.value = true;
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
  seriesNiveles.value = otros;
  cargadoNiveles.value = true;
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
  seriesDosis.value = dosis;
  cargadoDosis.value = true;
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
    seriesFruta.value = kilos;
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
    cargadoFruta.value = true;
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
  cargadoConsumos.value = true;
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
  cargadoAlarmas.value = true;
  cargado.value = true;
}

async function historicoVarios(dates) {
  inicio.value = moment(dates[0].range.inicio).format("YYYY-MM-DDTHH:mm:ss");
  fin.value = moment(dates[dates.length - 1].range.fin).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  reset([]);
  tiempos.value[0].name = 0;
  tiempos.value[1].name = 0;
  cargado.value = false;
  cargadoEstado.value = false;
  cargadoAlarmasG.value = false;
  cargadoDosis.value = false;
  cargadoFruta.value = false;
  cargadoConsumos.value = false;
  cargadoAlarmas.value = false;
  cargadoNiveles.value = false;
  cargadoLotes.value = false;
  for (let index = 0; index < dates.length; index++) {
    const inicioE = dates[index].range.inicio;
    const finE = dates[index].range.fin;
    // const lote = await obtenerDatosVariableGeneral(
    //   "historico",
    //   "registros",
    //   "individual",
    //   "formatoRangos",
    //   [57],
    //   props.maquina,
    //   routerStore().clienteID,
    //   inicioE,
    //   finE
    // );
    // seriesLotes.value = lote;
    let estado = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoRangos",
      [1],
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
      [13, 15],
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
      [1, 12, 14, 73, 74, 75],
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
      [12],
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
    seriesEstado.value = estado;
    const alarmasR = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoRangos",
      [12, 73, 74, 75],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    seriesAlarmas.value = alarmasR;
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
    seriesNiveles.value = otros;
    const dosis = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoLinea",
      [7, 8, 9, 10, 11],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
    );
    seriesDosis.value = dosis;
    const totales = await obtenerDatosVariableGeneral(
      "historico",
      "totales",
      "individual",
      "sinfiltro",
      [25, 26, 27, 28, 29, 30],
      props.maquina,
      routerStore().clienteID,
      inicioE,
      finE
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
        inicioE,
        finE
      );
      let kilos = await obtenerDatosVariableGeneral(
        "historico",
        "registros",
        "individual",
        "formatoAcumuladores",
        [48],
        deccodos.value,
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
        deccodos.value,
        routerStore().clienteID,
        inicioE,
        finE,
        "Kg/min"
      );
      if (seriesFruta.value !== 0) {
        seriesFruta.value[1].data.push(null, ...kilosM[0].data);
        seriesFruta.value[0].data.push(null, ...kilos[0].data);
      } else {
        kilos.push(...kilosM);
        seriesFruta.value = kilos;
      }
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
        total: (totalFruta[0].registros[0].total / 1000).toLocaleString(
          "es-ES"
        ),
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
    } else {
      const consumosValue = totales.map((element, index) => ({
        id: element.descripcion + index,
        nombre: element.descripcion,
        total: Math.max(0, element.registros[0].total).toLocaleString("es-ES"),
      }));
      if (consumos.value !== 0) {
        for (let j = 0; j < consumos.value.length; j++) {
          const object = consumos.value[j];
          const update = cons.find((obj) => obj.id === object.id);
          if (update) {
            object.total += update.total;
          }
        }
      } else consumos.value = consumosValue;
    }
    const marchat = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "multiple",
      "totalMarcha",
      [1, 12, 14, 73, 74, 75],
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
      [12, 14, 73, 74, 75],
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
    tiempos.value[1].name = Math.max(0, Math.round(marchat.total / 60));
  }
  cargado.value = true;
  cargadoEstado.value = true;
  cargadoAlarmasG.value = true;
  cargadoDosis.value = true;
  cargadoFruta.value = true;
  cargadoConsumos.value = true;
  cargadoAlarmas.value = true;
  cargadoNiveles.value = true;
  cargadoLotes.value = true;
}

function reset(value) {
  seriesEstado.value = value;
  seriesDosis.value = value;
  seriesFruta.value = value;
  consumos.value = value;
  alarmas.value = value;
}

function onReset() {
  inicio.value = "";
  fin.value = "";
}

async function toExcel() {
  const wb = utils.book_new();
  seriesDosis.value.forEach((element) => {
    const dosisA = element.data.map((e) => ({
      fecha: moment(e.x).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
      valor: e.y,
    }));
    const ws = utils.json_to_sheet(dosisA);
    const name = element.name.replace("/", "-");
    utils.book_append_sheet(wb, ws, name);
  });
  const kilosA = seriesFruta.value[0].data.map((e) => {
    return {
      fecha: moment(e.x).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
      valor: e.y,
    };
  });
  const wsk = utils.json_to_sheet(kilosA);
  utils.book_append_sheet(wb, wsk, "Kilos");
  kilosA = seriesFruta.value[1].data.map((e) => {
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
