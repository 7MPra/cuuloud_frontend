<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Culoud Logo"
          class="shrink mr-2"
          contain
          :src="require('@/assets/logo.png')"
          transition="scale-transition"
          width="40"
        />
      </div>
      <TopBarWidgets class="ml-auto"
      :disconnected="disconnected" :isLogin="isLogin" :name="userName"
      @logout="logout" @profile="openProfile(myProfile)" @open="openDialog"/>
      <template v-slot:extension v-if="isLogin">
        <v-tabs v-model="tabModel">
          <v-tab href="#home">Home</v-tab>
          <v-tab v-for="room in joinnedRooms"
          :key="room.id" :href="'#'+room.id">
            {{ room.name }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <Welcome v-if="!isLogin"/>
      <v-tabs-items v-model="tabModel" v-if="isLogin">
        <v-tab-item value="home">
          <HomeObject :disconnected="disconnected"
          ref="homeObj" @join="submitJoin" @create="submitCreateRoom"/>
        </v-tab-item>
        <v-tab-item v-for="room in joinnedRooms"
        :key="room.id" :value="room.id">
          <ChatObject @send="sendMessage" @leave="leave"
          :ref="room.id" :disconnected="disconnected" :name="room.name" :roomId="room.id"/>
        </v-tab-item>
      </v-tabs-items>
      <LoginDialog ref="login" :disconnected="disconnected" @done="submitLogin" />
      <RegisterDialog ref="register" :disconnected="disconnected" @done="submitRegister" />
      <InviteDialog ref="invite" @done="submitInvite"/>
      <NoticeDialog ref="notice" />
      <ProfileDialog v-for="profile in profiles"
      :key="profile.id" :profile="profile" :disconnected="disconnected"
      @close="closeProfile" @join="submitJoin"/>
      <SettingsDialog ref="settings" :name="userName" :disconnected="disconnected"
      @apply="applySettings"/>
      <v-snackbar v-model="disconnected">サーバーとの接続が切断されました。</v-snackbar>
      <v-snackbar v-model="connected" timeout="1000">サーバーに接続されました。</v-snackbar>
    </v-main>
  </v-app>
</template>
<style>
.scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.scrollbar::-webkit-scrollbar-track {
  border-radius: 5px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: var(--v-primary-base);
}
body{
  scrollbar-width: none;
}
body::-webkit-scrollbar{
  display:none;
}
</style>
<script>
import io from 'socket.io-client';
import HomeObject from './components/HomeObject.vue';
import RegisterDialog from './components/RegisterDialog.vue';
import LoginDialog from './components/LoginDialog.vue';
import InviteDialog from './components/InviteDialog.vue';
import NoticeDialog from './components/NoticeDialog.vue';
import ProfileDialog from './components/ProfileDialog.vue';
import SettingsDialog from './components/SettingsDialog.vue';
import ChatObject from './components/ChatObject.vue';
import TopBarWidgets from './components/TopBarWidgets.vue';
import Welcome from './components/Welcome.vue';

export default {
  name: 'App',
  components: {
    HomeObject,
    ChatObject,
    LoginDialog,
    RegisterDialog,
    InviteDialog,
    NoticeDialog,
    ProfileDialog,
    SettingsDialog,
    TopBarWidgets,
    Welcome,
  },
  mounted() {
    this.roomSock.on('rooms', (data) => {
      if (this.$refs.homeObj) this.$refs.homeObj.$emit('update', data);
    });
    this.roomSock.on('joinned_rooms', (data) => {
      this.joinnedRooms = data;
    });
    this.roomSock.on('join', (data) => {
      if (data.user_id === this.id) {
        return;
      }
      const obj = data;
      obj.type = 'join';
      this.$refs[data.room_id][0].$emit('recieve', obj);
    });
    this.roomSock.on('leave', (data) => {
      const obj = data;
      obj.type = 'leave';
      this.$refs[data.room_id][0].$emit('recieve', obj);
    });
    this.roomSock.on('message', (data) => {
      const obj = data;
      obj.type = 'message';
      this.$refs[data.room_id][0].$emit('recieve', obj);
    });
    this.authSock.on('notice', (data) => {
      this.$refs.notice.$emit('open', data.message);
    });
    this.roomSock.on('notice', (data) => {
      this.$refs.notice.$emit('open', data.message);
    });
    this.authSock.on('changed_settings', (data) => {
      this.userName = data.name;
    });
    this.authSock.on('auth_error', (data) => {
      if (this.isAuthListening) {
        this.isAuthListening = false;
        this.$refs.notice.$emit('open', data.message);
        this.$refs.login.$emit('stop');
        this.$refs.register.$emit('stop');
      }
    });
    this.authSock.on('login', (data) => {
      if (this.isAuthListening) {
        this.isAuthListening = false;
        this.id = data.id;
        this.userName = data.name;
        this.isLogin = data.login;
        this.$refs.login.$emit('close');
        this.$refs.register.$emit('close');
        if (data.login) {
          this.roomSock.emit('get_all_rooms');
        }
      }
    });
    setTimeout(() => { this.ready = true; }, 1000);
  },
  methods: {
    openProfile(obj) {
      this.profiles.push(obj);
    },
    closeProfile(id) {
      this.profiles = this.profiles.filter((obj) => obj.id !== id);
    },
    openDialog(name) {
      this.$refs[name].$emit('open');
    },
    submitLogin(id, password) {
      this.isAuthListening = true;
      this.authSock.emit('login', { id, password });
      setTimeout(() => {
        if (this.isAuthListening) {
          this.$refs.notice.$emit('open', '接続がタイムアウトしました。この操作を再試行するか、ページを読み込みなおしてください。');
          this.isAuthListening = false;
          this.$refs.login.$emit('stop');
        }
      }, 20000);
    },
    submitRegister(name, id, password, email) {
      this.isAuthListening = true;
      this.authSock.emit('register', {
        name, id, password, email,
      });
      setTimeout(() => {
        if (this.isAuthListening) {
          this.$refs.notice.$emit('open', '接続がタイムアウトしました。この操作を再試行するか、ページを読み込みなおしてください。');
          this.isAuthListening = false;
          this.$refs.register.$emit('stop');
        }
      }, 20000);
    },
    logout() {
      this.isAuthListening = true;
      this.authSock.emit('logout');
      setTimeout(() => {
        if (this.isAuthListening) {
          this.$refs.notice.$emit('open', '接続がタイムアウトしました。この操作を再試行するか、ページを読み込みなおしてください。');
          this.isAuthListening = false;
        }
      }, 20000);
    },
    submitCreateRoom(name) {
      this.roomSock.emit('create_room', { name });
    },
    submitJoin(room) {
      this.roomSock.emit('join_room', { room });
    },
    applySettings(obj) {
      this.authSock.emit('apply_settings', obj);
      this.$refs.settings.$emit('close');
    },
    leave(roomId) {
      this.roomSock.emit('leave_room', { room: roomId });
    },
    submitInvite(email) {
      this.authSock.emit('invite', { email });
    },
    sendMessage(roomId, text) {
      this.isListening = true;
      this.roomSock.emit('message', { text, id: roomId });
    },
  },
  data() {
    return {
      id: '',
      domain: '',
      authSock: io.connect('/auth'),
      roomSock: io.connect('/room'),
      isLogin: false,
      joinnedRooms: [],
      userName: '',
      profiles: [],
      tabModel: 'home',
      debug: 'none',
      isAuthListening: true,
      ready: false,
    };
  },
  computed: {
    disconnected() {
      return this.ready && !(this.authSock.connected && this.roomSock.connected);
    },
    connected() {
      return this.ready && this.authSock.connected && this.roomSock.connected;
    },
    myProfile() {
      return { name: this.userName, id: this.id, rooms: this.joinnedRooms };
    },
  },
};
</script>
