<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot />
      </div>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>
<script>
export default {
  name: 'Tooltip',
  props: ['text'],
};
</script>
