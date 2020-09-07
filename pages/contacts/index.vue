<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="display-1">Contacts</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" dark @click.stop="showAddContact">
          <v-icon dark left>mdi-account-plus</v-icon>Add contact
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="contacts"
      :page.sync="page"
      :show-select="false"
      :items-per-page="itemsPerPage"
      item-key="id"
      class="elevation-1 mt-4 row-clickable"
      hide-default-footer
      @page-count="pageCount = $event"
      @click:row="showContact"
    >
      <template #item.actions="{ item }">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click.stop="showEditContact(item)">
              <v-icon dark small>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit contact</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click.stop="showDeleteContact(item)">
              <v-icon dark small>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Delete contact</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <div class="text-center">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>

    <ContactFormDialog
      v-if="showContactFormDialog"
      v-bind="selectedContact"
      :action="contactFormAction"
      @close-dialog="closeContactFormDialog"
      @submit="onContactFormSubmit"
    />

    <AppConfirmDialog
      v-if="showDeleteContactDialog"
      :width="450"
      confirm-color="destructive"
      @close-dialog="showDeleteContactDialog = false"
      @confirm="deleteContact"
    >
      <template #title.text>Delete contact</template>
      <template>
        Are you sure you want to delete
        <span class="font-weight-bold">{{ selectedContact.firstName }} {{ selectedContact.lastName }}</span>?
      </template>
      <template #action.confirm.text>
        Delete
      </template>
    </AppConfirmDialog>

    <ContactDialog
      v-if="showContactDialog"
      v-bind="selectedContact"
      @close-dialog="showContactDialog = false"
    />

    <v-snackbar v-model="showNotification" color="blue darken-2">
      {{notificationMessage}}
      <template v-slot:action>
        <v-btn class="black--text" color="grey lighten-4" @click="showNotification = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { Context } from "@nuxt/types";
import { Contact } from "@/lib/interfaces/contacts"

export default Vue.extend({
  name: "Contacts",
  middleware: (context: Context) => {
    context.store.dispatch("contact/loadContacts", {});
  },
  data: () => {
    return {
      showContactFormDialog: false as boolean,
      contactFormAction: 'add' as 'add' | 'edit',
      selectedContact: { id: '', firstName: '', lastName: '', cellphone: ''} as Contact,
      itemsPerPage: 2 as number,
      page: 1 as number,
      pageCount: 0 as number,
      headers: [
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Cellphone", value: "cellphone" },
        { text: "", value: "actions", sortable: false },
      ],
      showDeleteContactDialog: false as boolean,
      showContactDialog: false as boolean
    };
  },
  computed: {
    ...mapState("contact", {
      contacts: 'contacts',
      showNotifications: "showNotification",
      notificationMessage: "notificationMessage",
    }),
    showNotification: {
      get(): any {
        return this.showNotifications;
      },
      set(value): void {
        this.updateShowNotification(value);
      },
    },
  },
  methods: {
    ...mapActions("contact", {
      updateShowNotification: "updateShowNotification",
      loadContacts: "loadContacts",
      removeContact: "removeContact",
      saveContact: "saveContact"
    }),
    setEmptySelectedContact(): void {
      this.selectedContact = { id: '', firstName: '', lastName: '', cellphone: ''};
    },
    showAddContact(): void {
      this.contactFormAction = 'add';
      this.setEmptySelectedContact();
      this.showContactFormDialog = true;
    },
    showContact(_event: MouseEvent, contactData: any): void {
      const contact: Contact = contactData.item;
      this.selectedContact = { ...contact };
      this.showContactDialog = true;
    },
    showEditContact(contact: Contact): void {
      this.contactFormAction = 'edit';
      this.selectedContact = { ...contact }; // ? create new vs passing ref? vuetify creates new
      this.showContactFormDialog = true;
    },
    showDeleteContact(contact: Contact): void {
      this.selectedContact = { ...contact };
      this.showDeleteContactDialog = true;
    },
    closeContactFormDialog(): void {
      this.showContactFormDialog = false;
    },
    closeDeleteContactDialog(): void {
      this.showDeleteContactDialog = false;
    },
    updateNotification(message: string): void {
      this.updateShowNotification({ show: true, message });
    },
    async deleteContact() {
      // ? Get contact data from dialog or use selected contact data?
      const response = await this.removeContact(this.selectedContact.id)
      let notificationMessage;
      if(response?.status === 204) {
        notificationMessage = 'Contact successfully deleted';
        this.closeDeleteContactDialog();
      } else {
        notificationMessage = 'Contact could not be deleted, please try again'
      }
      this.updateNotification(notificationMessage);
    },
    async onContactFormSubmit({ action, contact }: { action: 'add' | 'edit', contact: any }) {
      // ? Create new vs pass reference to contact?
      const response = await this.saveContact({ contact });
      let notificationMessage;
      if (action === 'add' && response?.status === 201) {
        notificationMessage = 'Contact successfully created';
        this.closeContactFormDialog();
      } else if (action === 'edit' && response?.status === 200) {
        notificationMessage = 'Contact successfully updated';
        this.closeContactFormDialog();
      } else {
        notificationMessage = 'Contact could not be saved, please try again';
      }
      this.updateNotification(notificationMessage);
    }
  },
});
</script>

<style lang="scss" scoped>
// Style the contents of a child component (v-data-table), so that each row
// of the table shows a pointer, indicating that it can be clicked.
.row-clickable::v-deep tbody tr {
  cursor: pointer;
}
</style>
