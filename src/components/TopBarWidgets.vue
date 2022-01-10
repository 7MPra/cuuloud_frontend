<template>
  <div class="d-flex">
    <div v-if="!isLogin">
      <Tooltip text="ログイン">
        <v-btn :disabled="disconnected" icon
        @click="$emit('open', 'login')">
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </Tooltip>
    </div>
    <div v-if="!isLogin">
      <Tooltip text="登録">
        <v-btn :disabled="disconnected" v-bind="attrs" v-on="on" icon
        @click="$emit('open', 'register')">
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </Tooltip>
    </div>
    <div v-if="isLogin">
      <Tooltip text="招待">
        <v-btn :disabled="disconnected" icon
        @click="$emit('open', 'invite')">
          <v-icon>mdi-account-multiple-plus</v-icon>
        </v-btn>
      </Tooltip>
    </div>
    <div v-if="isLogin">
      <Tooltip text="ログアウト">
        <v-btn :disabled="disconnected" v-bind="attrs" v-on="on" icon @click="$emit('logout')">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </Tooltip>
    </div>
    <v-menu bottom offset-y v-if="isLogin">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon>
          <Tooltip :text="name">
            <v-avatar v-bind="attrs" v-on="on" color="secondary" size="48">
              <span class="white--text text-h5">{{ name.substr(0,2) }}</span>
            </v-avatar>
          </Tooltip>
        </v-btn>
      </template>
      <v-list>
        <v-list-item link @click="$emit('profile')">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            プロフィール
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="$emit('open', 'settings')">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            設定
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<style scoped>
.hover-badge {
  z-index:1;
}
</style>
<script>
import Tooltip from './Tooltip.vue';

export default {
  name: 'TopBarWidgets',
  components: {
    Tooltip,
  },
  props: ['name', 'isLogin', 'disconnected'],
  data() {
    return {
      login: false,
      register: false,
      invite: false,
      logout: false,
    };
  },
};
</script>
