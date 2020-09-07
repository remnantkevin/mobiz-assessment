<template>
  <v-dialog :value="true" width="450" @click:outside="$emit('close-dialog')">
    <v-card>
      <v-card-title>
        <span>{{ firstName }} {{ lastName }}</span>
        <v-spacer />
        <v-btn icon @click.stop="$emit('close-dialog')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-list disabled>
          <v-list-item-group>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-phone</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ cellphone }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'ContactDialog',
    props: {
      id: {
        type: String,
        required: true
      },
      firstName: {
        type: String,
        default: ''
      },
      lastName: {
        type: String,
        default: ''
      },
      cellphone: {
        type: String,
        required: true
      }
    }
  })
</script>

<style scoped>

</style>