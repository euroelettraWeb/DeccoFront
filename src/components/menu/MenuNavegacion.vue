<template>
  <v-navigation-drawer
    v-model="estadoPanelLateral"
    app
    left
    temporary
    class="accent-4"
  >
    <v-list>
      <v-list-item link>
        <v-list-item-avatar>
          <v-img src="../../assets/logo_cliente.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title><b>Decco</b></v-list-item-title>
          <v-list-item-subtitle
            ><i>Naturally PostHarvest</i></v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-select
      v-model="select"
      :items="nombres"
      label="Cliente"
      item-text="nombre"
      item-value="id"
      :hide-selected="true"
      return-object
      dense
      solo
      @change="changeItem"
    ></v-select>
    <v-divider></v-divider>

    <v-list-item link @click="router.menu('home')">
      <v-list-item-icon>
        <v-icon>mdi-home</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Home</v-list-item-title>
    </v-list-item>
    <v-list nav>
      <v-list-item-group active-class="red--text text--accent-4">
        <v-list-group>
          <template #activator>
            <v-list-item-icon>
              <v-icon>mdi-factory</v-icon>
            </v-list-item-icon>
            <v-list-item>
              <v-list-item-content
                @click="router.menu('sistemas', router.id, router.lineas)"
              >
                <v-list-item-title> Sistemas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-group
            v-for="item in items"
            :key="item.linea"
            no-action
            sub-group
          >
            <template #activator>
              <v-list-item-icon>
                <v-icon>mdi-apps</v-icon>
              </v-list-item-icon>
              <v-list-item>
                <v-list-item-title>{{ item.linea }}</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-group
              v-for="child in item.sistemas"
              :key="child.title"
              v-model="child.active"
              :prepend-icon="child.action"
              no-action
              sub-group
            >
              <template #activator>
                <v-list-item-content>
                  <v-list-item-title> {{ child.title }} </v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item v-for="child2 in child.items" :key="child2.title">
                <v-list-item-content
                  @click="router.menu(child2.route, router.id, router.lineas)"
                >
                  <v-list-item-title> {{ child2.title }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </v-list-group>
        <v-list-item link @click="router.menu('historico', router.id)">
          <v-list-item-icon>
            <v-icon>mdi-archive</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Historico</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="router.menu('informe', router.id)">
          <v-list-item-icon>
            <v-icon>mdi-table</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Informe</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="router.menu('variables', router.id)">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Variables</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!usuarioLogeado" link @click="router.menu('login')">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "MenuNavegacion",
};
</script>
<script setup>
import { userStore, routerStore, navStore } from "../../stores/index";
import { storeToRefs } from "pinia";
import axios from "axios";
import { onMounted, ref, computed, reactive } from "vue";
const { usuario } = storeToRefs(userStore());
const usuarioLogeado = usuario;
const { estadoPanelLateral } = storeToRefs(navStore());
const router = routerStore();
const { id } = storeToRefs(routerStore());

async function obtenerVariable() {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/all`)).data;
}

const items = [
  {
    linea: "Linea 4",
    sistemas: [
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
    ],
  },
  {
    linea: "Linea 5",
    sistemas: [
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
    ],
  },
];
let clientes = ["Cliente 1"];
let nombres = ref([]);
let select = ref("");

onMounted(async () => {
  clientes = await obtenerVariable();
  select.value = id;
  let lista = [];
  for (const iterator of clientes) {
    lista.push({ id: iterator.id, nombre: iterator.nombre });
  }
  nombres.value = lista;
});

function changeItem(value) {
  router.menu("sistemas", value.id, 0);
}
</script>
