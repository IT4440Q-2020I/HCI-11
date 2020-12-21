import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const UserGroup = RepositoryFactory.get('userGroup')
const namespaced = true

const state = {
  userGroups: []
}

const actions = {
  async fetch({ commit }, params) {
    const res = await UserGroup.fetch(params)
    commit('setUserGroups', res.data)
    return res.data
  }
}
const mutations = {
  setUserGroups(state, userGroups) {
    state.userGroups = userGroups
  }
}
const getters = {
  getUserGroups: state => {
    return state.userGroups
  }
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}