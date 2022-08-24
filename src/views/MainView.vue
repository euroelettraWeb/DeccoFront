<template>
  <v-app app>
    <BarraAplicacion />
    <MenuNavegacion />
    <span class="bg"></span>
    <v-main>
      <!-- If using vue-router -->
      <router-view></router-view>
    </v-main>
    <v-footer app> &copy; Euroelettra Ingeniería {{ yyyy }} </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "MainView",
};
</script>
<script setup>
import moment from "moment";
import MenuNavegacion from "../components/menu/MenuNavegacion.vue";
import BarraAplicacion from "../components/menu/BarraAplicacion.vue";
import { ref } from "vue";
const yyyy = ref(moment().format("YYYY"));
</script>
