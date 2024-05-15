<template>
  <v-container fluid>
    <LoteCliente :lotecliente="98" :tipo="3" />
    <v-row>
      <v-col>
        <TablaTotal
          :variables="[70, 71, 72]"
          :marcha="[57, 60, 62]"
          :tipo="3"
        />
      </v-col>
      <v-col>
        <TablaAlarmas
          :variables="[60, 62, 84, 85, 86, 87]"
          :marcha="[57, 60, 62]"
          :tipo="3"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <LoteDeccoMod
          :tipo="3"
          :lotecliente="98"
          :lotedeccodesinf="99"
          :lotedeccojabon="100"
          :nombredesinf="135"
          :nombrejabon="136"
          :lotejabonvisualizar="loteJabon"
          :lotedesinfvisualizar="loteDesinfectante"
        />
        <Estado
          v-if="estado"
          :activo="57"
          :auto-manual="[61, 63]"
          :marcha="[57, 60, 62]"
          :alarma="[62, 88]"
          :tipo="3"
          :categories="[
            'Activo',
            'MarchaParo',
            'Remoto',
            'Manual',
            'Falta de consenso',
            'Presencia Fruta',
          ]"
        />
        <GraficaEstadoCard
          v-if="alarmas"
          :variables="[60, 84, 85, 86, 87]"
          :height="300"
          title="Alarmas"
          :tipo="3"
          :colores="['#00c853', '#d50000']"
          :estados="['', 'Aviso']"
          :categories="[
            'Falta de agua',
            'Minimo Nivel Desinfectante',
            'Bidon Desinfectante Vacio',
            'Minimo Nivel Jabon',
            'Bidon Jabon Vacio',
          ]"
        />
        <UsuarioMaquina v-if="usuario" :usuario="108" :tipo="3" />
        <GraficaLineaCard
          v-if="dosis"
          title="Dosis de Desinfectante y Jabon"
          :variables="[58, 59]"
          :tipo="3"
        />
        <KilosCalibradorComun
          v-if="kilosCalibrador"
          :variables="48"
          :tipo="3"
        />
        <GraficaEstadoCard
          v-if="estadoBombas"
          :variables="[64, 65]"
          :height="250"
          title="Estado de las bombas"
          :tipo="3"
          :estados="['Paro', 'Marcha']"
          :categories="['Bomba Desinfectante', 'Bomba Jabon']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCOWASHERPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/comun/Estado.vue";
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import KilosCalibradorComun from "../../components/cards/comun/KilosCalibradorComun.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import LoteCliente from "../../components/cards/comun/LoteCliente.vue";
import LoteDeccoMod from "../../components/cards/deccowasher/LoteDeccoMod.vue";
import UsuarioMaquina from "../../components/cards/comun/Usuario.vue";
import { userStore } from "../../stores/index";
import { onMounted, ref } from "vue";
import axios from "axios";

// Variables booleanos para visualizar las graficas
const loteJabon = ref(true);
const loteDesinfectante = ref(true);
const estado = ref(true);
const alarmas = ref(true);
const usuario = ref(true);
const dosis = ref(true);
const kilosCalibrador = ref(true);
const estadoBombas = ref(true);

// Consultar los permisos del usuario si es un usuario "Cliente"
onMounted(async () => {
  if (userStore().rol == "Cliente") {
    let permisos = await axios.post(
      `${process.env.VUE_APP_RUTA_API}/usuarios/permisos/Deccowasher`,
      {
        usuarioID: userStore().usuario.id,
      }
    );
    // Asignar los valores según las propiedades del objeto
    loteJabon.value = permisos.data[0].loteJabon;
    loteDesinfectante.value = permisos.data[0].loteDesinfectante;
    estado.value = permisos.data[0].estado;
    alarmas.value = permisos.data[0].alarmas;
    usuario.value = permisos.data[0].usuario;
    dosis.value = permisos.data[0].dosis;
    kilosCalibrador.value = permisos.data[0].kilosCalibrador;
    estadoBombas.value = permisos.data[0].estadoBombas;
  }
});
</script>
