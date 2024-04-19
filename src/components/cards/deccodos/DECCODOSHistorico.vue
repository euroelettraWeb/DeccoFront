<template>
  <v-card>
    <v-card-title>DECCODOS</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-btn
            :color="cargadoFechas ? 'blue' : 'gainsboro'"
            class="mr-2"
            :disabled="cargadoFechas"
            @click="fechas"
          >
            Fechas
          </v-btn>
          <v-btn
            :color="cargadoLotesChoose ? 'blue' : 'gainsboro'"
            class="ml-2"
            :disabled="cargadoLotesChoose"
            @click="lotesMode"
          >
            Lotes
          </v-btn>
        </v-col>
        <v-col v-if="cargadoLotesChoose" cols="6">
          <v-btn
            :color="modoConsultaLotes === 'cliente' ? 'blue' : 'gainsboro'"
            class="mr-2"
            @click="select('cliente')"
          >
            Cliente
          </v-btn>
          <v-btn
            :color="modoConsultaLotes === 'decco' ? 'blue' : 'gainsboro'"
            class="ml-2"
            @click="select('decco')"
          >
            Decco
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="modoConsultaLotes">
        <v-col>
          <div class="text-subtitle">Lote seleccionado</div>
          <v-select
            v-if="cargadoLotesSelect"
            v-model="loteActual"
            label="Seleccionar lote"
            :items="lotes"
            hide-details
            hide-selected
            item-text="lote"
            item-value="id"
            dense
            solo
            @change="lotesChoose"
          />
        </v-col>
        <v-col>
          <div class="text-subtitle">Tramo de aplicación</div>
          <v-select
            v-if="mostrarAplicaciones"
            v-model="aplicacionActual"
            label="Elegir tramo de aplicación del lote seleccionado"
            :items="aplicaciones"
            hide-details
            hide-selected
            item-text="name"
            item-value="id"
            dense
            solo
            return-object
            @change="lotesAplicaciones"
          />
          <!-- <v-btn v-if="mostrarAplicaciones" @click="mostrarTodo">Todo</v-btn> -->
        </v-col>
      </v-row>
      <v-row v-if="cargadoFechas">
        <v-col cols="6">
          <date-picker
            class="selectdates"
            language="es"
            apply-button-label="Consultar"
            switch-button-label="Dia y hora"
            :date-input="dateInput"
            :format="'DD/MM/YYYY HH:mm'"
            :same-date-format="sameDateFormat"
            :is-monday-first="true"
            :switch-button-initial="true"
            :calendar-time-input="{ readonly: true, step: 1 }"
            :calendar-date-input="calendarDateInput"
            :disabled-dates="{ from: new Date() }"
            @date-applied="periodoSeleccionado"
            @on-reset="onReset"
          />
        </v-col>
        <v-col v-if="cargado" cols="6" class="text-right">
          <v-btn color="red" class="mr-2" @click="print()">
            <v-icon>mdi-file-pdf-box</v-icon>
            PDF
          </v-btn>
          <v-btn color="green" @click="toExcel()">
            <v-icon>mdi-microsoft-excel</v-icon>
            EXCEL
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="cargado">
        <v-col v-if="cargadoConsumos" cols="6">
          <v-card>
            <v-card-title>Consumos</v-card-title>
            <v-card-text>
              <v-simple-table dense>
                <template #default>
                  <thead>
                    <tr>
                      <th></th>
                      <th class="text-right">Litros</th>
                      <th class="text-right">Litros/Tonelada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in consumos" :key="item.id">
                      <td>
                        {{ item.nombre }}
                      </td>
                      <td class="text-right">
                        {{ item.total }}
                      </td>
                      <td class="text-right">
                        {{ item.totalPorToneladaFruta }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-if="cargadoAlarmas" cols="6">
          <v-card>
            <v-card-title>Alarmas (min)</v-card-title>
            <v-card-text>
              <v-simple-table dense>
                <template #default>
                  <tbody>
                    <tr v-for="alarmaItem in alarmas" :key="alarmaItem.id">
                      <td>{{ alarmaItem.nombre }}</td>
                      <td class="text-right">
                        {{ alarmaItem.name }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-title>Tiempo de funcionamiento (min)</v-card-title>
            <v-card-text>
              <v-simple-table dense>
                <template #default>
                  <tbody>
                    <tr v-for="tiempoItem in tiempos" :key="tiempoItem.id">
                      <td>{{ tiempoItem.nombre }}</td>
                      <td class="text-right">
                        {{ tiempoItem.name }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <GraficoEstadoCardGen
            :serie="seriesLotes"
            title="Lotes"
            :colores="[]"
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
              'Alarma',
              'Presencia Fruta',
            ]"
            :tooltipy="false"
            :legend="false"
            :cargado="cargadoEstado"
          />

          <GraficoEstadoCardGen
            :serie="seriesUsuario"
            :height="190"
            title="Usuarios"
            :colores="[]"
            :tooltipy="true"
            :legend="false"
            :cargado="cargadoUsuario"
          />

          <GraficoLineaCardGen
            :serie="seriesDosis"
            title="Dosis"
            :cargado="cargadoDosis"
          />
          <KilosCalibradorHistorico
            :serie="seriesFruta"
            :alarmas="alarmasCalibrador"
            title="Fruta procesada"
            :cargado="cargadoFruta"
          />
          <GraficoEstadoCardGen
            :serie="seriesCepillos"
            title="Limpieza de cepillos"
            :height="200"
            :tooltipy="true"
            :legend="true"
            :categories="['Limpieza Cepillos']"
            :cargado="cargadoCepillos"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="cargado === false">
      <v-row>
        <v-col class="d-flex justify-center align-center py-5">
          <v-progress-circular
            :size="100"
            :width="7"
            color="purple"
            indeterminate
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
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
import {
  obtenerDatosVariableGeneral,
  obtenerIncioFin,
  leerParametrosCalibrador,
  // leerAlarmasCalibrador,
} from "../../../helpers/bd";
import { ref, computed, onUnmounted } from "vue";
import { routerStore } from "../../../stores/index";
import moment from "moment";
import DatePicker from "vue-time-date-range-picker/dist/vdprDatePicker";
import GraficoEstadoCardGen from "../comun/GraficoEstadoCardGen.vue";
import GraficoLineaCardGen from "../comun/GraficoLineaCardGen.vue";
// import FrutaProcesadaHistorico from "../comun/FrutaProcesadaHistorico.vue";
import KilosCalibradorHistorico from "../comun/KilosCalibradorHistorico.vue";

const props = defineProps({
  linea: { type: Number, default: 1 },
  maquina: { type: Number, default: 1 },
});

const cargado = ref(null);
const cargadoEstado = ref(false);
const cargadoCepillos = ref(false);
const cargadoDosis = ref(false);
const cargadoFruta = ref(false);
const cargadoCajas = ref(false);
const cargadoCajasMin = ref(false);
const cargadoConsumos = ref(false);
const cargadoAlarmas = ref(false);
const cargadoLotes = ref(false);
const cargadoUsuario = ref(false);
const cargadoFechas = ref(false);
const cargadoLotesChoose = ref(false);
const modoConsultaLotes = ref(null);
const cargadoLotesSelect = ref(false);
const mostrarAplicaciones = ref(false);
const datosLote = ref(false);

const seriesEstado = ref([]);
const seriesCepillos = ref([]);
const seriesLotes = ref([]);
const seriesUsuario = ref([]);
const seriesDosis = ref([]);
const seriesCajas = ref([]);
const seriesCajasMin = ref([]);
const seriesFruta = ref([]);
const alarmasCalibrador = ref([]);
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

const inicio = ref(null);
const fin = ref(null);

const loteActual = ref(null);
const aplicacionActual = ref(null);

const sameDateFormat = {
  from: "DD/MM/YYYY, HH:mm",
  to: "HH:mm",
};

const calendarDateInput = {
  labelStarts: "Inicio",
  labelEnds: "Fin",
  format: "DD/MM/YYYY",
};

const periodoSeleccionado = (date1, date2) => {
  let inicio = new Date(
    date1.setHours(date1.getHours() + date1.getTimezoneOffset() / 60)
  )
    .toISOString()
    .slice(0, -1);
  let fin = new Date(
    date2.setHours(date2.getHours() + date2.getTimezoneOffset() / 60)
  )
    .toISOString()
    .slice(0, -1);
  date1 = new Date(
    date1.setHours(date1.getHours() - date1.getTimezoneOffset() / 60)
  )
    .toISOString()
    .slice(0, -1);
  date2 = new Date(
    date2.setHours(date2.getHours() - date2.getTimezoneOffset() / 60)
  )
    .toISOString()
    .slice(0, -1);
  historico(inicio, fin);
};

const dateInput = {
  placeholder: "Seleccionar fechas",
  inputClass: "selectdates",
};

const fechaDefault = (modo) => {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
  const dia = fechaActual.getDate().toString().padStart(2, "0");
  const horas = fechaActual.getHours().toString().padStart(2, "0");
  const minutos = fechaActual.getMinutes().toString().padStart(2, "0");
  const segundos = fechaActual.getSeconds().toString().padStart(2, "0");
  switch (modo) {
    case "inicio":
      return `${año}-${mes}-${dia}T00:00:00`;
    case "fin":
      return `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
  }
};

const calcularAltura = computed(() => {
  return (
    150 +
    seriesLotes.value[0].data
      .map((item) => item.x)
      .filter((valor, index, self) => self.indexOf(valor) === index).length *
      30
  );
});

async function fechas() {
  cargadoLotesChoose.value = false;
  cargadoLotesSelect.value = false;
  modoConsultaLotes.value = null;
  lotes.value = null;
  datosLote.value = false;
  cargadoFechas.value = true;
  onReset();
  await historico();
}

function lotesMode() {
  cargado.value = null;
  cargadoFechas.value = false;
  modoConsultaLotes.value = null;
  cargadoLotesChoose.value = true;
  onReset();
}

async function select(columna) {
  cargado.value = null;
  mostrarAplicaciones.value = false;
  aplicacionActual.value = null;
  aplicaciones.value = null;
  cargadoLotesSelect.value = true;
  loteActual.value = false;
  modoConsultaLotes.value = columna;
  if (columna == "cliente") {
    const lot = await obtenerDatosVariableGeneral(
      "todo",
      "valores",
      "individual",
      "sinfiltro",
      [95],
      props.maquina,
      routerStore().clienteID
    );
    lotes.value = lot[0].registros.map((r) => {
      return {
        id: `LC_${r.loteCliente}`,
        lote: `Lote Fruta: ${r.loteCliente}`,
      };
    });
  }
  if (columna == "decco") {
    const lotCeraAp2D = await obtenerDatosVariableGeneral(
      "todo",
      "valores",
      "individual",
      "sinfiltro",
      [96],
      props.maquina,
      routerStore().clienteID
    );
    const lotCeraAp3D = await obtenerDatosVariableGeneral(
      "todo",
      "valores",
      "individual",
      "sinfiltro",
      [97],
      props.maquina,
      routerStore().clienteID
    );
    lotes.value = [
      ...lotCeraAp2D[0].registros.map((r) => {
        return {
          id: `LC2D_${r.loteDeccoAplicador2Discos}`,
          lote: `Lote Cera (2 Discos): ${r.loteDeccoAplicador2Discos}`,
        };
      }),
      ...lotCeraAp3D[0].registros.map((r) => {
        return {
          id: `LC3D_${r.loteDeccoAplicador3Discos}`,
          lote: `Lote Cera (3 Discos): ${r.loteDeccoAplicador3Discos}`,
        };
      }),
    ];
  }
  cargadoLotesSelect.value = true;
}

async function lotesChoose(value) {
  aplicacionActual.value = null;
  let modeloID = null;
  switch (value.split("_")[0]) {
    case "LC":
      modeloID = 95;
      break;
    case "LC2D":
      modeloID = 96;
      break;
    case "LC3D":
      modeloID = 97;
      break;
  }
  let ap = await obtenerIncioFin(modeloID, props.maquina, value.split("_")[1]);
  aplicaciones.value = ap;
  mostrarAplicaciones.value = true;
}

async function lotesAplicaciones(aplicacion) {
  await historico(aplicacion.x, aplicacion.y);
  datosLote.value = true;
}

async function historico(date1, date2) {
  reset([]);
  inicio.value = date1 ? date1 : fechaDefault("inicio");
  fin.value = date2 ? date2 : fechaDefault("fin");

  cargado.value = false;
  cargadoEstado.value = false;
  cargadoCepillos.value = false;
  cargadoDosis.value = false;
  cargadoFruta.value = false;
  cargadoCajas.value = false;
  cargadoCajasMin.value = false;
  cargadoConsumos.value = false;
  cargadoAlarmas.value = false;
  cargadoLotes.value = false;

  let lotesCliente = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLotesCliente",
    [95],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  let lotesCeraAp2D = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "multiple",
    "formatoLotesCera",
    [96, 82],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  let lotesCeraAp3D = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "multiple",
    "formatoLotesCera",
    [97, 83],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesLotes.value = [
    {
      name: "Lotes DeccoDos",
      data: [...lotesCliente, ...lotesCeraAp2D, ...lotesCeraAp3D],
    },
  ];
  cargadoLotes.value = true;

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
      element.x === "Falta de consenso" ? "#d50000" : "#00c853";
    estado[1].data.push(element);
  });
  funcMaquina[0].data.forEach((element) => {
    element.fillColor =
      element.x === "Falta de consenso" ? "#00c853" : "#00c853";
    estado[0].data.push(element);
  });
  seriesEstado.value = estado;
  cargadoEstado.value = true;
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
  seriesCepillos.value = cepillos;
  cargadoCepillos.value = true;

  const usuario = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoUsuarios",
    [107],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesUsuario.value = [
    {
      name: "Usuarios",
      data: usuario,
    },
  ];
  cargadoUsuario.value = true;

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
  seriesDosis.value = dosis;
  cargadoDosis.value = true;
  // let kilos = await obtenerDatosVariableGeneral(
  //   "historico",
  //   "registros",
  //   "individual",
  //   "formatoAcumuladores",
  //   [48],
  //   props.maquina,
  //   routerStore().clienteID,
  //   inicio.value,
  //   fin.value
  // );
  let parametrosCalibrador = (
    await leerParametrosCalibrador(
      routerStore().clienteID,
      props.linea,
      inicio.value,
      fin.value
    )
  ).datos;

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

  let variable2 = [
    {
      data: [],
      name: "Variable2",
    },
  ];

  let indiceParametro = 0;
  let kilosVisualizar = [{ data: [], name: null }];
  for (let punto = 0; punto < kilosM[0].data.length; punto += 3) {
    kilosVisualizar[0].data.push(kilosM[0].data[punto]);
    if (
      parametrosCalibrador[indiceParametro + 1] &&
      parametrosCalibrador[indiceParametro + 1].fecha < kilosM[0].data[punto].x
    ) {
      indiceParametro++;
    }
    variable2[0].data.push({
      x: kilosM[0].data[punto].x,
      y: 0,
    });
  }
  kilosVisualizar[0].name = kilosM[0].name;
  // kilos.push(...kilosM);
  seriesFruta.value = [...kilosVisualizar, ...variable2];
  // alarmasCalibrador.value = await leerAlarmasCalibrador(
  //   routerStore().clienteID,
  //   props.linea,
  //   inicio.value,
  //   fin.value
  // );
  cargadoFruta.value = true;

  const cajas = await obtenerDatosVariableGeneral(
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
  seriesCajasMin.value = cajas;
  cargadoCajas.value = true;
  const cporu = await obtenerDatosVariableGeneral(
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
  seriesCajas.value = cporu;
  cargadoCajasMin.value = true;
  const totales = await obtenerDatosVariableGeneral(
    "historico",
    "totales",
    "individual",
    "sinfiltro",
    [49, 50, 51, 52, 53, 54, 55, 56],
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
  cargadoConsumos.value = true;
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
  cargadoAlarmas.value = true;
  cargado.value = true;
}

function reset(value) {
  seriesEstado.value = value;
  seriesCepillos.value = value;
  seriesDosis.value = value;
  seriesUsuario.value = value;
  seriesCajas.value = value;
  seriesCajasMin.value = value;
  seriesFruta.value = value;
  consumos.value = value;
  alarmas.value = value;
}

function onReset() {
  inicio.value = null;
  fin.value = null;
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
  writeFileXLSX(wb, "DECCODOS" + inicio.value + "-" + fin.value + ".xlsx");
}

onUnmounted(() => {
  reset(null);
  lotes.value = null;
});
</script>

<style>
.vdpr-datepicker .selectdates {
  border: 1px solid #000;
  padding: 12px;
  width: 300px;
}

@media only screen and (max-width: 900px) {
  .vdpr-datepicker__calendar {
    width: 200px;
  }

  .vdpr-datepicker__calendar-actions {
    width: 120px;
  }
}
</style>
