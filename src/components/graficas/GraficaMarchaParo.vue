<template>
  <v-container>
    <GraficaEstado
      v-if="cargado"
      :altura-grafico="50"
      :variable-i-o="[marchaParo]"
      :label-x="true"
    />
  </v-container>
</template>
<script>
export default {
  name: "GraficaMarchaParo",
};
</script>
