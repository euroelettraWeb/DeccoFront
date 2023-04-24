<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-card elevation="12" width="256">
        <v-card-title>{{ props.linea.nombre }}</v-card-title>
        <v-navigation-drawer floating permanent>
          <v-list dense rounded>
            <v-list-group
              v-for="item in items"
              :key="item.title"
              v-model="item.active"
              :prepend-icon="item.action"
              no-action
              sub-group
            >
              <template #activator>
                <v-list-item-content
                  @click="
                    if (item.estado)
                      router.menu(
                        item.route,
                        props.linea.clienteID,
                        props.linea.id
                      );
                  "
                >
                  <v-list-item-title> {{ item.title }} </v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-group>
          </v-list>
        </v-navigation-drawer>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CardLineas",
};
</script>

<script setup>
import { routerStore } from "../../../stores/index";
import { computed } from "vue";
const router = routerStore();
const props = defineProps({
  id: { type: Number, default: 1 },
  linea: {
    type: Object,
    default() {
      return {
        clienteID: 0,
        id: 0,
        nombre: "",
        deccodafID: null,
        deccodosID: null,
        deccowsID: null,
        deccocontrolID: null,
      };
    },
  },
});

let items = computed(() => [
  {
    action: "mdi-hand-water",
    estado: props.linea.deccowsID ? true : false,
    route: "deccowasher:Principal",
    title: "DECCOWASHER",
  },
  {
    action: "mdi-flask",
    estado: props.linea.deccodafID ? true : false,
    route: "deccodaf:Principal",
    title: "DECCODAF",
  },
  {
    action: "mdi-numeric-2",
    estado: props.linea.deccodosID ? true : false,
    route: "deccodos:Principal",
    title: "DECCODOS",
  },
]);
</script>
