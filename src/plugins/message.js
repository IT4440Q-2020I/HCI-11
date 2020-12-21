import BaseMessage from '@/global/BaseMessage.vue'
const message = {
  messageData: {
    isDisplay: false,
    text: '',
    color: 'error',
    time: 3000
  },
  close() {
    Object.assign(this.messageData, { isDisplay: false, text: '' })
  },
  show(color, text, time) {
    Object.assign(this.messageData, { isDisplay: true, text, color, time })
  },
  error(msg) {
    this.show('error', msg)
  },
  success(msg) {
    this.show('success', msg)
  },
  warning(msg) {
    this.show('warning', msg)
  },
  loading(msg, time) {
    this.show('grey darken-2', msg, time)
  }
}

export default {
  install(Vue, pluginName = '$message') {
    Vue.prototype[pluginName] = message
    Vue.component('plugin-message', BaseMessage)
  }
}

export { message }
