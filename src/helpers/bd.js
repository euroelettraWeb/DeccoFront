import axios from "axios";

const obtenerDatosVariables = async (
  operacion,
  modo,
  filtrado,
  variables,
  maquinaID
) =>
  (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/multiple/${operacion}/${modo}/${filtrado}/`,
      { variables, maquinaID }
    )
  ).data;

const obtenerDatosHistoricoVariable = async (
  operacion,
  modo,
  filtrado,
  variables,
  inicio,
  fin,
  maquinaID
) =>
  (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/multiple/${operacion}/${modo}/${filtrado}/`,
      { variables, inicio, fin, maquinaID }
    )
  ).data;

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

const obtenerDatosVariable = async (operacion, modo, filtrado, variableID) =>
  (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/${operacion}/${modo}/${filtrado}/${variableID}`
    )
  ).data;

const obtenerVariables = async () =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/variable/all`)).data;

const obtenerVariablesMarcha = async (
  clienteID,
  modo,
  variables,
  operacion,
  maquinaID,
  inicio,
  fin
) =>
  (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/marcha/${modo}/${operacion}`,
      {
        variables,
        inicio,
        fin,
        clienteID,
        maquinaID,
      }
    )
  ).data;

const obtenerProductos = async (modo, maquinaID) =>
  (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/productos/${modo}/${maquinaID}`
    )
  ).data;

const obtenerCliente = async (id) =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/${id}`)).data;

const obtenerClientes = async (id) =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/all`)).data;

const obtenerClientePLC = async (id) =>
  (await axios.get(`${process.env.VUE_APP_RUTA_API}/plcs/cliente/${id}`)).data;

const obtenerDatosVariableTotal = async (
  clienteID,
  modo,
  variableID,
  maquinaID,
  inicio,
  fin
) =>
  (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/total/${clienteID}/${modo}/${maquinaID}/${variableID}`,
      { inicio, fin }
    )
  ).data;

const obtenerTurnos = async (clienteID) =>
  (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/turnos/cliente/${clienteID}`
    )
  ).data;
export default {
  obtenerDatosVariables,
  obtenerLinea,
  obtenerLineas,
  obtenerMaquina,
  obtenerDatosVariable,
  obtenerVariables,
  obtenerDatosHistoricoVariable,
  obtenerVariablesMarcha,
  obtenerProductos,
  obtenerCliente,
  obtenerDatosVariableTotal,
  obtenerTurnos,
  obtenerClientePLC,
  obtenerClientes,
};
