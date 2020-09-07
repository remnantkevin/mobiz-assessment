import axios from "axios";
import { Contact } from "@/lib/interfaces/contacts"

export const state = () => ({
  contacts: [] as Contact[],
  notificationMessage: '' as string,
  showNotification: false as boolean
});

export const mutations = {
  setNotificationMessage(state: any, notificationMessage: string) {
    state.notificationMessage = notificationMessage;
  },

  setShowNotification(state: any, showNotification: boolean) {
    state.showNotification = showNotification;
  },

  setContacts(state: any, contacts: any[]) {
    state.contacts = contacts;
  },

  addContact(state: any, contact: any) {
    state.contacts.push(contact);
  },

  updateContact(state: any, updatedContact: Contact) {
    const contactIndex = state.contacts.findIndex((contact: any) => contact.id === updatedContact.id);

    for (const prop in updatedContact) {
      state.contacts[contactIndex][prop] = updatedContact[prop as keyof Contact];
    }
  },

  removeContact(state: any, contactId: string) {
    const contactIndex = state.contacts.findIndex((contact: any) => contact.id === contactId);
    // ? how would you handle not finding the contact above?
    state.contacts.splice(contactIndex, 1);
  }
};

export const actions = {
  updateShowNotification({ commit }: any, { show, message }: any) {
    commit('setNotificationMessage', message);
    commit('setShowNotification', show);
  },

  async loadContacts({ commit }: any) {
    try {
      const response = await axios.get("http://127.0.0.1:3001/contacts", {});
      commit("setContacts", response.data);
    } catch (error) {
      // Do something with the error
    }
  },

  async saveContact({ commit }: any, { contact }: { contact: Contact }) {
    const { id, ...contactWithoutId } = contact;

    try {
      let response;

      // If id is not blank, the contact has an id, which means the contact is being edited
      if (id.length > 0) {

        response = await axios.patch(`http://127.0.0.1:3001/contacts/${id}`, { contact: contactWithoutId });
        commit("updateContact", contact);
      }
      // The contact is being created
      else {
        response = await axios.post("http://127.0.0.1:3001/contacts", { contact: contactWithoutId });
        commit("addContact", { id: response.data.id, ...contactWithoutId });
      }

      return response;
    } catch (error) {
      // Do something with the error
    }
  },

  async removeContact({ commit }: any, contactId: string) {
    try {
      const response = await axios.delete(`http://127.0.0.1:3001/contacts/${contactId}`);
      commit('removeContact', contactId)

      return response;
    } catch {
      // Do something with the error
    }
  }
};
