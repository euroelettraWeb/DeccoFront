<template>
  <v-container fluid>
    <LoteCliente :lotecliente="89" :tipo="1" />
    <v-row>
      <v-col>
        <v-row>
          <v-col cols="12" sm="9">
            <TablaTotalReposiciones
              :consumos="consumosTotal"
              :totalizador-reposicion="consumoTotalizadorReposiciones"
              :deccodos="deccodos"
              :cargado="cargado"
              :tiempo-real="true"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <TablaAlarmas
              :variables="[12, 14, 74, 75]"
              :marcha="[1, 12, 14, 74, 75]"
              :tipo="1"
            />
          </v-col>
        </v-row>
        <LoteDeccoMod
          v-if="loteFungicida"
          :tipo="1"
          :lotecliente="89"
          :lotesfungicidas="[90, 91, 92, 93, 94]"
          :nombresproductos="[101, 102, 103, 104, 105]"
        />
        <Estado
          v-if="estado"
          :activo="1"
          :auto-manual="[13, 15]"
          :marcha="[1, 12, 14, 73, 74, 75]"
          :alarma="[12, 14, 73, 74, 75]"
          :tipo="1"
          :categories="[
            'Activo',
            'MarchaParo',
            'Remoto',
            'Manual',
            'Falta de consenso',
          ]"
        />
        <GraficaEstadoCard
          v-if="alarmas"
          :variables="[12, 74, 75, 109]"
          :height="300"
          title="Alarmas"
          :tipo="1"
          :estados="['', 'Aviso']"
          :categories="[
            'Fallo Agua',
            'Termico Agitador',
            'Tope Palets Alcanzado',
            'No hay presión aire',
          ]"
          :colores="['#00c853', '#d50000']"
        />
        <GraficaEstadoCard
          v-if="estadoNivelGarrafas"
          :variables="[20, 21, 22, 23, 24]"
          :height="320"
          title="Estado de los niveles de las garrafas (Falta de producto)"
          :tipo="1"
          :estados="['Aviso', '']"
          :categories="[
            'Nivel Garrafa P1',
            'Nivel Garrafa P2',
            'Nivel Garrafa P3',
            'Nivel Garrafa P4',
            'Nivel Garrafa P5',
          ]"
        />
        <UsuarioMaquina v-if="usuario" :usuario="106" :tipo="1" />
        <GraficaReposiciones
          v-if="reposiciones"
          :series="seriesReposiciones"
          :height="400"
          :cargado="cargado"
          :tiempo-real="true"
          title="Reposiciones"
        />
        <GraficoLineaCardGen
          :serie="serieTotalAgua"
          title="Total Agua consumida"
          :cargado="cargarTotalAgua"
          :tiempo-real="true"
        />
        <GraficaLineaCard
          v-if="dosis"
          title="Dosis de fungicida"
          :variables="[7, 8, 9, 10, 11]"
          :tipo="1"
        />
        <KilosCalibradorComun
          v-if="kilosCalibrador"
          :variables="48"
          :tipo="1"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCODAFPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/comun/Estado.vue";
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import GraficoLineaCardGen from "../../components/cards/comun/GraficoLineaCardGen.vue";
import TablaTotalReposiciones from "../../components/tablas/comun/TablaTotalReposiciones.vue";
import KilosCalibradorComun from "../../components/cards/comun/KilosCalibradorComun.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
import GraficaReposiciones from "../../components/cards/comun/GraficaReposiciones.vue";
import LoteCliente from "../../components/cards/comun/LoteCliente.vue";
import LoteDeccoMod from "../../components/cards/deccodaf/LoteDeccoMod.vue";
import UsuarioMaquina from "../../components/cards/comun/Usuario.vue";
import { userStore } from "../../stores/index";
import { onMounted, ref, watch, onUnmounted } from "vue";
import { routerStore } from "../../stores/index";
import { obtenerMaquina, obtenerDatosVariableGeneral } from "../../helpers/bd";
import axios from "axios";

// Variables booleanos para visualizar las graficas
const loteFungicida = ref(true);
const estado = ref(true);
const alarmas = ref(true);
const estadoNivelGarrafas = ref(true);
const usuario = ref(true);
const reposiciones = ref(true);
const dosis = ref(true);
const kilosCalibrador = ref(true);
const cargado = ref(false);

// Variables relacionadas con las reposiciones
const seriesReposiciones = ref([]);
const interval = ref(null);
const maquinaID = ref(null);
const cantidadesReposiciones = ref([]);
const variablesReposiciones = [121, 122, 123, 124, 125];
const consumoTotalizadorReposiciones = ref([]);

const consumosTotal = ref([]);
const deccodos = ref(2);

