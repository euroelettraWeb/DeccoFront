<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table :headers="headers" :items="lineas" class="elevation-1">
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Maquinas</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog">
          <template #activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevas Maquina
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
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
                    <v-text-field
                      v-model="editedItem.codigo"
                      label="codigo"
                      value="codigo"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.descripcion"
                      label="descripcion"
                      value="descripcion"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.tipo"
                      label="Tipo"
                      value="tipo"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.maquinaID"
                      label="Maquina ID"
                      value="maquinaID"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
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
    <!-- <template #item.deccodaf="{ item }">
      <v-simple-checkbox v-model="item.codigo" disabled
        >DECCODAF</v-simple-checkbox
      >
    </template>
    <template #item.deccodos="{ item }">
      <v-simple-checkbox v-model="item.descripcion" disabled
        >DECCODOS</v-simple-checkbox
      >
    </template>
    <template #item.deccows="{ item }">
      <v-simple-checkbox v-model="item.tipo" disabled>
        DECCOWS</v-simple-checkbox
      >
    </template>
    <template #item.deccocontrol="{ item }">
      <v-simple-checkbox v-model="item.maquinaID" disabled>
        Maquina ID</v-simple-checkbox
      >
    </template> -->
  </v-data-table>
</template>

<script>
export default {
  name: "TablaMaquinas",
};
</script>
<script setup>
import { watch, computed, ref, nextTick, onMounted } from "vue";
import { routerStore } from "../../../stores/index";

let dialog = ref(false);
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
  { text: "Codigo", value: "codigo" },
  { text: "Descripcion", value: "descripcion" },
  { text: "Tipo", value: "tipo" },
  { text: "linea", value: "lineaID" },
  { text: "Actions", value: "actions", sortable: false },
];
let editedItem = ref({
  id: 0,
  nombre: "",
  codigo: "",
  descripcion: "",
  tipo: "",
  clienteID: 1,
});
let defaultItem = ref({
  id: 0,
  nombre: "",
  codigo: "",
  descripcion: "",
  tipo: "",
  lineaID: 0,
  clienteID: 0,
});
let formTitle = computed(() => {
  return editedIndex.value === -1 ? "Nueva Maquina" : "Editar Maquina";
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
async function obtenerVariable(id) {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/${id}`))
    .data;
}
onMounted(async () => {
  cliente = await obtenerVariable(routerStore().id);
});
</script>
