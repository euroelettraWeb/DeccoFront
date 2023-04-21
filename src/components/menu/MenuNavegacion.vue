<template>
  <v-navigation-drawer
    v-model="estadoPanelLateral"
    app
    left
    temporary
    class="accent-4"
  >
    <v-list>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="../../assets/logo_cliente.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title><b>Decco</b></v-list-item-title>
          <v-list-item-subtitle
            ><i>More. Beautiful. Fresh.</i></v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-select
      v-if="usuarioLogeado && administrador"
      v-model="select"
      :items="nombres"
      label="Cliente"
      item-text="nombre"
      item-value="id"
      :hide-selected="true"
      :disabled="!usuarioLogeado"
      return-object
      dense
      solo
      @change="changeItem"
    ></v-select>
    <v-divider></v-divider>

    <v-list-item link @click="router.menu('home', router.clienteID, 0)">
      <v-list-item-icon>
        <v-icon>mdi-home</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Home</v-list-item-title>
    </v-list-item>
    <v-list nav>
      <v-list-item-group active-class="red--text text--accent-4">
        <v-list-group v-if="usuarioLogeado && stateLineas">
          <template #activator>
            <v-list-item-icon>
              <v-icon>mdi-factory</v-icon>
            </v-list-item-icon>
            <v-list-item>
              <v-list-item-content
                @click="
                  router.menu('sistemas', router.clienteID, router.lineasID)
                "
              >
                <v-list-item-title> Lineas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-group
            v-for="item in refLineas"
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
                <v-list-item-content
                  @click="
                    if (child.estado)
                      router.menu(child.route, router.clienteID, item.id);
                  "
                >
                  <v-list-item-title> {{ child.title }} </v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-group>
          </v-list-group>
        </v-list-group>
        <v-list-item
          v-if="usuarioLogeado && clienteActivo"
          link
          @click="router.menu('historico', router.clienteID)"
        >
          <v-list-item-icon>
            <v-icon>mdi-archive</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Historico</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item
          v-if="usuarioLogeado && clienteActivo"
          link
          @click="router.menu('informe', router.clienteID)"
        >
          <v-list-item-icon>
            <v-icon>mdi-table</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Informe</v-list-item-title>
        </v-list-item> -->
        <v-list-item
          v-if="usuarioLogeado && clienteActivo"
          link
          @click="router.menu('variables', router.clienteID)"
        >
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Variables</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="!usuarioLogeado"
          link
          @click="router.menu('login', 0, 0)"
        >
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
import {
  obtenerClientes,
  obtenerLineas,
  obtenerMaquina,
} from "../../helpers/bd";
import { userStore, routerStore, navStore } from "../../stores/index";
import { storeToRefs } from "pinia";
import { onMounted, ref, computed, reactive, watch } from "vue";
const { usuarioValido } = storeToRefs(userStore());
const usuarioLogeado = usuarioValido;
const { estadoPanelLateral } = storeToRefs(navStore());
const router = routerStore();
const { clienteID } = storeToRefs(routerStore());

const items = (array) => {
  let list = [];
  if (array) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      list.push({
        linea: element.nombre,
        id: element.id,
        sistemas: [
          {
            action: "mdi-hand-water",
            estado: element.deccowsID ? true : false,
            route: "deccowasher:Principal",
            title: "DECCOWASHER",
          },
          {
            action: "mdi-flask",
            estado: element.deccodafID ? true : false,
            route: "deccodaf:Principal",
            title: "DECCODAF",
          },
          {
            action: "mdi-numeric-2",
            estado: element.deccodosID ? true : false,
            route: "deccodos:Principal",
            title: "DECCODOS",
          },
          // {
          //   action: "mdi-snowflake",
          //   estado: element.deccocontrolID ? true : false,
          //   items: [{ title: "Principal", route: "deccocontrol:Principal" }],
          //   title: "DECCOCONTROL",
          // },
        ],
      });
    }
  }
  return list;
};
let clientes = [];
let lineas = [];
let nombres = ref([]);
let select = ref(0);
let stateLineas = ref(false);
let refLineas = ref([]);

let administrador = computed(() =>
  userStore().rol == "ADMINISTRADOR" ? true : false
);
let clienteActivo = computed(() => (clienteID.value ? true : false));

onMounted(async () => {
  if (clienteID.value != 0) select.value = clienteID;
  clientes = await obtenerClientes();
  if (select.value) {
    lineas = await obtenerLineas(select.value);
    stateLineas.value = true;
  } else {
    stateLineas.value = false;
  }
  watch(select, async (val) => {
    if (val) {
      stateLineas.value = false;
      lineas = await obtenerLineas(val);
      for (let index = 0; index < lineas.length; index++) {
        let element = lineas[index];
        let maq = await obtenerMaquina("linea", element.id);
        let deccowsID = maq.find((maquina) => maquina.grupoID == 3);
        let deccodosID = maq.find((maquina) => maquina.grupoID == 2);
        let deccodafID = maq.find((maquina) => maquina.grupoID == 1);

        if (deccowsID) lineas[index].deccowsID = deccowsID.activa;
        if (deccodosID) lineas[index].deccodosID = deccodosID.activa;
        if (deccodafID) lineas[index].deccodafID = deccodafID.activa;
      }
      refLineas.value = items(lineas);
      stateLineas.value = true;
    } else {
      stateLineas.value = false;
    }
  });
  // computed(() => {
  //   return ;
  // });
  let lista = [];
  for (const iterator of clientes) {
    lista.push({ id: iterator.id, nombre: iterator.nombre });
  }
  nombres.value = lista;
});

function changeItem(value) {
  router.sistemas(value.id, 0);
}
</script>
