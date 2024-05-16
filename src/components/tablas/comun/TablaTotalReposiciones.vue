<template>
  <v-card>
    <v-row>
      <v-col v-if="props.cargado">
        <v-card-title>
          <strong>Consumo Hoy</strong>
        </v-card-title>
        <v-card-subtitle>{{ hoy }} (00:00:00 - Actual)</v-card-subtitle>
        <v-simple-table dense>
          <template v-if="props.tiempoReal">
            <thead>
              <tr>
                <th class="text-left"></th>
                <th class="text-right">Litros</th>
                <th class="text-right">Litros/Tonelada</th>
                <th class="text-right">Última hora</th>
                <th
                  v-for="modoReposicion in props.totalizadorReposicion"
                  :key="modoReposicion.id"
                  class="text-right"
                >
                  {{ modoReposicion.nombreModo }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.consumos" :key="item.id">
                <td>{{ item.nombre }}</td>
                <td class="text-right">
                  {{ item.total }}
                </td>
                <td v-if="props.deccodos" class="text-right">
                  {{ item.totalFruta }}
                </td>
                <td class="text-right">
                  {{ item.ultimaHora }}
                </td>
                <td
                  v-for="modoReposicion in props.totalizadorReposicion"
                  :key="modoReposicion.id"
                  class="text-right"
                >
                  <div
                    v-if="
                      item.nombre != 'Total Agua' && item.nombre != 'T Fruta'
                    "
                  >
                    {{
                      (
                        modoReposicion.consumos.find(
                          (producto) => producto.nombreProducto == item.nombre
                        ) || { y: 0 }
                      ).y / 1000
                    }}
                  </div>
                  <div v-else></div>
                </td>
              </tr>
            </tbody>
          </template>
          <template v-else>
            <thead>
              <tr>
                <th></th>
                <th class="text-right">Litros</th>
                <th class="text-right">Litros/Tonelada</th>
                <th
                  v-for="modoReposicion in props.totalizadorReposicion"
                  :key="modoReposicion.id"
                  class="text-right"
                >
                  {{ modoReposicion.nombreModo }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item of props.consumos" :key="item.id">
                <td>
                  {{ item.nombre }}
                </td>
                <td class="text-right">
                  {{ item.total }}
                </td>
                <td v-if="deccodos" class="text-right">
                  {{ item.totalPorToneladaFruta }}
                </td>
                <td
                  v-for="modoReposicion in props.totalizadorReposicion"
                  :key="modoReposicion.id"
                  class="text-right"
                >
                  <div
                    v-if="
                      item.nombre != 'Total Agua' &&
                      item.nombre != 'Total T Fruta'
                    "
                  >
                    {{
                      (
                        modoReposicion.consumos.find(
                          (producto) => producto.nombreProducto == item.nombre
                        ) || { y: 0 }
                      ).y / 1000
                    }}
                  </div>
                  <div v-else></div>
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
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: "TablaTotal",
};
</script>
<script setup>
import { computed } from "vue";

const props = defineProps({
  totalizadorReposicion: { type: Array, default: () => [] },
  consumos: { type: Array, default: () => [] },
  deccodos: { type: Number, default: null },
  cargado: { type: Boolean, default: false },
  tiempoReal: { type: Boolean, default: false },
});

const hoy = computed(() => {
  const fechaActual = new Date();
  const dia = fechaActual.getDate().toString().padStart(2, "0");
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
  const año = fechaActual.getFullYear();
  return `${dia}/${mes}/${año}`;
});
</script>
