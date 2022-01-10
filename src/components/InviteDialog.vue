<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>招待</v-card-title>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field label="メールアドレス" v-model="email" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="info" @click="submit">招待</v-btn>
        <v-btn @click="dialog = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoginDialog',
  created() {
    this.$on('open', () => {
      this.dialog = true;
    });
  },
  methods: {
    submit() {
      this.$emit('done', this.email);
      this.dialog = false;
    },
  },
  data() {
    return {
      email: '',
      dialog: false,
    };
  },
};
</script>
