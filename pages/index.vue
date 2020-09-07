<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-btn text nuxt :to="{ name: 'contacts' }" style="text-decoration: none;">
        <v-icon left>mdi-contacts</v-icon>Contacts
      </v-btn>
    </v-flex>
  </v-layout>
</template>
