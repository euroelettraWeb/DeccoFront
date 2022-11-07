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
                <v-list-item-content>
                  <v-list-item-title> {{ item.title }} </v-list-item-title>
                </v-list-item-content>
              </template>
              <div v-if="item.estado">
                <v-list-item v-for="child in item.items" :key="child.title">
                  <v-list-item-content
                    @click="
                      router.menu(
                        child.route,
                        props.linea.clienteID,
                        props.linea.id
                      )
                    "
                  >
                    <v-list-item-title> {{ child.title }} </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
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
import { watch, computed, ref, nextTick } from "vue";
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
    action: "mdi-flask",
    estado: props.linea.deccodafID ? true : false,
    items: [
      { title: "Principal", route: "deccodaf:Principal" },
      { title: "Estado", route: "deccodaf:MarchaParo" },
      // { title: "Consumo", route: "deccodaf:Consumo" },
      // { title: "Registros", route: "deccodaf:Registros" },
    ],
    title: "DECCODAF",
  },
  {
    action: "mdi-numeric-2",
    estado: props.linea.deccodosID ? true : false,
    items: [
      { title: "Principal", route: "deccodos:Principal" },
      { title: "Estado", route: "deccodos:MarchaParo" },
      // { title: "Consumo", route: "deccodos:Consumo" },
      // { title: "Registros", route: "deccodos:Registros" },
    ],
    title: "DECCODOS",
  },
  {
    action: "mdi-hand-water",
    estado: props.linea.deccowsID ? true : false,
    items: [
      { title: "Principal", route: "deccowasher:Principal" },
      // { title: "Estado", route: "deccowasher:MarchaParo" },
      // { title: "Consumo", route: "deccowasher:Consumo" },
      // { title: "Registros", route: "deccowasher:Registros" },
    ],
    title: "DECCOWASHER",
  },
  // {
  //   action: "mdi-snowflake",
  //   estado: props.linea.deccocontrolID ? true : false,
  //   items: [{ title: "Principal", route: "deccocontrol:Principal" }],
  //   title: "DECCOCONTROL",
  // },
]);
</script>
