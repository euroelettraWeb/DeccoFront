<template>
  <v-card color="red lighten-5" :loading="!cargado ? 'red darken-5' : null">
    <v-card-title>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <span id="leyenda" v-bind="attrs" v-on="on">
            <span id="marcha" class="font-italic text-subtitle-2">Marcha</span>
            <span id="paro" class="font-italic text-subtitle-2">Paro</span>
          </span>
        </template>
        <p>
          En eje Y la variable "0" o "1"y en eje X el tiempo transcurrido. Que
          nos den en este mismo gráfico el porcentaje de actividad (en el
          transcurso de OT y en el transcurso del Turno) Incluir un contador de
          cambio de estado de variable (contar los "1"), relacionarlo tambien
          con el cambio de bobina tanto de film principal, plegado y de bobina
          zipper.
        </p>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-row class="justify-end">
        <v-col cols="2">
          <v-text-field
            v-model="bolsasPendientes"
            readonly
            dense
            hide-details
            outlined
            label="Bolsas pendientes"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="finEstimado"
            readonly
            dense
            hide-details
            outlined
            label="Fin OF estimado"
          ></v-text-field>
        </v-col>
        <v-col v-if="!ofEnCurso.f_arranque" cols="3">
          <v-btn block color="primary" @click="arrancarOrden">ARRANCAR</v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="text-center">
      <GraficaMarchaParo
        v-if="cargado"
        :altura-grafico="50"
        :variable-i-o="[marchaParo]"
        :label-x="true"
      />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "MarchaParo",
  sockets: {
    // variable_4_actualizada(payload) {
    //     if(this.marchaParo !== null) {
    //         let penultimoValor = this.marchaParo.registros[this.marchaParo.registros.length-2].y
    //         let ultimoValor = this.marchaParo.registros[this.marchaParo.registros.length-1].y
    //         let nuevoValor = payload.registro.y
    //         if(ultimoValor === nuevoValor && penultimoValor === nuevoValor) {
    //             this.marchaParo.registros.pop()
    //         }
    //         this.marchaParo.registros.push(payload.registro)
    //     }
    // },
    //  variable_23_actualizada(payload) {
    //     if(this.numeroSacosOK !== null){
    //         this.$set(this.numeroSacosOK.registros, 1, payload.registro)
    //     }
    // },
  },
};
</script>
<script setup>
import moment from "moment";
import axios from "axios";
import GraficaMarchaParo from "../../graficas/GraficaMarchaParo.vue";

let ahora = ref(moment());
let cargado = ref(false);
let intervalo,
  marchaParo,
  numeroSacosOK,
  finEstimado = ref(null);
let bolsasPendientes = ref(0);

let obtenerDatosVariable = async function (
  operacion,
  modo,
  filtrado,
  variableID
) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/${operacion}/${modo}/${filtrado}/${variableID}`
    )
  ).data;
};

numeroSacosOK = obtenerDatosVariable(
  "inicioturno",
  "registros",
  "inicioturnoyactual",
  23
);
marchaParo = obtenerDatosVariable("8h", "registros", "repetidos", 4);

let minParoOF = () => {
  let total = 0;
  let parosOF = this.ofEnCurso.paros ? this.ofEnCurso.paros : [];
  for (let paro of parosOF) {
    total += parseInt(paro.duracion);
  }
  return total;
};
let pendientes = () => {
  return this.ofEnCurso.totalBolsas - this.bOKOF();
};
let calculoFin = () => {
  if (this.ofEnCurso.f_arranque) {
    let mdiof = ahora.diff(moment(this.ofEnCurso.f_inicio), "minutes");
    let velocidadRealOF = numeroSacosOK.registros[1].y / (mdiof - minParoOF());
    let duracion = this.bolsasPendientes / velocidadRealOF;
    return moment().add(duracion, "minutes").format("DD/MM HH:mm:ss");
  } else {
    return "ARRANQUE SIN CONFIRMAR";
  }
};
let notifNOOKOF = () => {
  let totalNotificadas = 0;
  if (this.ofEnCurso.notificacionesNOOK) {
    for (let notificacion of this.ofEnCurso.notificacionesNOOK) {
      totalNotificadas = totalNotificadas + parseInt(notificacion.unidades);
    }
  }
  return totalNotificadas;
};
let bOKOF = () => {
  if (this.numeroSacosOK !== null) {
    let boof = numeroSacosOK.registros[1].y - notifNOOKOF();
    return boof;
  } else {
    return 0;
  }
};

watchEffect(ahora, async (newValue) => {
  clearInterval(this.intervalo);
  intervalo = setInterval(async () => {
    newValue = moment();
    bolsasPendientes = pendientes;
    finEstimado = calculoFin;
    ahora = newValue;
  }, 10000);
});
cargado = true;
</script>

<style scoped>
#leyenda span {
  display: inline;
  padding-right: 10px;
}
#leyenda span:before {
  content: "";
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 5px;
}
#marcha:before {
  background: #47f54a;
}
#paro:before {
  background: #e31b2f;
}
</style>
