<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col class="text-center fill-height">
        <v-card elevation="2">
          <v-card-title>DECCODAF</v-card-title>
          <v-card-actions
            ><v-btn @click="router.deccodaf">Acceder</v-btn></v-card-actions
          >
        </v-card>
      </v-col>
      <v-col class="text-center fill-height">
        <v-card elevation="2">
          <v-card-title>DECCODOS</v-card-title>
          <v-card-actions
            ><v-btn @click="router.deccodos">Acceder</v-btn></v-card-actions
          >
        </v-card>
      </v-col>
      <v-col class="text-center fill-height">
        <v-card elevation="2">
          <v-card-title>DECCOWASHER</v-card-title>
          <v-card-actions
            ><v-btn @click="router.deccowasher">Acceder</v-btn></v-card-actions
          >
        </v-card>
      </v-col>
      <v-col class="text-center fill-height">
        <v-card elevation="2">
          <v-card-title>DECCOCONTROL</v-card-title>
          <v-card-actions
            ><v-btn @click="router.deccocontrol">Acceder</v-btn></v-card-actions
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SistemasView",
};
</script>

<script setup>
import { routerStore } from "../stores/index";
const router = routerStore();
</script>
