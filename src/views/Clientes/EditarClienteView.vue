<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col cols="10">
        <v-card>
          <v-row
            ><v-col><v-card-title>Editar Cliente</v-card-title></v-col></v-row
          >
          <v-row
            ><v-col><EditClienteForm /></v-col
          ></v-row>
          <v-row
            ><v-col><TablaLineasEditar /></v-col
          ></v-row>
          <v-row class="mb-4"
            ><v-col
              ><v-btn
                class="ml-4"
                color="primary"
                @click="routerStore().sistemas(routerStore().clienteID)"
                ><v-icon light> mdi-content-save </v-icon> Guardar
                Cliente</v-btn
              ></v-col
            ></v-row
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "EditarCliente",
};
</script>
<script setup>
import TablaLineasEditar from "../../components/tablas/comun/TablaLineasEditar.vue";
import EditClienteForm from "../../components/formularios/EditClienteForm.vue";
import { routerStore } from "../../stores/index";
</script>
