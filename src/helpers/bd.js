import axios from "axios";

const obtenerLinea = async (id) =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/lineas/${id}`)).data;

const obtenerLineas = async (clienteID) =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/${clienteID}/lineas/all`))
    .data;

const obtenerMaquina = async (modo, id, grupoID) =>
  (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/maquinas/${modo}/${id}/${grupoID}`
    )
  ).data;

const obtenerVariables = async () =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/variable/all`)).data;

const obtenerProductos = async (modo, maquinaID) =>
  (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/productos/${modo}/${maquinaID}`
    )
  ).data;

const obtenerCliente = async (id) =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/${id}`)).data;

const obtenerUsuarios = async () =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/usuarios`)).data;

const obtenerUsuario = async (id) =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/usuarios/${id}`)).data;

const obtenerClientes = async (id) =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/all`)).data;

const obtenerClientePLC = async (id) =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/plcs/cliente/${id}`)).data;

const obtenerTurnos = async (clienteID) =>
  (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/turnos/cliente/${clienteID}`
    )
  ).data;

const obtenerDatosVariableGeneral = async (
  modo,
  operacion,
  consulta,
  filtrado,
  variables,
  maquinaID,
  clienteID,
  inicio,
  fin,
  otrasVariables
) =>
  (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/${modo}/${operacion}/${consulta}/${filtrado}/`,
      { variables, inicio, fin, maquinaID, clienteID, otrasVariables }
    )
  ).data;

const obtenerIncioFin = async (modeloID, maquinaID, valor) =>
  (
    await axios.post(`${process.env.VUE_APP_RUTA_API}/variable/filtroIF/`, {
      modeloID,
      maquinaID,
      valor,
    })
  ).data;

const guardarParametrosCalibrador = async (
  clienteID,
  lineaID,
  kilos,
  tolerancia
) =>
  (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/calibrador/parametros/guardar/${clienteID}/${lineaID}/`,
      {
        kilos,
        tolerancia,
      }
    )
  ).data;

const leerParametrosCalibrador = async (clienteID, lineaID, inicio, fin) =>
  (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/calibrador/parametros/leer/${clienteID}/${lineaID}/`,
      { inicio, fin }
    )
  ).data;

// const leerAlarmasCalibrador = async (clienteID, lineaID, inicio, fin) =>
//   (
//     await axios.post(
//       `${process.env.VUE_APP_RUTA_API}/calibrador/alarmas/leer/${clienteID}/${lineaID}/`,
//       { inicio, fin }
//     )
//   ).data;

export {
  obtenerDatosVariableGeneral,
  obtenerLinea,
  obtenerLineas,
  obtenerMaquina,
  obtenerVariables,
  obtenerProductos,
  obtenerCliente,
  obtenerTurnos,
  obtenerClientePLC,
  obtenerClientes,
  obtenerIncioFin,
  leerParametrosCalibrador,
  guardarParametrosCalibrador,
  obtenerUsuario,
  obtenerUsuarios,
  // leerAlarmasCalibrador,
};
