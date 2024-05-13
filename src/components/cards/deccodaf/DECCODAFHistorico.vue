<template>
  <v-card>
    <v-card-title>DECCODAF</v-card-title>
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
            @date-applied="historico"
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
                    <tr v-for="item of consumos" :key="item.id">
                      <td>
                        {{ item.nombre }}
                      </td>
                      <td class="text-right">
                        {{ item.total }}
                      </td>
                      <td v-if="deccodos" class="text-right">
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
                    <tr v-for="alarmaItem of alarmas" :key="alarmaItem.id">
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
          <GraficoConsumoPorMeses
            :serie="totalesConsumo"
            title="Consumo"
            :rangos-fechas="rangoFechas"
            :cargado="cargadoConsumos"
          />
          <GraficoEstadoCardGen
            :serie="seriesLotes"
            :height="calcularAltura"
            title="Lotes"
            :colores="[]"
            :tooltipy="true"
            :legend="false"
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
            :colores="['#00c853', '#d50000']"
            :categories="[
              'Fallo Agua',
              'Termico Agitador',
              'Tope Palets Alcanzado',
              'No hay presión aire',
            ]"
            :tooltipy="false"
            :legend="false"
            :cargado="cargadoAlarmasG"
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

          <GraficaReposiciones
            :series="seriesReposiciones"
            :height="400"
            :cargado="cargadoReposiciones"
            title="Reposiciones"
          />

          <GraficoLineaCardGen
            :serie="seriesDosis"
            title="Dosis"
            :cargado="cargadoDosis"
          />
          <KilosCalibradorHistorico
            v-if="deccodos"
            :serie="seriesFruta"
            :alarmas="alarmasCalibrador"
            title="Fruta procesada"
            :cargado="cargadoFruta"
          />
          <GraficoEstadoCardGen
            :serie="seriesNiveles"
            title="Estado de los niveles de las garrafas"
            :tooltipy="true"
            :legend="true"
            :categories="[
              'Nivel Garrafa P1',
              'Nivel Garrafa P2',
              'Nivel Garrafa P3',
              'Nivel Garrafa P4',
              'Nivel Garrafa P5',
              // 'Flujo de producto P1',
              // 'Flujo de producto P2',
              // 'Flujo de producto P3',
              // 'Flujo de producto P4',
              // 'Flujo de producto P5',
            ]"
            :cargado="cargadoNiveles"
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
  leerParametrosCalibrador,
  // leerAlarmasCalibrador,
} from "../../../helpers/bd";
import { ref, computed, onMounted } from "vue";
import { routerStore } from "../../../stores/index";
import moment from "moment";
import DatePicker from "vue-time-date-range-picker/dist/vdprDatePicker";
import GraficoEstadoCardGen from "../comun/GraficoEstadoCardGen.vue";
import GraficaReposiciones from "../comun/GraficaReposiciones.vue";
import GraficoLineaCardGen from "../comun/GraficoLineaCardGen.vue";
import GraficoConsumoPorMeses from "../comun/GraficaConsumoPorMeses.vue";
// import FrutaProcesadaHistorico from "../comun/FrutaProcesadaHistorico.vue";
import KilosCalibradorHistorico from "../comun/KilosCalibradorHistorico.vue";

const props = defineProps({
  linea: { type: Number, default: 1 },
  maquina: { type: Number, default: 1 },
});

const cargado = ref(null);
const cargadoEstado = ref(false);
const cargadoAlarmasG = ref(false);
const cargadoDosis = ref(false);
const cargadoFruta = ref(false);
const cargadoConsumos = ref(false);
const cargadoAlarmas = ref(false);
const cargadoNiveles = ref(false);
const cargadoLotes = ref(false);
const cargadoUsuario = ref(false);
const cargadoReposiciones = ref(false);
const cargadoFechas = ref(false);
const cargadoLotesChoose = ref(false);
const modoConsultaLotes = ref(null);
const cargadoLotesSelect = ref(false);
const mostrarAplicaciones = ref(false);
const datosLote = ref(false);
const cantidadesReposiciones = ref([]);
const rangoReposicion = ref([]);

const seriesEstado = ref([]);
const seriesAlarmas = ref([]);
const seriesNiveles = ref([]);
const seriesLotes = ref([]);
const seriesUsuario = ref([]);
const seriesReposiciones = ref([]);
const seriesDosis = ref([]);
const seriesFruta = ref([]);
const alarmasCalibrador = ref([]);
const lotes = ref([]);
const aplicaciones = ref([]);

const totalesConsumo = ref([]);
const rangoFechas = ref([]);

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

const inicio = ref(null);
const fin = ref(null);

const loteActual = ref(null);
const aplicacionActual = ref(null);

const sameDateFormat = {
  from: "DD/MM/YYYY, HH:mm",
  to: "HH:mm",
};

