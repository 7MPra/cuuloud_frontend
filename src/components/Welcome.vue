<template>
  <div class="py-auto my-16">
    <div>
      <p class="font-weight-light text-center text-h2">
        ようこそ、<br>
        Cuuloudへ。
      </p>
      <p class="my-8 font-weight-regular text-center">
        ここは、今だけの話題でゆったりと話すことができる場所です。<br>
        右上のボタンから、早速始めてみましょう！
      </p>
      <v-img
            alt="Culoud Logo"
            class="shrink mx-auto"
            contain
            :src="require('@/assets/logo_full.png')"
            transition="scale-transition"
            width="40vw"
            />
    </div>
  </div>
</template>
<style scoped>

</style>
<script>
export default {
  name: 'Welcome',
};
</script>