const serieTotalAgua = ref([]);
const cargarTotalAgua = ref(false);

// Cargar datos total agua
const cargarDatosTotalAgua = async () => {
  let totalAgua = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoAcumuladores",
    [25],
    maquinaID.value,
    routerStore().clienteID,
    null,
    null
  );
  serieTotalAgua.value = totalAgua;
  cargarTotalAgua.value = true;
};

// Cargar datos tabla total
const cargarDatosTotal = async () => {
  deccodos.value = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, 2)
  )[0].id;
  let totalesBD = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [25, 26, 27, 28, 29, 30],
    maquinaID.value,
    routerStore().clienteID
  );
  let ultimaHora = await obtenerDatosVariableGeneral(
    "ultimaHora",
    "totales",
    "individual",
    "sinfiltro",
    [25, 26, 27, 28, 29, 30],
    maquinaID.value,
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
    consumosTotal.value = [];
    for (let index = 0; index < totalesBD.length; index++) {
      const element = totalesBD[index];
      const elementUltimaHora = ultimaHora[index];
      let producto = await nombreProducto(element.descripcion, null, null);
      let n = Math.max(0, element.registros[0].total);
      let d =
        totalesFruta[0].registros[0].total > 0
          ? (n / (totalesFruta[0].registros[0].total / 1000)).toLocaleString(
              "es-ES"
            )
          : 0;
      consumosTotal.value.push({
        id: index,
        nombre: producto,
        total: Math.max(0, element.registros[0].total).toLocaleString("es-ES"),
        totalFruta: d.toLocaleString("es-ES"),
        ultimaHora: Math.max(
          0,
          elementUltimaHora.registros[0].total
        ).toLocaleString("es-ES"),
      });
    }
    consumosTotal.value.push({
      id: totalesBD.length,
      nombre: "T Fruta",
      total: Math.max(
        0,
        totalesFruta[0].registros[0].total / 1000
      ).toLocaleString("es-ES"),
    });
  } else {
    consumosTotal.value = [];
    for (let index = 0; index < totalesBD.length; index++) {
      const element = totalesBD[index];
      const elementUltimaHora = ultimaHora[index];
      let producto = await nombreProducto(element.descripcion, null, null);
      consumosTotal.value.push({
        id: index,
        nombre: producto,
        total: Math.max(0, element.registros[0].total)
          .toFixed(3)
          .toLocaleString("es-ES"),
        ultimaHora: Math.max(0, elementUltimaHora.registros[0].total)
          .toFixed(3)
          .toLocaleString("es-ES"),
      });
    }
  }
};

// Cargar datos reposiciones
const cargarDatosReposiciones = async () => {
  let formatoVariables = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [114, 115, 116, 117, 118, 119, 120],
    maquinaID.value,
    routerStore().clienteID,
    null,
    null,
    ["Paro", "Marcha"]
  );
  seriesReposiciones.value = formatoVariables;
};

// Obtener la cantidad ultilizada en cada reposición en formato de una array {x: tiempo de la reposicion, y: cantidad}
const cargarDatosCantidadReposiciones = async () => {
  cantidadesReposiciones.value = [];
  if (variablesReposiciones.length > 0) {
    let marcha = seriesReposiciones.value.find((v) => v.name == "Marcha");
    for (let dato of marcha.data) {
      let rangoReposicion = dato.y;
      let cantidadesReposiciones = await obtenerDatosVariableGeneral(
        "historico",
        "ultimo",
        "individual",
        "sinfiltro",
        [121, 122, 123, 124, 125],
        maquinaID.value,
        routerStore().clienteID,
        fechaFormateada(new Date(rangoReposicion[0])),
        fechaFormateada(new Date(rangoReposicion[1]))
      );
      let reposicion = [];
      for (let cantidad of cantidadesReposiciones) {
        if (cantidad.registros[0]) {
          if (cantidad.registros[0].y != 0) {
            let nombreProductoResult = await nombreProducto(
              cantidad.nombreCorto,
              fechaFormateada(new Date(rangoReposicion[0])),
              fechaFormateada(new Date(rangoReposicion[1]))
            );
            reposicion.push({
              y: cantidad.registros[0].y,
              nombreProducto: nombreProductoResult,
            });
          }
        }
      }
      dato.reposicion = reposicion;
    }
  }
};