const dateInput = {
  inputClass: "selectdates",
  placeholder: "Seleccionar fecha",
};

const calendarDateInput = {
  labelStarts: "Inicio",
  labelEnds: "Fin",
  format: "DD/MM/YYYY",
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
      break;
    case "fin":
      return `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
      break;
  }
};

const fechaFormateada = (fecha) => {
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");
  const horas = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const segundos = fecha.getSeconds().toString().padStart(2, "0");
  return `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
};

const fechaFormateadaSQL = (fecha) => {
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");
  let horas = fecha.getHours() + fecha.getTimezoneOffset() / 60;
  horas = ((horas + 24) % 24).toString().padStart(2, "0"); // Asegura que las horas estén en el rango de 0-23
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const segundos = fecha.getSeconds().toString().padStart(2, "0");
  return `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
};

const nombreProducto = async (nombre) => {
  let nombreProductosDECCODAFReposiciones = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [101, 102, 103, 104, 105],
    props.maquina,
    routerStore().clienteID
  );

  let nombreSplit = nombre.split(" ");
  let producto = nombreSplit[0] + " " + nombreSplit[1];
  for (let nombreProducto of nombreProductosDECCODAFReposiciones) {
    if (nombreProducto.nombreCorto.includes(producto)) {
      return nombreProducto.registros[0].y;
    }
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
      [89],
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
    const lotFung = await obtenerDatosVariableGeneral(
      "todo",
      "valores",
      "individual",
      "sinfiltro",
      [90, 91, 92, 93, 94],
      props.maquina,
      routerStore().clienteID
    );
    lotes.value = [
      ...lotFung.map((loteFungicida, index) => {
        return loteFungicida.registros.map((r) => {
          let propiedad = `loteDecco${index + 1}`;
          return {
            id: `LF${index + 1}_${r[propiedad]}`,
            lote: `Lote Fungicida (Bomba ${index + 1}): ${r[propiedad]}`,
          };
        })[0];
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
      modeloID = 89;
      break;
    case "LF1":
      modeloID = 90;
      break;
    case "LF2":
      modeloID = 91;
      break;
    case "LF3":
      modeloID = 92;
      break;
    case "LF4":
      modeloID = 93;
      break;
    case "LF5":
      modeloID = 94;
      break;
  }

  let valor = value.split("_")[1] ? value.split("_")[1] : "";
  let ap = await obtenerIncioFin(modeloID, props.maquina, valor);
  aplicaciones.value = ap;
  mostrarAplicaciones.value = true;
}

async function lotesAplicaciones(aplicacion) {
  await historico(aplicacion.x, aplicacion.y);
  datosLote.value = true;
}

async function historico(date1, date2) {
  reset();
  inicio.value = date1 ? fechaFormateada(date1) : fechaDefault("inicio");
  fin.value = date2 ? fechaFormateada(date2) : fechaDefault("fin");

  cargado.value = false;
  cargadoEstado.value = false;
  cargadoAlarmasG.value = false;
  cargadoDosis.value = false;
  cargadoUsuario.value = false;
  cargadoReposiciones.value = false;
  cargadoFruta.value = false;
  cargadoConsumos.value = false;
  cargadoAlarmas.value = false;
  cargadoNiveles.value = false;

  // cargadoLotes.value = false;
  const lotesCliente = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLotesCliente",
    [89],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  const lotesfungicidasID = [90, 91, 92, 93, 94];
  const nombresproductosID = [101, 102, 103, 104, 105];
  let lotesFungicidas = [];
  let valores = [
    {
      name: "Lotes Fungicidas",
      data: [...lotesCliente],
    },
  ];
  let index = 0;
  for (let lotefungicidaID of lotesfungicidasID) {
    lotesFungicidas[index] = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "multiple",
      "formatoLotesFungicida",
      [lotefungicidaID, nombresproductosID[index]],
      props.maquina,
      routerStore().clienteID,
      inicio.value,
      fin.value
    );
    valores[0].data = [...valores[0].data, ...lotesFungicidas[index]];
    index++;
  }
  seriesLotes.value = valores;
  cargadoLotes.value = true;

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
    [12, 14],
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
  const alarmasR = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [12, 74, 75, 109],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesAlarmas.value = alarmasR;
  cargadoAlarmasG.value = true;

  const usuario = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoUsuarios",
    [106],
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

  const reposiciones = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [114, 115, 116, 117, 118, 119, 120],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesReposiciones.value = reposiciones;

  // Obtener la cantidad ultilizada en cada reposición en formato de una array {x: tiempo de la reposicion, y: cantidad}
  cantidadesReposiciones.value = [];
  let marchaReposiciones = seriesReposiciones.value.find(
    (v) => v.name == "Marcha"
  );
  let cantidades = [];
  for (let dato of marchaReposiciones.data) {
    rangoReposicion.value = dato.y;
    let cantidadesReposiciones = await obtenerDatosVariableGeneral(
      "historico",
      "ultimo",
      "individual",
      "sinfiltro",
      [121, 122, 123, 124, 125],
      props.maquina,
      routerStore().clienteID,
      fechaFormateadaSQL(new Date(rangoReposicion.value[0])),
      fechaFormateadaSQL(new Date(rangoReposicion.value[1]))
    );
    dato.reposicion = await Promise.all(
      cantidadesReposiciones
        .filter((cantidad) => cantidad.registros[0].y != 0)
        .map(async (cantidad) => ({
          y: cantidad.registros[0].y,
          nombreCorto: await nombreProducto(cantidad.nombreCorto),
        }))
    );
  }
  cargadoReposiciones.value = true;

  const otros = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [20, 21, 22, 23, 24],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value,
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
  rangoFechas.value = obtenerRangosFecha(inicio.value, fin.value);
  const totales2 = [];
  for (let i = 0; i < rangoFechas.value.length; i++) {
    totales2.push(
      await obtenerDatosVariableGeneral(
        "historico",
        "totales",
        "individual",
        "sinfiltro",
        [25, 26, 27, 28, 29, 30],
        props.maquina,
        routerStore().clienteID,
        rangoFechas.value[i].inicio,
        rangoFechas.value[i].fin
      )
    );
  }

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

    const totalFrutaPorMes = [];
    for (let i = 0; i < rangoFechas.value.length; i++) {
      totalFrutaPorMes.push(
        await obtenerDatosVariableGeneral(
          "historico",
          "totales",
          "individual",
          "sinfiltro",
          [48],
          deccodos.value,
          routerStore().clienteID,
          rangoFechas.value[i].inicio,
          rangoFechas.value[i].fin
        )
      );
    }

    for (let i = 0; i < totales2.length; i++) {
      for (let j = 0; j < totales2[i].length; j++) {
        let valor = totales2[i][j].registros[0].total;
        if (totalesConsumo.value[j] !== undefined) {
          totalesConsumo.value[j].data.push(
            Math.max(valor == null ? 0 : valor.toFixed(2), 0)
          );
          totalesConsumo.value[j + totales2[i].length].data.push(
            Math.max(
              valor == null
                ? 0
                : (
                    valor /
                    (totalFrutaPorMes[i][0].registros[0].total / 1000)
                  ).toFixed(2),
              0
            )
          );
        } else {
          let objectSerieLitros = {
            name: totales2[i][j].descripcion,
            type: "column",
            data: [Math.max(valor == null ? 0 : valor.toFixed(2), 0)],
          };
          let objectSerieLitrosTonelada = {
            name: totales2[i][j].descripcion + "(L/T)",
            type: "line",
            data: [
              Math.max(
                valor == null
                  ? 0
                  : (
                      valor /
                      (totalFrutaPorMes[i][0].registros[0].total / 1000)
                    ).toFixed(2),
                0
              ),
            ],
          };
          totalesConsumo.value[j] = objectSerieLitros;
          totalesConsumo.value[j + totales2[i].length] =
            objectSerieLitrosTonelada;
        }
      }
    }
    totalesConsumo.value = totalesConsumo.value.filter(
      (item) => item.name !== "Total Agua" && item.name !== "Total (L/T)"
    );

    // let kilos = await obtenerDatosVariableGeneral(
    //   "historico",
    //   "registros",
    //   "individual",
    //   "formatoAcumuladores",
    //   [48],
    //   deccodos.value,
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
      deccodos.value,
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
        parametrosCalibrador[indiceParametro + 1].fecha <
          kilosM[0].data[punto].x
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

function reset() {
  seriesEstado.value = [];
  seriesDosis.value = [];
  seriesUsuario.value = [];
  seriesReposiciones.value = [];
  seriesFruta.value = [];
  consumos.value = [];
  alarmas.value = [];
  rangoFechas.value = [];
  totalesConsumo.value = [];
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
  let kilosA = seriesFruta.value[0].data.map((e) => {
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

// Fúncion para obtener la array de fechas por cada mes.
function obtenerRangosFecha(fechaInicio, fechaFin) {
  let rangos = [];

  while (fechaInicio < fechaFin) {
    let año = parseInt(fechaInicio.slice(0, 4));
    let mes = parseInt(fechaInicio.slice(5, 7));
    let finMes = new Date(Date.UTC(año, mes, 0)).toISOString().slice(0, -1);
    if (finMes > fechaFin) {
      finMes = fechaFin;
    }
    rangos.push({
      inicio: fechaInicio,
      fin: finMes,
    });
    fechaInicio = new Date(Date.UTC(año, mes, 1)).toISOString().slice(0, -1);
  }
  return rangos;
}

onMounted(async () => {
  const maquina = await obtenerMaquina("lineaTipo", props.linea, 2);
  deccodos.value = maquina[0].id;
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
