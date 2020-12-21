import { Vendor } from '@/api/repository/vendorRepository.js'
import get from 'lodash-es/get'
const state = {
  vendor: {},
  settings: {},
  dataHomePage: []
}
const actions = {
  async fetchVendor({ commit }) {
    const res = await Vendor.getVendorIdFromOrigin();
    await commit('setVendor', res)
    return res;
  },
  async getSettingsVendor({ commit, state }) {
    const res = await Vendor.getSettingsVendor(state.vendor.vendorId);
    _updateTheme(get(res, 'learn.themeConfig.themeData'))
    commit('setSettings', res)
    return res;
  },
  async fetchDataForHomePage({ commit, state }, { query }) {
    const res = await Vendor.fetchDataForHomePage(state.vendor.vendorId, query)
    commit('setDataHomePage', res)
    return res
  }
}
const mutations = {
  setVendor(state, vendor) {
    state.vendor = vendor
  },
  setSettings(state, settings) {
    state.settings = settings
  },
  setDataHomePage(state, dataHomePage) {
    state.dataHomePage = dataHomePage || []
  },
}
const getters = {
  getViewData(state) {
    return get(state.settings, 'learn.themeConfig.viewData')
  },
  getViewAboutUs(state) {
    return get(state.settings, 'learn.themeConfig.aboutMe')
  },
  getViewPrivacyPolicy(state) {
    return get(state.settings, 'learn.themeConfig.privacyPolicy')
  },
  getViewRecruitment(state) {
    return get(state.settings, 'learn.themeConfig.recruitment')
  },
  getContact(state) {
    return get(state.settings, 'contact')
  },
  getHeaderSetting(state) {
    return get(state.settings, 'learn.isDisplayMarketHeader')
  },
  getExceedWatchVideo: state => {
    return {
      countExceedWatchVideo: get(state.settings, 'learn.countExceedWatchVideo'),
      isCountExceedWatchVideo: get(state.settings, 'learn.isCountExceedWatchVideo'),
    }
  },
  getHeaderNav(state) {
    return get(state.settings, 'learn.isDisplayMenuHeaderSetting')
  },
  getFooterItem(state) {
    return get(state.settings, 'learn.isDisplayMenuFooterSetting')
  },
  getThemedata(state) {
    return get(state.settings, 'learn.themeConfig.themeData')
  },
  getDataHomePage(state) {
    return state.dataHomePage
  },
  getVendor(state) {
    return state.vendor
  },
  getThemeData(state) {
    return get(state.settings, 'learn.themeConfig.themeData')
  },
  getBankInfo(state) {
    return get(state.settings, 'bankInfo')
  },
  getDisplayProfile(state) {
    return get(state.settings, 'learn.isDisplayProfile')
  },
  getBaitNotification(state) {
    return {
      isNotificationBaited: get(state.settings, 'learn.isNotificationBaited', false),
      baitNotifications: get(state.settings, 'learn.baitNotifications', []),
    }
  },
  getCurrentLanguage: state => {
    return get(state.settings, 'learn.currentLanguage', 'vi')
  },
  getDisplayZoom(state) {
    return get(state.settings, 'learn.isDisplayZoom')
  }
}

const _updateTheme = (themeConfig) => {
  const old = localStorage.getItem('iztech-theme')
  const newTheme = JSON.stringify(themeConfig)
  if (!old) {
    localStorage.setItem('iztech-theme', newTheme)
  }
  if (newTheme !== old) {
    localStorage.setItem('iztech-theme', newTheme)
    return window.location.reload()
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}
