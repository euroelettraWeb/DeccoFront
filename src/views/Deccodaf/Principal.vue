<template>
  <v-container fluid>
    <LoteCliente :tipo="1" />
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <TablaTotal
              :variables="[25, 26, 27, 28, 29, 30]"
              :marcha="[1, 12, 14]"
              :tipo="1"
            />
          </v-col>
          <v-col>
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
        <GraficaEstadoCard
          v-if="reposiciones"
          :variables="[114, 115, 116, 117, 118, 119, 120]"
          :tipo="1"
          :height="400"
          title="Reposiciones"
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
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import KilosCalibradorComun from "../../components/cards/comun/KilosCalibradorComun.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
import LoteCliente from "../../components/cards/comun/LoteCliente.vue";
import LoteDeccoMod from "../../components/cards/deccodaf/LoteDeccoMod.vue";
import UsuarioMaquina from "../../components/cards/comun/Usuario.vue";
import { userStore } from "../../stores/index";
import { onMounted, ref } from "vue";
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

// Consultar los permisos del usuario si es un usuario "Cliente"
onMounted(async () => {
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
</script>
