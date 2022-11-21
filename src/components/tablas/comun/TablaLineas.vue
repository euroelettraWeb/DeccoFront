<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-data-table :headers="headers" :items="lineas" class="elevation-1">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Lineas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
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
                          label="DECCOWS"
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
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
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
    <v-btn @click="guardarLineas">Guardar</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "TablaLineas",
};
</script>
<script setup>
import axios from "axios";
import { watch, computed, ref, nextTick } from "vue";
import { routerStore } from "../../../stores/index";
let dialog = ref(false);
let form = ref(null);
let dialogDelete = ref(false);
let editedIndex = ref(-1);
let lineas = ref([]);
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
  // { text: "DECCOCONTROL", value: "deccocontrol" },
  { text: "Actions", value: "actions", sortable: false },
];
let editedItem = ref({
  nombre: "",
  deccodaf: false,
  deccodos: false,
  deccows: false,
  // deccocontrol: false,
});
let defaultItem = ref({
  nombre: "",
  deccodaf: false,
  deccodos: false,
  deccows: false,
  // deccocontrol: false,
});
let formTitle = computed(() => {
  return editedIndex.value === -1 ? "Nueva Linea" : "Editar linea";
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
      const element = lineas.value[index];
      let maquinas = [];
      if (element.deccodaf) maquinas.push({ nombre: "DECCODAF", tipo: 1 });
      if (element.deccodos) maquinas.push({ nombre: "DECCODOS", tipo: 2 });
      if (element.deccows) maquinas.push({ nombre: "DECCOWASHER", tipo: 3 });
      // if (element.deccocontrol)
      //   maquinas.push({ nombre: "DECCOCONTROL", tipo: 4 });
      axios
        .post(`${process.env.VUE_APP_RUTA_API}/lineas/nuevo`, {
          nombre: element.nombre,
          clienteID: routerStore().clienteID,
          maquinas: maquinas,
        })
        .then((res) => {});
    }
    routerStore().sistemas(routerStore().clienteID);
  }
}
</script>
