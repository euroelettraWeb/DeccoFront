<template>
  <v-row>
    <v-col>
      <v-list flat subheader three-line>
        <v-subheader>Sistemas activos</v-subheader>

        <v-list-item-group v-model="settings" multiple active-class="">
          <v-list-item>
            <template #default="{ active }">
              <v-list-item-action class="align-self-center">
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>DECCODAF</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-list-item>
            <template #default="{ active }">
              <v-list-item-action class="align-self-center">
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>DECCODOS</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-list-item>
            <template #default="{ active }">
              <v-list-item-action class="align-self-center">
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>DECCOWASHER</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
          <v-list-item>
            <template #default="{ active }">
              <v-list-item-action class="align-self-center">
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>DECCOCONTROL</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list></v-col
    >
  </v-row>
</template>
