import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#00b4ff', // #E53935
        secondary: '#00a9ff', // #FFCDD2
        accent: '#006dce', // #3F51B5
      },
      dark: {
        primary: '#00b4ff', // #E53935
        secondary: '#00a9ff', // #FFCDD2
        accent: '#006dce', // #3F51B5
      },
    },
    options: {
      customProperties: true,
    },
  },
});
