<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>設定</v-card-title>
      <v-list>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>名前の変更</v-list-item-title>
            <v-text-field @keyup.enter="apply" v-model="userName"
            :value="name" :disabled="disconnected"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-btn @click="apply" :disabled="disconnected" text class="info">適用</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'SettingsDialog',
  props: ['name', 'disconnected'],
  created() {
    this.$on('open', () => {
      this.dialog = true;
    });
    this.$on('close', () => {
      this.dialog = false;
    });
  },
  methods: {
    apply() {
      this.$emit('apply', { changedName: this.name !== this.userName, name: this.userName });
    },
  },
  data() {
    return {
      dialog: false,
      userName: '',
    };
  },
  watch: {
    name(name) {
      this.userName = name;
    },
  },
};
</script>
