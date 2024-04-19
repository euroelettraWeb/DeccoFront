<template>
  <v-container fluid fill-height>
    <v-col>
      <v-card class="mb-5">
        <TablaUsuarios />
      </v-card>
      <v-card>
        <TablaPermisosUsuarios />
      </v-card>
    </v-col>
  </v-container>
</template>
<script>
export default {
  name: "GestionUsuariosView",
};
</script>
<script setup>
import TablaUsuarios from "../components/tablas/comun/TablaUsuarios.vue";
import TablaPermisosUsuarios from "../components/tablas/comun/TablaPermisosUsuarios.vue";
</script>
