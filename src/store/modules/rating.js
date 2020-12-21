import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const RatingRepository = RepositoryFactory.get('rating')
const state = {
  rateByCourse: [],
  count: 0,
  average: 0,
  userRate: {},

}
const actions = {
  async fetchRateByCourse({ commit }, params) {
    const res = await RatingRepository.fetch({ ...params, status: 'publish' })
    commit('setRateByCourse', res.data)
    return res.data
  },
  async rateCourse({ commit, rootState }, params) {
    if (!rootState.auth.authenticated || !params.objectId) return
    const res = await RatingRepository.create({
      ...params,
      userId: rootState.auth.auth.id,
      userEmail: rootState.auth.auth.email,
      userName: rootState.auth.auth.name,
      userAvatarLink: rootState.auth.auth.avatar,
    })
    if (params.status === 'publish') commit('addOrUpdateRate', res.data || {})
    return res.data
  },
  async updateRateCourse({ commit, rootState }, { id, ...rate }) {
    if (!rootState.auth.authenticated) return
    const userId = rootState.auth.auth.id
    const res = await RatingRepository.update(id, { ...rate, userId })
    if (res) {
      commit('addOrUpdateRate', res.data || {})
    }
    if (rate.status === 'publish') commit('addOrUpdateRate', res.data || {})
    else commit('removeRating', res.data || {})
    commit("setCurrentUserRate", res.data || {})
    return res.data
  },
  async fetchCountRate({ commit }, params) {
    const res = await RatingRepository.count({ ...params, status: 'publish' })
    commit("setCount", res.data || 0)
  },
  async fetchAverageRate({ commit }, params) {
    const res = await RatingRepository.average({ ...params, status: 'publish' })
    let avg = 0
    if (res && res.data.length > 0) {
      avg = res.data[0].average
      avg = avg % 1 === 0 ? avg : avg.toFixed(2)
    }
    commit("setAverage", avg)
  },
  async fetchCurrentUserRate({ commit, rootState }, params) {
    if (!rootState.auth.authenticated) return
    const userId = rootState.auth.auth.id
    const res = await RatingRepository.fetch({ ...params, userId })
    commit("setCurrentUserRate", res.data ? res.data[0] : {})
  },
}
const mutations = {
  setRateByCourse(state, payload) {
    state.rateByCourse = payload
  },
  addOrUpdateRate(state, item) {
    if (item && item.id) {
      let foundIndex = state.rateByCourse.findIndex(listItem => listItem && listItem.id === item.id)
      if (foundIndex >= 0) {
        state.rateByCourse.splice(foundIndex, 1, item)
      } else {
        state.rateByCourse.unshift(item)
      }
    }
  },
  setCount(state, payload) {
    state.count = payload
  },
  setAverage(state, payload) {
    state.average = payload
  },
  setCurrentUserRate(state, payload) {
    state.userRate = payload
  },
  resetRateByCourse(state) {
    state.rateByCourse = []
  },
  removeRating(state, item) {
    if (item && item.id) {
      let foundIndex = state.rateByCourse.findIndex(listItem => listItem && listItem.id === item.id)
      if (foundIndex >= 0) {
        state.rateByCourse = state.rateByCourse.filter(listItem => listItem && listItem.id !== item.id)
      }
    }
  },
}
const getters = {
  rateByCourse(state) {
    return state.rateByCourse
  },
  countRate(state) {
    return state.count
  },
  averageRate(state) {
    return state.average
  },
  currentUserRate(state) {
    return state.userRate
  }
}
export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}
