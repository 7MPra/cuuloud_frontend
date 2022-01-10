<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>{{ text }}</v-card-title>
      <v-card-actions>
        <v-btn @click="dialog = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoginDialog',
  created() {
    this.$on('open', (text) => {
      this.text = text;
      this.dialog = true;
    });
  },
  data() {
    return {
      text: '',
      dialog: false,
    };
  },
};
</script>
