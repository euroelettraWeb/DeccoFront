<template>
  <v-card>
    <v-row>
      <v-col v-if="cargado">
        <v-row>
          <v-col>
            <v-card-title>Turnos</v-card-title>
          </v-col>
        </v-row>
        <v-row class="mx-2">
          <v-col>
            <v-simple-table dense>
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">Fecha</th>
                    <th class="text-left">Mañana Inicio</th>
                    <th class="text-left">Mañana Fin</th>
                    <th class="text-left">Tarde Inicio</th>
                    <th class="text-left">Tarde Fin</th>
                    <th class="text-left">Noche Inicio</th>
                    <th class="text-left">Noche Fin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ new Date().toLocaleDateString() }}</td>
                    <td>
                      <v-menu
                        ref="menu"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="time"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menu2"
                          v-model="time"
                          format="24hr"
                          full-width
                          @click:minute="$refs.menu.save(time)"
                        ></v-time-picker>
                      </v-menu>
                    </td>
                    <td>
                      <v-menu
                        ref="menu3"
                        v-model="menu4"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time2"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="time2"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menu4"
                          v-model="time2"
                          format="24hr"
                          full-width
                          @click:minute="$refs.menu3.save(time2)"
                        ></v-time-picker>
                      </v-menu>
                    </td>
                    <td>
                      <v-menu
                        ref="menu5"
                        v-model="menu6"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time3"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="time3"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menu6"
                          v-model="time3"
                          format="24hr"
                          full-width
                          @click:minute="$refs.menu5.save(time3)"
                        ></v-time-picker>
                      </v-menu>
                    </td>
                    <td>
                      <v-menu
                        ref="menu7"
                        v-model="menu8"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time4"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="time4"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menu8"
                          v-model="time4"
                          format="24hr"
                          full-width
                          @click:minute="$refs.menu7.save(time4)"
                        ></v-time-picker>
                      </v-menu>
                    </td>
                    <td>
                      <v-menu
                        ref="menu9"
                        v-model="menu10"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time5"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="time5"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menu10"
                          v-model="time5"
                          format="24hr"
                          full-width
                          @click:minute="$refs.menu9.save(time5)"
                        ></v-time-picker>
                      </v-menu>
                    </td>
                    <td>
                      <v-menu
                        ref="menu11"
                        v-model="menu12"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time6"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="time6"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menu12"
                          v-model="time6"
                          format="24hr"
                          full-width
                          @click:minute="$refs.menu11.save(time6)"
                        ></v-time-picker>
                      </v-menu>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            ><v-btn color="info" class="mx-4 mb-4" @click="save">
              <v-icon light> mdi-content-save </v-icon> Guardar
            </v-btn></v-col
          >
        </v-row>
      </v-col>
      <v-col v-else class="d-flex justify-center align-center">
        <v-progress-circular
          :size="100"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: "TablaTurnos",
};
</script>
<script setup>
import axios from "axios";
import { obtenerTurnos } from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores";

const cargado = ref(false);
const menu = ref(null);
const menu2 = ref(null);
const time = ref(null);

const menu3 = ref(null);
const menu4 = ref(null);
const time2 = ref(null);

const menu5 = ref(null);
const menu6 = ref(null);
const time3 = ref(null);

const menu7 = ref(null);
const menu8 = ref(null);
const time4 = ref(null);

const menu9 = ref(null);
const menu10 = ref(null);
const time5 = ref(null);

const menu11 = ref(null);
const menu12 = ref(null);
const time6 = ref(null);

const times = ref(null);

async function save() {
  if (
    time.value &&
    time2.value &&
    time3.value &&
    time4.value &&
    time5.value &&
    time6.value
  ) {
    let array = [
      { nombre: "Mañana", horaInicio: time.value, horaFin: time2.value },
      { nombre: "Tarde", horaInicio: time3.value, horaFin: time4.value },
      { nombre: "Noche", horaInicio: time5.value, horaFin: time6.value },
    ];
    if (!times.value) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        axios
          .post(`${process.env.VUE_APP_RUTA_API}/turnos/nuevo`, {
            turno: element.nombre,
            clienteID: routerStore().clienteID,
            horaInicio: element.horaInicio,
            horaFin: element.horaFin,
          })
          .then((res) => {});
      }
    } else {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        axios
          .post(`${process.env.VUE_APP_RUTA_API}/turnos/actualizar`, {
            nombre: element.nombre,
            horaInicio: element.horaInicio,
            horaFin: element.horaFin,
            clienteID: routerStore().clienteID,
          })
          .then((res) => {});
      }
    }
    times.value = await obtenerTurnos(routerStore().clienteID);
  }
}

onMounted(async () => {
  cargado.value = false;
  let t = await obtenerTurnos(routerStore().clienteID);
  if (t.length > 1) {
    time.value = t[0].horaInicio;
    time2.value = t[0].horaFin;
    time3.value = t[1].horaInicio;
    time4.value = t[1].horaFin;
    time5.value = t[2].horaInicio;
    time6.value = t[2].horaFin;
    times.value = t;
  }
  cargado.value = true;
});
</script>
