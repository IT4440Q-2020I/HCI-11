import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const NotificationRepository = RepositoryFactory.get('notification')

const state = {
  notifications: [],
  notification: {},
  count: 0,
  baitNotifications: [],
};

const actions = {
  async fetchNotifications({ commit }, params = {}) {
    console.log('ok')
    const res = await NotificationRepository.fetch({
      ...params,
    });
    commit("setNotifications", res.data);
    return res.data;
  },
  async fetchNotificationById({ commit }, id) {
    const res = await NotificationRepository.fetchOne(id);
    commit("setNotification", res.data);
    return res.data;
  },
  async countNotification({ commit }, params = {}) {
    const res = await NotificationRepository.count(params)
    commit('setCount', res.data)
    return res.data
  },
  async updateNotification({ commit }, { id, params }) {
    const res = await NotificationRepository.update(id, params)
    commit('setNotification', res.data)
    return res.data
  }
};

const mutations = {
  setNotifications(state, notifications) {
    state.notifications = notifications
  },
  setNotification(state, notification) {
    state.notifications = notification
  },
  setCount(state, count) {
    state.count = count
  },
  setBaitNotifications(state, baitNotifications) {
    state.baitNotifications = baitNotifications
  },
};

const getters = {
  getNotifications: (state) => {
    return state.notifications.map(noti => {
      return {
        ...noti,
        content: noti.description,
        avatar: 'https://freeiconshop.com/wp-content/uploads/edd/apple-flat-1.png'
      }
    });
  },
  getBaitNotifications: (state) => {
    return state.baitNotifications.map(noti => {
      return {
        ...noti,
        avatar: 'https://freeiconshop.com/wp-content/uploads/edd/apple-flat-1.png'
      }
    })
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
