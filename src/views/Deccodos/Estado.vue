<template>
  <v-container>
    <DosisDOSe /> <DosisDOSb />
    <!-- <DosisDOSGeneral /> --></v-container
  >
</template>
<script>
export default {
  name: "EstadoView",
};
</script>
<script setup>
import DosisDOSe from "../../components/cards/deccodos/DosisDOSe.vue";
import DosisDOSb from "../../components/cards/deccodos/DosisDOSb.vue";
import DosisDOSGeneral from "../../components/cards/deccodos/DosisDOSGeneral.vue";
</script>
