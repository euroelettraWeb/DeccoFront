<template>
  <MainView />
</template>

<script>
export default {
  name: "App",
  metaInfo: {
    title: "DECCO",
  },
};
</script>
<script setup>
import MainView from "./views/MainView.vue";
</script>

<style>
/* html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
} */

@font-face {
  font-family: "Gellix Light";
  src: url("./assets/fonts/gellix-7.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Gellix Medium";
  src: url("./assets/fonts/Gellix-Medium.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.v-application {
  font-family: "Gellix Light", sans-serif !important;
}

.v-application b,
strong,
span[style*="font-weight: bold"] {
  font-family: "Gellix Medium", sans-serif !important;
}

.titulo {
  font-size: 2.125rem !important;
  line-height: 2.5rem;
  font-weight: 400;
  font-family: "Gellix Medium", sans-serif !important;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.v-card {
  max-height: 100%;
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow-y: auto;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #e1bee7;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ce93d8;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #ba68c8;
}

.no-clickable {
  pointer-events: none;
}

.v-btn {
  text-transform: none !important;
}

.v-list-item__title:hover {
  cursor: pointer;
}

.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url("./assets/imagenFondoApp.jpg") no-repeat center center;
  background-size: cover;
  transform: scale(1.1);
  opacity: 0.4;
}
</style>
