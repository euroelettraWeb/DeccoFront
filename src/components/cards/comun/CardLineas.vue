<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-card elevation="12" width="256">
        <v-card-title>{{ props.title }}</v-card-title>
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

              <v-list-item v-for="child in item.items" :key="child.title">
                <v-list-item-content
                  @click="router.menu(child.route, props.id, props.linea)"
                >
                  <v-list-item-title> {{ child.title }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
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
const router = routerStore();
const props = defineProps({
  title: { type: String, default: "" },
  id: { type: Number, default: 1 },
  linea: { type: Number, default: 1 },
});

let items = [
  {
    action: "mdi-flask",
    items: [
      { title: "Principal", route: "deccodaf:Principal" },
      { title: "Estado", route: "deccodaf:MarchaParo" },
      { title: "Consumo", route: "deccodaf:Consumo" },
      // { title: "Registros", route: "deccodaf:Registros" },
    ],
    title: "DECCODAF",
  },
  {
    action: "mdi-numeric-2",
    items: [
      { title: "Principal", route: "deccodos:Principal" },
      { title: "Estado", route: "deccodos:MarchaParo" },
      { title: "Consumo", route: "deccodos:Consumo" },
      // { title: "Registros", route: "deccodos:Registros" },
    ],
    title: "DECCODOS",
  },
  {
    action: "mdi-hand-water",
    items: [
      { title: "Principal", route: "deccowasher:Principal" },
      { title: "Estado", route: "deccowasher:MarchaParo" },
      { title: "Consumo", route: "deccowasher:Consumo" },
      // { title: "Registros", route: "deccowasher:Registros" },
    ],
    title: "DECCOWASHER",
  },
  {
    action: "mdi-snowflake",
    items: [{ title: "Principal", route: "deccocontrol:Principal" }],
    title: "DECCOCONTROL",
  },
];
</script>
