<template>
  <v-card class="ma-4" elevation="7" shaped>
    <v-card-title class="pb-0">{{ room.name }}</v-card-title>
    <v-card-text class="d-flex caption">
      <Tooltip :text="`@${room.host_id}`">{{ room.host_name }}</Tooltip>
      が作成した部屋
    </v-card-text>
    <v-card-actions>
      <Tooltip text="参加する">
        <v-btn :disabled="disconnected" icon @click="$emit('join',room.id)">
          <v-icon>mdi-login-variant</v-icon>
        </v-btn>
      </Tooltip>
    </v-card-actions>
  </v-card>
</template>
<script>
import Tooltip from './Tooltip.vue';

export default {
  name: 'RoomObject',
  props: ['room', 'disconnected'],
  components: {
    Tooltip,
  },
};
</script>
