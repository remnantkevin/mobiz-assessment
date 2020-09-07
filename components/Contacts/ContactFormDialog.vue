<template>
  <div class="justify-end">
    <v-dialog :value="true" persistent width="450">
      <v-card>
        <v-form @submit.prevent="onSubmit">
          <v-container class="px-11 py-7">
            <v-row>
              <h1 class="headline">{{ formTitle }}</h1>
              <v-spacer></v-spacer>
              <v-btn icon @click.stop="closeDialog">
                <v-icon dark>mdi-close</v-icon>
              </v-btn>
            </v-row>
            <v-row class="mt-5">
              <label>
                First name
                <span class="grey--text text--lighten-1">(Optional)</span>
              </label>

              <v-responsive width="100%"></v-responsive>
              <v-text-field v-model.trim="contact.firstName" type="text" autocomplete="off" outlined dense></v-text-field>
            </v-row>
            <v-row>
              <label>
                Last name
                <span class="grey--text text--lighten-1">(Optional)</span>
              </label>
              <v-responsive width="100%"></v-responsive>
              <v-text-field v-model.trim="contact.lastName" type="text" autocomplete="off" outlined dense></v-text-field>
            </v-row>
            <v-row>
              <label>
                Cellphone
                <span class="grey--text text--lighten-1">(Required)</span>
              </label>
              <v-responsive width="100%"></v-responsive>
              <v-text-field v-model.trim="contact.cellphone" type="text" autocomplete="off" outlined dense></v-text-field>
            </v-row>
            <v-row class="justify-end mt-12">
              <v-card-actions class="pr-0">
                <v-btn outlined color="primary" @click.stop="closeDialog">Cancel</v-btn>
                <v-btn type="submit" color="primary">Save</v-btn>
              </v-card-actions>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { mapState, mapActions } from "vuex";

export default Vue.extend({
  name: "ContactFormDialog",
  props: {
    action: {
      type: String as PropType<'add' | 'edit'>,
      // validator(value: string): boolean {
      //   return ['add', 'edit'].indexOf(value) !== -1;
      // } 
    },
    id: {
      type: String,
      default: ''
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
      default: ''
    }
  },
  data() {
    return {
      contact: {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        cellphone: this.cellphone,
      },
    };
  },
  computed: {
    isAddForm(): boolean {
      return this.action === 'add';
    },
    formTitle(): string {
      return this.isAddForm ? 'Add new contact' : 'Edit contact';
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit', { action: this.action, contact: this.contact })
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  },
});
</script>

<style lang="scss" scoped>
.phone-input {
  width: 100% !important;
}
</style>
