<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col v-if="cargado">
          <v-row>
            <v-col>
              <v-card-title>Consumo Hoy</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mx-4 mb-4">
              <v-simple-table dense>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left"></th>
                      <th
                        v-for="item in unidades"
                        :key="item.id"
                        class="text-left"
                      >
                        {{ item.nombre }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total</td>
                      <td v-for="item in consumos" :key="item.id">
                        {{ item.name }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
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
  </v-container>
</template>
<script>
export default {
  name: "TablaTotal",
};
</script>
<script setup>
import bd from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

let consumos = ref([]);
let unidades = ref([]);

let cargado = ref(false);

const props = defineProps({
  variables: { type: Array, default: new Array() },
  marcha: { type: Array, default: new Array(3) },
  tipo: { type: Number, default: 1 },
});

onMounted(async () => {
  cargado.value = false;

  cargado.value = true;
});
</script>
