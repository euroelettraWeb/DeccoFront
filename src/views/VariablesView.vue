<template>
  <v-container>
    <v-row>
      <v-col>
        <VariableCard />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import VariableCard from "../components/cards/comun/VariableCard.vue";
export default {
  name: "VariablesView",
  components: { VariableCard },
  setup() {},
};
</script>
