<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-data-table :headers="headers" :items="lineas" class="elevation-1">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Lineas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-switch
            v-model="deccocontrol"
            append-icon="mdi-snowflake"
            class="mt-4 mr-4"
            label="DECCOCONTROL"
          ></v-switch>
          <v-dialog v-model="dialog">
            <template #activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevas Lineas
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="form">
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="4">
                        <v-text-field
                          v-model="editedItem.nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-checkbox
                          v-model="editedItem.deccodaf"
                          label="DECCODAF"
                        ></v-checkbox>
                      </v-col>
                      <v-col>
                        <v-checkbox
                          v-model="editedItem.deccodos"
                          label="DECCODOS"
                        ></v-checkbox>
                      </v-col>
                      <v-col>
                        <v-checkbox
                          v-model="editedItem.deccows"
                          label="DECCOWASHER"
                        ></v-checkbox>
                      </v-col>
                      <!-- <v-col>
                        <v-checkbox
                          v-model="editedItem.deccocontrol"
                          label="DECCOCONTROL"
                        ></v-checkbox>
                      </v-col> -->
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="text-h5"
                >Estas seguro que quieres borrar esta linea?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template #item.deccodaf="{ item }">
        <v-simple-checkbox v-model="item.deccodaf" disabled
          >DECCODAF</v-simple-checkbox
        >
      </template>
      <template #item.deccodos="{ item }">
        <v-simple-checkbox v-model="item.deccodos" disabled
          >DECCODOS</v-simple-checkbox
        >
      </template>
      <template #item.deccows="{ item }">
        <v-simple-checkbox v-model="item.deccows" disabled>
          DECCOWASHER</v-simple-checkbox
        >
      </template>
      <!-- <template #item.deccocontrol="{ item }">
        <v-simple-checkbox v-model="item.deccocontrol" disabled>
          DECCOCONTROL</v-simple-checkbox
        >
      </template> -->
    </v-data-table>
    <v-btn class="mt-4" @click="guardarLineas">
      <v-icon light> mdi-content-save </v-icon> Guardar Lineas</v-btn
    >
  </v-container>
</template>

<script>
export default {
  name: "TablaLineasEditar",
};
</script>
<script setup>
import axios from "axios";
import {
  obtenerLinea,
  obtenerLineas,
  obtenerMaquina,
} from "../../../helpers/bd";

import { watch, computed, ref, nextTick, onMounted } from "vue";
import { routerStore } from "../../../stores/index";
let dialog = ref(false);
let form = ref(null);
let dialogDelete = ref(false);
let editedIndex = ref(-1);
let lineas = ref([]);
let deccocontrol = ref(false);
let headers = [
  {
    text: "Nombre",
    align: "start",
    sortable: false,
    value: "nombre",
  },
  { text: "DECCODAF", value: "deccodaf" },
  { text: "DECCODOS", value: "deccodos" },
  { text: "DECCOWS", value: "deccows" },
  { text: "Actions", value: "actions", sortable: false },
];
let editedItem = ref({
  id: 0,
  nombre: "",
  deccodaf: false,
  deccodos: false,
  deccows: false,
});
let defaultItem = ref({
  id: 0,
  nombre: "",
  deccodaf: false,
  deccodos: false,
  deccows: false,
});
let formTitle = computed(() => {
  return editedIndex.value === -1 ? "Nueva Linea" : "Editar linea";
});
let lineasV = [];
let maquinas = [];
onMounted(async () => {
  lineasV = await obtenerLineas(routerStore().clienteID);
  for (let index = 0; index < lineasV.length; index++) {
    const element = lineasV[index];
    maquinas = await obtenerMaquina("linea", element.id, 0);
    let next = {};
    next.id = element.id;
    next.nombre = element.nombre;
    next.clienteID = element.clienteID;
    for (let i = 0; i < maquinas.length; i++) {
      let maquina = maquinas[i];
      let estado = maquina.activa;
      switch (maquina.grupoID) {
        case 1:
          next.deccodaf = estado;
          break;
        case 2:
          next.deccodos = estado;
          break;
        case 3:
          next.deccows = estado;
          break;
        default:
          break;
      }
    }
    let deccoc = await obtenerMaquina(
      "clienteTipo",
      routerStore().clienteID,
      4
    );
    deccocontrol.value = deccoc.activa;
    lineas.value.push(next);
  }
});

watch(dialog, (val) => {
  val || close();
});
watch(dialogDelete, (val) => {
  val || closeDelete();
});
function editItem(item) {
  editedIndex.value = lineas.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

function deleteItem(item) {
  editedIndex.value = lineas.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}

function deleteItemConfirm() {
  lineas.value.splice(editedIndex.value, 1);
  closeDelete();
}

function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}

