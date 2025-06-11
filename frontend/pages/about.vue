<template>
  <PageTitle title="About TV"></PageTitle>
  <div>
    A simple TV programme list built using the Cloudflare cloud.
  </div>
  <v-list>
    <v-list-item>Stores information about TV programmes in a Cloudflare KV database.</v-list-item>
    <v-list-item>Breaks the list into three parts: Ready to watch, Watching & Future.</v-list-item>
    <v-list-item>Optional AI helper assists with filling the "add" form by reading web pages about the programme for you.</v-list-item>
    <v-list-item>Deployed by Terraform and uses Cloudflare Pages to distribute the static website on Cloudflare's CDN.</v-list-item>
  </v-list>
</template>
