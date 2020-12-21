import Vue from 'vue'
import 'iztech-design-system-neo/dist/system/system.css'
import Vuetify from "vuetify"
import "vuetify/dist/vuetify.min.css"
import vi from '@/i18n/vi'
import en from '@/i18n/en'
Vue.use(Vuetify)

const opts = {
  lang: {
    locales: { en, vi },
    current: "vi",
  },
}

export default new Vuetify(opts)