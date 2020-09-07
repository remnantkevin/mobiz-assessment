<template>
  <v-dialog
    :value="true"
    @click:outside="closeDialog"
    :width="width"
  >
    <v-card>
      <v-card-title>
        <span class="headline">
          <slot name="title.text">Confirm</slot>
        </span>
        <v-spacer />
        <v-btn icon @click.stop="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click.stop="closeDialog">Cancel</v-btn>
        <v-btn :color="confirmColor" @click.stop="confirm">
          <slot name="action.confirm.text">Confirm</slot>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 450
    },
    confirmColor: {
      type: String,
      default: 'primary'
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog');
    },
    confirm() {
      this.$emit('confirm');
    }
  }
}
</script>