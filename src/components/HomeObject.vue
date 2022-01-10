<template>
  <div class="scrollbar" style="
  overflow: auto;
  height: calc(100vh - 112px);">
    <v-card class="ma-4" elevation="7" shaped>
      <v-card-title>部屋を作成する</v-card-title>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field :disabled="disconnected"
          label="部屋の名前" v-model="roomName" @keyup.enter="createRoom"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="disconnected" class="info" @click="createRoom">作成</v-btn>
      </v-card-actions>
    </v-card>
    <RoomObject v-for="room in rooms" :key="room.created_at"
    :room="room" :disconnected="disconnected" @join="(id) => $emit('join',id)"/>
  </div>
</template>
<script>
import RoomObject from './RoomObject.vue';

export default {
  name: 'HomeObject',
  props: ['disconnected'],
  components: {
    RoomObject,
  },
  created() {
    this.$on('update', (data) => {
      this.rooms = data;
    });
  },
  mounted() {
    this.$emit('getRooms');
  },
  methods: {
    join(room) {
      this.$emit('join', room);
    },
    createRoom() {
      this.$emit('create', this.roomName);
      this.roomName = '';
    },
  },
  data() {
    return {
      roomName: '',
      rooms: [],
    };
  },
};
</script>
