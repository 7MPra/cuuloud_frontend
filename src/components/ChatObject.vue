<template>
<div>
  <div :id="'msarea-'+roomId"
  class="scrollbar" style="
  overflow: auto;
  height: calc(99vh - 222px);">
    <v-card
    style="margin:10px;"
    outlined
    v-for="chat in chatlog" :key="chat.created_at">
      <v-card-text>
        <v-card-text class="text-h6" v-if="chat.type === 'join'">
          {{ chat.user_name }} が参加しました
        </v-card-text>
        <v-card-text class="text-h6" v-if="chat.type === 'leave'">
          {{ chat.user_name }} が退出しました
        </v-card-text>
        <div class="d-flex flex-row" v-if="chat.type === 'message'">
          <v-avatar color="secondary" size="48">
              <span class="white--text text-h5">{{ chat.user_name.substr(0,2) }}</span>
          </v-avatar>
          <div style="width: calc(100% - 48px);">
            <v-list-item class="grow">
              <v-list-item-content>
                <v-list-item-title class="text-body2 py-0">{{ chat.user_name }}</v-list-item-title>
                <span class="text-caption">@{{ chat.user_id }}</span>
              </v-list-item-content>
              <v-row align="center" justify="end">
                <span class="subheading mr-2">{{ showDate(chat.created_at) }}</span>
              </v-row>
            </v-list-item>
            <p class="font-weight-light text-h6 ml-4 text-justify">
              {{ chat.text }}
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <v-card tile outlined height="114">
      <v-card tile height="48">
        <v-card-actions>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon @click="leave" :disabled="disconnected">
                <v-icon>mdi-logout-variant</v-icon>
              </v-btn>
            </template>
          <span>退出する</span>
          </v-tooltip>
          <v-btn icon disabled>
            <v-icon>mdi-image</v-icon>
            <!-- todo 画像投稿機能実装 -->
          </v-btn>
        </v-card-actions>
    </v-card>
    <v-card-actions>
      <v-text-field :disabled="disconnected"
      height="48" outlined v-model="text" append-outer-icon="mdi-send"
      @keyup.enter="send" @click:append-outer="send" />
    </v-card-actions>
  </v-card>
</div>
</template>
<style scoped>
</style>
<script>
export default {
  name: 'ChatObject',
  props: ['name', 'roomId', 'disconnected'],
  mounted() {
    this.$on('recieve', (data) => {
      const messagesArea = document.getElementById(`msarea-${this.roomId}`);
      if (messagesArea.scrollHeight - (messagesArea.scrollTop + messagesArea.clientHeight) <= 0) {
        this.chatlog.push(data);
        this.$nextTick(() => {
          messagesArea.scrollTop = messagesArea.scrollHeight;
        });
      } else {
        this.chatlog.push(data);
      }
    });
  },
  methods: {
    leave() {
      this.$emit('leave', this.roomId);
    },
    send() {
      this.$emit('send', this.roomId, this.text);
      this.text = '';
    },
    showDate(date) {
      const d = new Date(Date.parse(date));
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} `;
    },
  },
  data() {
    return {
      chatlog: [],
      text: '',
      messages: {},
    };
  },
};
</script>
