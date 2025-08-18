<script setup>
// incoming programme to add/edit, whether the page is busy ot not and the submit button title
const { prog, buttonTitle } = defineProps(['prog', 'buttonTitle'])
const { busy } = useBusy()

// outgoing events from this form e.g. @submit="submitForm()"
const emitEvent = defineEmits(['submit'])

// whether to show the date picker
const isPicking = ref(false)

// lists of options for select boxes
const channels = ['BBC', 'ITV', 'Channel4', 'Channel5', 'Netflix', 'AppleTV', 'Disney', 'Amazon', 'SkyAtlantic', 'Alba', 'Paramount', 'U']
const types = ['Series', 'Film', 'Single']

</script>
<template>
  <v-form>
    <v-text-field v-model="prog.title" label="Title" required autofocus></v-text-field>
    <v-textarea v-model="prog.description" label="Description"></v-textarea>
    <v-text-field v-model="prog.stars" label="Stars"></v-text-field>
    <v-select v-model="prog.on" label="On (Channel)" :items="channels"></v-select>
    <v-select v-model="prog.type" label="Type" :items="types"></v-select>
    <v-text-field v-if="prog.type === 'Series'" v-model="prog.uptoep" label="Episodes Watched" clearable></v-text-field>
    <v-text-field v-if="prog.type === 'Series'" v-model="prog.uptomax" label="Episodes Total" clearable></v-text-field>
    <v-row>
      <v-col>
        <v-text-field v-model="prog.date" label="Date" readonly></v-text-field>
      </v-col>
      <v-col>
        <v-btn @click="isPicking = true">Change</v-btn>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-date-picker v-model="prog.date" v-if="isPicking" elevation="24"
        @update:modelValue="isPicking = false"></v-date-picker>
    </v-row>
    <v-text-field v-model="prog.season" label="Season" @keydown.enter="add()"></v-text-field>
    <v-text-field v-model="prog.pic" label="Pic" @keydown.enter="add()" clearable></v-text-field>
    <v-img v-if="prog.pic" :src="prog.pic"></v-img>
    <v-checkbox label="Watching" v-model="prog.watching"></v-checkbox>
    <v-btn :disabled="prog.title.length === 0 || busy" color="warning" class="mr-4" @click="emitEvent('submit')">
      {{ buttonTitle }}
    </v-btn>
  </v-form>
</template>
