<template>
  <v-container fluid>
    <LoteCliente :tipo="2" />
    <v-row>
      <v-col>
        <TablaTotal
          :variables="[49, 50, 51, 52, 53, 54, 55]"
          :marcha="[31, 40, 42]"
          :tipo="2"
        />
      </v-col>
      <v-col>
        <TablaAlarmas :variables="[40, 42]" :marcha="[31, 40, 42]" :tipo="2" />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <LoteDeccoMod
          v-if="lotesFungicida"
          :tipo="2"
          :lotecliente="95"
          :lotesceras="[96, 97]"
          :nombresproductos="[82, 83]"
        />
        <Estado
          v-if="estado"
          :activo="31"
          :auto-manual="[41, 43]"
          :marcha="[31, 40, 42]"
          :alarma="[40, 42, 81]"
          :tipo="2"
          :categories="[
            'Activo',
            'MarchaParo',
            'Remoto',
            'Manual',
            'Falta de consenso',
            'Alarma',
            'Presencia Fruta',
          ]"
        />
        <UsuarioMaquina v-if="usuario" :usuario="107" :tipo="2" />
        <Dosis
          v-if="dosis"
          :variables="[32, 33, 34, 35, 36, 37, 38, 39]"
          title="Dosis"
          :tipo="2"
        />
        <KilosCalibradorComun
          v-if="kilosCalibrador"
          :variables="48"
          :tipo="2"
        />
        <GraficaEstadoCard
          v-if="activacionCepillos"
          :variables="[44]"
          :height="200"
          title="Activacion limpieza cepillos"
          :tipo="2"
          :categories="['Limpieza Cepillos']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCODOSPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/comun/Estado.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
import KilosCalibradorComun from "../../components/cards/comun/KilosCalibradorComun.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import LoteCliente from "../../components/cards/comun/LoteCliente.vue";
import LoteDeccoMod from "../../components/cards/deccodos/LoteDeccoMod.vue";
import UsuarioMaquina from "../../components/cards/comun/Usuario.vue";
import Dosis from "../../components/cards/deccodos/dosis.vue";
import { userStore } from "../../stores/index";
import { onMounted, ref } from "vue";
import axios from "axios";

// Variables booleanos para visualizar las graficas
const lotesFungicida = ref(true);
const estado = ref(true);
const usuario = ref(true);
const dosis = ref(true);
const kilosCalibrador = ref(true);
const activacionCepillos = ref(true);

// Consultar los permisos del usuario si es un usuario "Cliente"
onMounted(async () => {
  if (userStore().rol == "Cliente") {
    let permisos = await axios.post(
      `${process.env.VUE_APP_RUTA_API}/usuarios/permisos/Deccodos`,
      {
        usuarioID: userStore().usuario.id,
      }
    );
    // Asignar los valores según las propiedades del objeto
    lotesFungicida.value = permisos.data[0].lotesFungicida;
    estado.value = permisos.data[0].estado;
    usuario.value = permisos.data[0].usuario;
    dosis.value = permisos.data[0].dosis;
    kilosCalibrador.value = permisos.data[0].kilosCalibrador;
    activacionCepillos.value = permisos.data[0].activacionCepillos;
  }
});
</script>
