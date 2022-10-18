<template>
  <v-container>
    <v-card class="mx-auto" max-width="200" color="red">
      <v-img class="white--text align-end" height="200px" :src="props.src"
        ><v-card-title>{{ props.cliente }}</v-card-title>
        <v-card-actions>
          <v-btn color="white" text link @click="updatePinia"> Acceder </v-btn>
          <v-btn color="white" text link @click="editar"> Editar </v-btn>
        </v-card-actions>
      </v-img>
    </v-card>
  </v-container>
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
function updatePinia() {
  routerStore().sistemas(props.id);
}
function editar() {
  routerStore().clienteEditar(props.id);
}
</script>
