<template>
  <v-card>
    <v-row
      ><v-col v-if="cargado"
        ><v-simple-table> <template #default></template></v-simple-table>
      </v-col>
      <v-col v-else class="d-flex justify-center align-center">
        <v-progress-circular
          :size="100"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular> </v-col></v-row
  ></v-card>
</template>
<script setup>
let cargado = ref(false);
</script>
