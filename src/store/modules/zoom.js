import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const Zoom = RepositoryFactory.get('zoom')
const namespaced = true

const state = {
  zooms: []
}

const actions = {
  async fetch({ commit }, params) {
    const res = await Zoom.fetch(params)
    commit('setZooms', res.data)
    return res.data
  }
}
const mutations = {
  setZooms(state, zooms) {
    state.zooms = zooms
  }
}
const getters = {
  getZooms: state => {
    return state.zooms
  }
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}