function closeDelete() {
  dialogDelete.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}

function save() {
  if (editedIndex.value > -1) {
    Object.assign(lineas.value[editedIndex.value], editedItem.value);
  } else {
    lineas.value.push(editedItem.value);
  }
  close();
}

async function guardarLineas() {
  if (lineas.value) {
    for (let index = 0; index < lineas.value.length; index++) {
      let element = lineas.value[index];
      let linea = await obtenerLinea(element.id);
      if (linea.length != 0) {
        let maquinas = await obtenerMaquina("linea", element.id, 0);
        let deccowsID = maquinas.find((maquina) => maquina.grupoID == 3);
        let deccodosID = maquinas.find((maquina) => maquina.grupoID == 2);
        let deccodafID = maquinas.find((maquina) => maquina.grupoID == 1);
        if (deccodafID) {
          maquinas.push({
            tipo: 1,
            activo: element.deccodaf,
          });
        } else {
          if (element.deccodaf)
            axios
              .post(`${process.env.VUE_APP_RUTA_API}/maquinas/nuevo`, {
                nombre: "Deccodaf",
                nombreLinea: element.nombre,
                clienteID: routerStore().clienteID,
                grupoID: 1,
                lineaID: element.id,
              })
              .then((res) => {});
        }
        if (deccodosID) {
          maquinas.push({
            tipo: 2,
            activo: element.deccodos,
          });
        } else {
          if (element.deccodos)
            axios
              .post(`${process.env.VUE_APP_RUTA_API}/maquinas/nuevo`, {
                nombre: "Deccodos",
                nombreLinea: element.nombre,
                clienteID: routerStore().clienteID,
                grupoID: 2,
                lineaID: element.id,
              })
              .then((res) => {});
        }
        if (deccowsID) {
          maquinas.push({
            tipo: 3,
            activo: element.deccows,
          });
        } else {
          if (element.deccows)
            axios
              .post(`${process.env.VUE_APP_RUTA_API}/maquinas/nuevo`, {
                nombre: "Deccowahser",
                nombreLinea: element.nombre,
                clienteID: routerStore().clienteID,
                grupoID: 3,
                lineaID: element.id,
              })
              .then((res) => {});
        }
        axios
          .post(`${process.env.VUE_APP_RUTA_API}/lineas/actualizar`, {
            id: element.id,
            nombre: element.nombre,
            clienteID: routerStore().clienteID,
            maquinas: maquinas,
            // deccocontrol: element.deccocontrol,
          })
          .then((res) => {});
      } else {
        let maquinas = [];
        if (element.deccodaf) maquinas.push({ nombre: "Deccodaf", tipo: 1 });
        if (element.deccodos) maquinas.push({ nombre: "Deccodos", tipo: 2 });
        if (element.deccows) maquinas.push({ nombre: "Deccowahser", tipo: 3 });
        // maquinas.push({ nombre: "DECCOCONTROL", tipo: 4 });
        axios
          .post(`${process.env.VUE_APP_RUTA_API}/lineas/nuevo`, {
            nombre: element.nombre,
            clienteID: routerStore().clienteID,
            maquinas: maquinas,
          })
          .then((res) => {});
      }
    }
  }
  // let deccoc = await obtenerMaquina("clienteTipo", routerStore().clienteID, 4)
  //   .id;
  // if (deccoc)
  //   axios
  //     .post(`${process.env.VUE_APP_RUTA_API}/maquinas/actualizar`, {
  //       id: deccoc,
  //       activo: deccocontrol.value,
  //     })
  //     .then((res) => {});
  // else
  //   axios.post(`${process.env.VUE_APP_RUTA_API}/maquinas/nuevo`, {
  //     nombre: "DECCOCONTROL",
  //     nombreLinea: "",
  //     clienteID: routerStore().clienteID,
  //     grupoID: 4,
  //     lineaID: null,
  //   });
}
// async function obtenerLinea(id) {
//   return (await axios.get(`${process.env.VUE_APP_RUTA_API}/lineas/${id}`)).data;
// }
// async function obtenerMaquina(modo, clienteID, grupoID) {
//   return (
//     await axios.get(
//       `${process.env.VUE_APP_RUTA_API}/maquinas/${modo}/${clienteID}/${grupoID}`
//     )
//   ).data;
// }
// async function obtenerVariable(clienteID) {
//   return (
//     await axios.get(`${process.env.VUE_APP_RUTA_API}/${clienteID}/lineas/all`)
//   ).data;
// }
</script>
