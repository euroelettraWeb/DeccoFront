<template>
  <v-card
    class="pa-2"
    height="250"
    max-width="250"
    max-height="350"
    color="primary"
  >
    <v-card-title class="font-weight-bold"> {{ props.cliente }}</v-card-title>
    <v-img
      v-if="isValidUrl(props.src)"
      class="white--text align-end"
      height="125px"
      :src="props.src"
      :contain="true"
    />
    <v-spacer v-else></v-spacer>
    <v-card-actions>
      <v-btn color="white" text link @click="updatePinia"> Acceder </v-btn>
      <v-btn color="white" text link @click="editar"> Editar </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ClienteCard",
};
</script>

<script setup>
import { routerStore } from "../../../stores/index";
const props = defineProps({
  cliente: { type: String, default: "" },
  id: { type: Number, default: 0 },
  src: { type: String, default: "" },
});
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

function updatePinia() {
  routerStore().sistemas(props.id);
}
function editar() {
  routerStore().clienteEditar(props.id);
}
</script>