// Función para obtener el nombre del producto
const nombreProducto = async (nombre, fechaInicio, fechaFin) => {
  let nombreProductosDECCODAFReposiciones = [];
  if (fechaInicio != null && fechaFin != null) {
    nombreProductosDECCODAFReposiciones = await obtenerDatosVariableGeneral(
      "historico",
      "ultimo",
      "individual",
      "sinfiltro",
      [101, 102, 103, 104, 105],
      maquinaID.value,
      routerStore().clienteID,
      fechaInicio,
      fechaFin
    );
  } else {
    nombreProductosDECCODAFReposiciones = await obtenerDatosVariableGeneral(
      "24H",
      "ultimo",
      "individual",
      "sinfiltro",
      [101, 102, 103, 104, 105],
      maquinaID.value,
      routerStore().clienteID
    );
  }

  let nombreSplit = nombre.split(" ");
  let producto1 = nombreSplit[0] + " " + nombreSplit[1];
  let producto2 = nombreSplit[1] + " " + nombreSplit[2];
  let response = null;
  for (let nombreProducto of nombreProductosDECCODAFReposiciones) {
    if (nombreProducto.nombreCorto.includes(producto1)) {
      response = nombreProducto.registros[0].y;
    } else if (nombreProducto.nombreCorto.includes(producto2)) {
      response = nombreProducto.registros[0].y;
    }
  }
  if (response != null) {
    return response;
  } else {
    return nombre;
  }
};

// Función para obtener el totalizador de productos gastados en cada modo de reposicion
const totalizadorReposicion = (reposiciones) => {
  for (let modoReposicion of reposiciones[1].data) {
    // Buscar el objeto en el array
    let objetoEncontrado = consumoTotalizadorReposiciones.value.find(
      (obj) => obj.nombreModo === modoReposicion.x
    );

    if (objetoEncontrado) {
      // Si el objeto existe, sumar los valores
      modoReposicion.reposicion.forEach((producto) => {
        let productoEncontrado = objetoEncontrado.consumos.find(
          (obj) => obj.nombreProducto === producto.nombreProducto
        );

        if (productoEncontrado) {
          productoEncontrado.y += producto.y;
        } else {
          objetoEncontrado.consumos.push({
            nombreProducto: producto.nombreProducto,
            y: producto.y,
          });
        }
      });
    } else {
      // Si el objeto no existe, puedes decidir qué hacer, por ejemplo, agregarlo al array
      let consumos = {};

      modoReposicion.reposicion.forEach((producto) => {
        if (!consumos[producto.nombreProducto]) {
          consumos[producto.nombreProducto] = 0;
        }
        consumos[producto.nombreProducto] += producto.y;
      });

      let resultado = {
        nombreModo: modoReposicion.x,
        consumos: [],
      };

      for (let nombreProducto in consumos) {
        resultado.consumos.push({
          nombreProducto: nombreProducto,
          y: consumos[nombreProducto],
        });
      }

      consumoTotalizadorReposiciones.value.push(resultado);
    }
  }
};

// Función de todas las llamadas a las funciones necesarias de reposiciones.
const funcionReposiciones = async () => {
  await cargarDatosReposiciones();
  await cargarDatosCantidadReposiciones();
  await totalizadorReposicion(seriesReposiciones.value);
};

const fechaFormateada = (fecha) => {
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");
  const horas = (fecha.getHours() + fecha.getTimezoneOffset() / 60)
    .toString()
    .padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const segundos = fecha.getSeconds().toString().padStart(2, "0");
  return `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
};

watch(
  () => routerStore().lineasID,
  async () => {
    cargado.value = false;
    maquinaID.value = (
      await obtenerMaquina("lineaTipo", routerStore().lineasID, 1)
    )[0].id;
    await funcionReposiciones();
    await cargarDatosTotal();
    await cargarDatosTotalAgua();
    cargado.value = true;
  }
);

// Consultar los permisos del usuario si es un usuario "Cliente"
onMounted(async () => {
  cargado.value = false;
  maquinaID.value = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, 1)
  )[0].id;
  await funcionReposiciones();
  await cargarDatosTotal();
  await cargarDatosTotalAgua();
  cargado.value = true;
  interval.value = setInterval(async () => {
    await funcionReposiciones();
    await cargarDatosTotal();
    await cargarDatosTotalAgua();
  }, 90000);

  if (userStore().rol == "Cliente") {
    let permisos = await axios.post(
      `${process.env.VUE_APP_RUTA_API}/usuarios/permisos/Deccodaf`,
      {
        usuarioID: userStore().usuario.id,
      }
    );
    // Asignar los valores según las propiedades del objeto
    loteFungicida.value = permisos.data[0].loteFungicida;
    estado.value = permisos.data[0].estado;
    alarmas.value = permisos.data[0].alarmas;
    estadoNivelGarrafas.value = permisos.data[0].estadoNivelGarrafas;
    usuario.value = permisos.data[0].usuario;
    reposiciones.value = permisos.data[0].reposiciones;
    dosis.value = permisos.data[0].dosis;
    kilosCalibrador.value = permisos.data[0].kilosCalibrador;
  }
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>
