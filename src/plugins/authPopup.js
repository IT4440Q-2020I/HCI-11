import BaseAuthenticationPopup from '@/global/BaseAuthenticationPopup.vue'
const authPopup = {
  authPopupData: {
    isShow: false,
    state: '',
    isLoading: false
  },
  close() {
    Object.assign(this.authPopupData, { isShow: false, isLoading: false })
  },
  show(state) {
    Object.assign(this.authPopupData, { isShow: true, state })
  },
  setLoading(val) {
    Object.assign(this.authPopupData, { isLoading: val })
  },
}

export default {
  install(Vue, pluginName = '$authPopup') {
    Vue.prototype[pluginName] = authPopup
    Vue.component('plugin-auth-popup', BaseAuthenticationPopup)
  }
}

export { authPopup }
