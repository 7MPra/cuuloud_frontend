<template>
  <v-dialog v-model="dialog" :persistent="registing">
    <v-card>
      <v-card-title>参加する（招待されたメールアドレスのみ）</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field  label="メールアドレス"
          :rules="[rules.required, rules.email]" :disabled="registing || disconnected"
          type="email" autocomplete="email" v-model="email" />
          <v-text-field label="ニックネーム"
          :rules="[rules.required, rules.nameCounter]" :disabled="registing || disconnected"
          counter="10" v-model="name" type="text" autocomplete="nickname" />
          <v-text-field label="ユーザーID"
          :rules="[rules.required, rules.idCounter]" :disabled="registing || disconnected"
          counter="15" v-model="id" type="text" autocomplete="username" />
          <v-text-field
          @click:append="showPassword = !showPassword"
          :rules="[rules.required]" :disabled="registing || disconnected"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="パスワード" v-model="password" @keyup.enter="submit"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn :loading="registing" :disabled="disconnected"
        class="info" @click="submit" type="submit">登録</v-btn>
        <v-btn :disabled="registing" @click="dialog = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoginDialog',
  created() {
    this.$on('open', () => {
      this.registing = false;
      this.dialog = true;
    });
    this.$on('stop', () => {
      this.registing = false;
    });
    this.$on('close', () => {
      this.registing = false;
      this.dialog = false;
    });
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.registing = true;
        this.$emit('done', this.name, this.id, this.password, this.email);
      }
    },
  },
  props: ['disconnected'],
  data() {
    return {
      dialog: false,
      showPassword: false,
      name: '',
      id: '',
      password: '',
      email: '',
      registing: false,
      rules: {
        required: (value) => !!value || '必須の項目です。',
        nameCounter: (value) => value.length <= 10 || '最大で10文字まで入力可能です。',
        idCounter: (value) => value.length <= 15 || '最大で15文字まで入力可能です。',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || '正しくないメールアドレスです。';
        },
      },
    };
  },
};
</script>
