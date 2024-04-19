<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col>
        <v-data-table
          :headers="cabeceras"
          :items="graficas"
          :rows-per-page="10"
          class="shadow-24"
        >
          <template #top>
            <v-row>
              <v-col cols="12" sm="8" md="9" lg="4">
                <v-card-title class="display-1"
                  >Permisos usuarios (Cliente)
                </v-card-title>
              </v-col>
              <v-col cols="12" sm="8" md="9" lg="3">
                <v-select
                  v-model="usuarioSeleccionado"
                  :items="usuariosClientes"
                  label="Usuarios"
                  dense
                  solo
                />
              </v-col>
              <v-col cols="12" sm="8" md="9" lg="3">
                <v-select
                  v-model="maquinaSeleccionada"
                  :items="maquinas"
                  label="Máquina"
                  dense
                  solo
                />
              </v-col>
              <v-col cols="12" sm="4" md="3" lg="2">
                <v-btn class="primary" @click="cargar"> Cargar </v-btn>
              </v-col>
            </v-row>
          </template>
          vue/valid-v-slot
          <template #item.visualizar="{ item }">
            <v-checkbox v-model="item.visualizar"></v-checkbox>
          </template>
        </v-data-table>
        <v-card-actions class="justify-end">
          <v-btn
            v-if="mostrarBotonGuardar"
            class="primary"
            @click="abrirDialogoEditar = true"
          >
            Guardar</v-btn
          >
        </v-card-actions>
      </v-col>
    </v-row>
    <!--Dialogo editar permisos usuario-->
    <v-dialog v-model="abrirDialogoEditar" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Editar permisos usuario (Cliente)</span>
        </v-card-title>
        <v-card-text>
          <p style="font-size: 20px">
            Estas seguro de editar los permisos del usuario [{{
              usuarioSeleccionado
            }}]?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="abrirDialogoEditar = false">
            Cerrar
          </v-btn>
          <v-btn color="blue darken-1" text @click="editarPermisos">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  name: "TablaPermisosUsuarios",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { obtenerUsuarios, obtenerClientes } from "../../../helpers/bd";

// Variables locales
const usuarios = ref([]);
const usuariosClientes = ref([]);
const usuarioSeleccionado = ref(null);
const usuariosSeleccionadoID = ref(null);
const maquinaSeleccionada = ref(null);
const graficas = ref([]);
const mostrarBotonGuardar = ref(false);
const abrirDialogoEditar = ref(false);

const maquinas = ["Deccowasher", "Deccodaf", "Deccodos"];

const cabeceras = [
  {
    text: "Grafica",
    value: "nombre",
    sortable: true,
    align: "left",
  },
  {
    text: "Visualizar",
    value: "visualizar",
    sortable: false,
    align: "left",
  },
];

const cargar = async () => {
  mostrarBotonGuardar.value = true;
  usuariosSeleccionadoID.value = usuarios.value.find(
    (usuario) => usuario.nombre === usuarioSeleccionado.value
  );
  let permisos = await axios.post(
    `${process.env.VUE_APP_RUTA_API}/usuarios/permisos/${maquinaSeleccionada.value}`,
    {
      usuarioID: usuariosSeleccionadoID.value.id,
    }
  );
  if (maquinaSeleccionada.value === "Deccowasher") {
    graficas.value = [
      {
        nombre: "Lote Jabon",
        visualizar: permisos.data[0].loteJabon,
      },
      {
        nombre: "Lote Desinfectante",
        visualizar: permisos.data[0].loteDesinfectante,
      },
      {
        nombre: "Estado",
        visualizar: permisos.data[0].estado,
      },
      {
        nombre: "Alarmas",
        visualizar: permisos.data[0].alarmas,
      },
      {
        nombre: "Usuario",
        visualizar: permisos.data[0].usuario,
      },
      {
        nombre: "Dosis de desinfectante y jabon",
        visualizar: permisos.data[0].dosis,
      },
      {
        nombre: "Kilos calibrador",
        visualizar: permisos.data[0].kilosCalibrador,
      },
      {
        nombre: "Estado de las bombas",
        visualizar: permisos.data[0].estadoBombas,
      },
    ];
  } else if (maquinaSeleccionada.value === "Deccodaf") {
    graficas.value = [
      {
        nombre: "Lote Fungicida",
        visualizar: permisos.data[0].loteFungicida,
      },
      {
        nombre: "Estado",
        visualizar: permisos.data[0].estado,
      },
      {
        nombre: "Alarmas",
        visualizar: permisos.data[0].alarmas,
      },
      {
        nombre: "Estado de los niveles de las garrafas (Falta de producto)",
        visualizar: permisos.data[0].estadoNivelGarrafas,
      },
      {
        nombre: "Usuario",
        visualizar: permisos.data[0].usuario,
      },
      {
        nombre: "Reposiciones",
        visualizar: permisos.data[0].reposiciones,
      },
      {
        nombre: "Dosis de fungicida",
        visualizar: permisos.data[0].dosis,
      },
      {
        nombre: "Kilos calibrador",
        visualizar: permisos.data[0].kilosCalibrador,
      },
    ];
  } else if (maquinaSeleccionada.value === "Deccodos") {
    graficas.value = [
      {
        nombre: "Lotes Fungicida",
        visualizar: permisos.data[0].lotesFungicida,
      },
      {
        nombre: "Estado",
        visualizar: permisos.data[0].estado,
      },
      {
        nombre: "Usuario",
        visualizar: permisos.data[0].usuario,
      },
      {
        nombre: "Dosis",
        visualizar: permisos.data[0].dosis,
      },
      {
        nombre: "Kilos calibrador",
        visualizar: permisos.data[0].kilosCalibrador,
      },
      {
        nombre: "Activacion limpieza cepillos",
        visualizar: permisos.data[0].activacionCepillos,
      },
    ];
  }
};

const editarPermisos = async () => {
  abrirDialogoEditar.value = false;
  await axios.post(
    `${process.env.VUE_APP_RUTA_API}/usuarios/permisos/${maquinaSeleccionada.value}/actualizar`,
    {
      usuarioID: usuariosSeleccionadoID.value.id,
      graficas: graficas.value,
    }
  );
};

onMounted(async () => {
  usuarios.value = await obtenerUsuarios();
  usuariosClientes.value = usuarios.value
    .filter((usuario) => usuario.rol === "Cliente")
    .map((usuario) => usuario.nombre);
});
</script>
