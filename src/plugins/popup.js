import Popup from '@/global/BasePopup.vue'
const popup = {
  data: {
    show: false,
    title: '',
    message: '',
    type: 'error'
  },
  close() {
    Object.assign(this.data, { show: false, message: '' })
  },
  error(msg, options = {}) {
    this.data.type = 'error'
    this.data.show = true
    this.data.message = msg
    this.data.title = options.title || '$vuetify.MESSAGES.ERROR_DEFAULT'
  },
  success(msg, options = {}) {
    this.data.type = 'success'
    this.data.show = true
    this.data.message = msg
    this.data.title = options.title || '$vuetify.MESSAGES.SUCCESS_DEFAULT'
  },
  warn(msg, options = {}) {
    this.data.type = 'warning'
    this.data.show = true
    this.data.message = msg
    this.data.title = options.title || '$vuetify.MESSAGES.WARNING_DEFAULT'
  }
}

export default {
  install(Vue, pluginName = '$popup') {
    Vue.prototype[pluginName] = popup
    Vue.component('plugin-popup', Popup)
  }
}

export { popup }