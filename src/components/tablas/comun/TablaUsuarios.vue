<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12">
        <v-card-title class="display-1">Usuarios registrados</v-card-title>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="6">
        <v-data-table
          :headers="cabeceras"
          :items="usuariosClientes"
          :rows-per-page="10"
          class="shadow-24"
        >
          <template #top>
            <v-row>
              <v-col cols="12" sm="8" md="9" lg="10">
                <v-card-title class="display-1">Clientes </v-card-title>
              </v-col>
            </v-row>
          </template>
          <template #item.acciones="{ item }">
            <v-btn icon @click="abrirDialogoEditarUsuario(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="abrirDialogoEliminarUsuario(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="6">
        <v-data-table
          :headers="cabeceras"
          :items="usuariosComerciales"
          :rows-per-page="10"
          class="shadow-24"
        >
          <template #top>
            <v-row align="center">
              <v-col cols="12" sm="12" md="7" lg="7">
                <v-card-title class="display-1">Comerciales </v-card-title>
              </v-col>
              <v-col cols="12" sm="12" md="5" lg="5">
                <v-btn class="primary" @click="abrirDialogoNuevo = true">
                  <v-icon left>mdi-plus</v-icon>
                  Nuevo usuario comercial
                </v-btn>
              </v-col>
            </v-row>
          </template>
          <template #item.acciones="{ item }">
            <v-btn icon @click="abrirDialogoEditarUsuario(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="abrirDialogoEliminarUsuario(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <!--Dialogo nuevo usuario-->
    <v-dialog v-model="abrirDialogoNuevo" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Nuevo usuario comercial</span>
        </v-card-title>
        <v-card-text>
          <v-col>
            <v-text-field
              v-model="nombre"
              label="Nombre"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="usuario"
              label="Usuario"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="contraseña"
              label="Contraseña"
              type="password"
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="clientesVisibles"
              label="Clientes"
              :items="clientes"
              multiple
              chips
              required
              outlined
            ></v-select>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="abrirDialogoNuevo = false">
            Cerrar
          </v-btn>
          <v-btn color="blue darken-1" text @click="nuevoUsuarioComercial">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Dialogo modificar usuario-->
    <v-dialog v-model="abrirDialogoEditar" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Modificar usuario</span>
        </v-card-title>
        <v-card-text>
          <v-col>
            <v-text-field
              v-model="usuarioSeleccionado.nombre"
              label="Nombre"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="usuarioSeleccionado.usuario"
              label="Usuario"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="usuarioSeleccionado.contraseña"
              label="Contraseña"
              type="password"
              :error-messages="
                usuarioSeleccionado.contraseña
                  ? ''
                  : 'Rellene el campo de contraseña'
              "
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-if="usuarioSeleccionado.rol === 'Comercial'"
              v-model="usuarioSeleccionado.clienteID"
              label="Clientes"
              :items="clientes"
              multiple
              chips
              required
              outlined
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-if="usuarioSeleccionado.rol === 'Cliente'"
              v-model="usuarioSeleccionado.clienteID[0]"
              label="Cliente"
              :items="clientes"
              required
              outlined
            ></v-select>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="abrirDialogoEditar = false">
            Cerrar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!usuarioSeleccionado.contraseña"
            @click="modificarUsuario"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Dialogo eliminar usuario-->
    <v-dialog v-model="abrirDialogoEliminar" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Eliminar usuario</span>
        </v-card-title>
        <v-card-text>
          <p style="font-size: 20px">
            Estas seguro de eliminar el usuario [{{
              usuarioSeleccionado.usuario
            }}]?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="abrirDialogoEliminar = false"
          >
            Cerrar
          </v-btn>
          <v-btn color="blue darken-1" text @click="eliminarUsuario">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  name: "TablaUsuarios",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { obtenerUsuarios, obtenerClientes } from "../../../helpers/bd";
import CryptoJS from "crypto-js";
import { userStore } from "../../../stores/index";

const abrirDialogoEditar = ref(false);
const abrirDialogoNuevo = ref(false);
const abrirDialogoEliminar = ref(false);
const usuarioSeleccionado = ref([]);
const usuarios = ref([]);
const usuariosClientes = ref([]);
const usuariosComerciales = ref([]);
const clientesObj = ref([]);
const clientes = ref([]);
const cabeceras = [
  {
    text: "Nombre",
    value: "nombre",
    sortable: true,
    align: "left",
  },
  {
    text: "Usuario",
    value: "usuario",
    sortable: true,
    align: "left",
  },
  {
    text: "Rol",
    value: "rol",
    sortable: false,
    align: "left",
  },
  {
    text: "Acciones",
    value: "acciones",
    sortable: false,
    align: "center",
  },
];

// Variables nuevo usuario
const nombre = ref("");
const usuario = ref("");
const contraseña = ref("");
const rol = ref("");
const clientesVisibles = ref("");
const clienteVisible = ref("");

const abrirDialogoEditarUsuario = (user) => {
  let clientes = [];
  // Verificar si user.clienteID es un array
  if (Array.isArray(user.clienteID)) {
    for (const id of user.clienteID) {
      for (const cliente of clientesObj.value) {
        // Si el clienteID del usuario coincide con el clienteID en clientesObj.value
        if (id === cliente.id) {
          // Agregar el nombre del cliente a user.clientes
          clientes.push(cliente.nombre);
          usuarioSeleccionado.value = user;
          usuarioSeleccionado.value.clienteID = clientes;
        }
      }
    }
  } else {
    // Si no es un array, asumir que es un solo valor y buscar coincidencias
    for (const cliente of clientesObj.value) {
      if (user.clienteID === cliente.id) {
        clientes.push(cliente.nombre);
        usuarioSeleccionado.value = user;
        usuarioSeleccionado.value.clienteID = clientes;
      }
    }
  }
  usuarioSeleccionado.value = user;
  abrirDialogoEditar.value = true;
};

const abrirDialogoEliminarUsuario = (user) => {
  usuarioSeleccionado.value = user;
  abrirDialogoEliminar.value = true;
};

const modificarUsuario = async () => {
  abrirDialogoEditar.value = false;
  let clientesID = [];
  // Verificar si user.clienteID es un array
  if (Array.isArray(usuarioSeleccionado.value.clienteID)) {
    for (const nombre of usuarioSeleccionado.value.clienteID) {
      for (const cliente of clientesObj.value) {
        // Si el clienteID del usuario coincide con el clienteID en clientesObj.value
        if (nombre === cliente.nombre) {
          // Agregar el id a clientesID
          clientesID.push(cliente.id);
        }
      }
    }
  } else {
    // Si no es un array, asumir que es un solo valor y buscar coincidencias
    for (const cliente of clientesObj.value) {
      if (usuarioSeleccionado.value.clienteID === cliente.nombre) {
        clientesID.push(cliente.id);
      }
    }
  }
  await axios.post(`${process.env.VUE_APP_RUTA_API}/usuarios/actualizar`, {
    id: usuarioSeleccionado.value.id,
    usuario: usuarioSeleccionado.value.usuario,
    nombre: usuarioSeleccionado.value.nombre,
    password: CryptoJS.MD5(usuarioSeleccionado.value.contraseña).toString(),
    rol: usuarioSeleccionado.value.rol,
    clienteID: clientesID,
  });
};

const nuevoUsuarioComercial = async () => {
  // Buscamos los clientesIDs si hay clientesVisibles seleccionados que concide por el nombre para obtener su ID.
  let clientesIDs = null;
  if (clientesVisibles.value.length > 0) {
    clientesIDs = clientesObj.value
      .filter((clienteObj) =>
        clientesVisibles.value.some(
          (clienteVisible) => clienteVisible == clienteObj.nombre
        )
      )
      .map((clienteObj) => clienteObj.id);
  }
  if (clienteVisible.value.length > 0) {
    let clienteObj = clientesObj.value.find(
      (clienteObj) => clienteVisible.value == clienteObj.nombre
    );

    if (clienteObj) {
      clientesIDs = [clienteObj.id];
    }
  }
  abrirDialogoNuevo.value = false;
  await axios.post(`${process.env.VUE_APP_RUTA_API}/usuarios/nuevo`, {
    usuario: usuario.value,
    nombre: nombre.value,
    password: CryptoJS.MD5(contraseña.value).toString(),
    rol: "Comercial",
    clienteID: clientesIDs,
  });
  usuarios.value = await obtenerUsuarios();
  // Encuentra el índice del usuario en la lista
  const index = usuarios.value.findIndex(
    (usuario) => usuario.id === userStore().usuario.id
  );

  // Si el usuario existe en la lista, lo elimina
  if (index !== -1) {
    usuarios.value.splice(index, 1);
  }

  usuariosComerciales.value = usuarios.value.filter(
    (usuario) => usuario.rol === "Comercial"
  );
};

const eliminarUsuario = async () => {
  abrirDialogoEliminar.value = false;
  // Encuentra el índice del usuario en la lista
  const array =
    usuarioSeleccionado.value.rol === "Comercial"
      ? usuariosComerciales.value
      : usuariosClientes.value;
  const index = array.findIndex(
    (usuario) => usuario.id === usuarioSeleccionado.value.id
  );

  // Si el usuario existe en la lista, lo elimina
  if (index !== -1) {
    array.splice(index, 1);
  }
  await axios.post(`${process.env.VUE_APP_RUTA_API}/usuarios/eliminar`, {
    id: usuarioSeleccionado.value.id,
  });
};

onMounted(async () => {
  usuarios.value = await obtenerUsuarios();

  clientesObj.value = await obtenerClientes();
  // Encuentra el índice del usuario en la lista
  const index = usuarios.value.findIndex(
    (usuario) => usuario.id === userStore().usuario.id
  );

  // Si el usuario existe en la lista, lo elimina
  if (index !== -1) {
    usuarios.value.splice(index, 1);
  }

  usuariosClientes.value = usuarios.value.filter(
    (usuario) => usuario.rol === "Cliente"
  );

  usuariosComerciales.value = usuarios.value.filter(
    (usuario) => usuario.rol === "Comercial"
  );

  for (const cliente of clientesObj.value) {
    clientes.value.push(cliente.nombre);
  }
});
</script>
