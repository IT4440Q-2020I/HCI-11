import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const ReactionRepository = RepositoryFactory.get('reaction')

const state = {
  reactions: [],
}
const actions = {
  async fetchReactions({ commit, rootState }, {objectType, ...params}) {
    const res = await ReactionRepository.fetch({
      ...params,
      vendorId: rootState.vendor.vendor.vendorId,
      userId: rootState.auth.auth.id,
      objectType,
    })
    commit('setReactions', res.data)
    return res.data
  },
  async createReaction({ commit, rootState }, params) {
    if (!rootState.auth.authenticated || !params.objectId) return
    const res = await ReactionRepository.create({
      ...params,
      userId: rootState.auth.auth.id,
      userEmail: rootState.auth.auth.email,
      userName: rootState.auth.auth.name,
      userAvatarLink: rootState.auth.auth.avatar,
    })
    commit('addOrUpdateReaction', res.data || {})
    return res.data
  },
  async updateReaction({ commit, rootState }, { id, ...reaction }) {
    if (!rootState.auth.authenticated) return
    const res = await ReactionRepository.update(id, reaction)
    commit('addOrUpdateReaction', res.data || {})
    return res.data
  },
  async removeMineReaction({rootState}, params) {
    if (!rootState.auth.authenticated) return
    const res = await ReactionRepository.removeMine(params)
    return res.data || {}
  },
  async removeReaction({commit}, id) {
    const res = await ReactionRepository.remove(id)
    commit('removeReaction', {id})
    return res.data
  },
}
const mutations = {
  setReactions(state, reactions) {
    if (state.reactions.length > 0) {
      const distinctReactions = reactions.filter(reaction => !state.reactions.some(r => r.id === reaction.id))
      state.reactions = state.reactions.concat(distinctReactions)
    } else {
      state.reactions = reactions
    }
  },
  addOrUpdateReaction(state, item) {
    if (item && item.id) {
      let foundIndex = state.reactions.findIndex(listItem => listItem && listItem.id === item.id)
      if (foundIndex >= 0) {
        state.reactions.splice(foundIndex, 1, item)
      } else {
        state.reactions.unshift(item)
      }
    }
  },
  resetReactions(state) {
    state.reactions = []
  },
  removeReaction(state, item) {
    if (item && item.id) {
      let foundIndex = state.reactions.findIndex(listItem => listItem && listItem.id === item.id)
      if (foundIndex >= 0) {
        state.reactions = state.reactions.filter(listItem => listItem && listItem.id !== item.id)
      }
    }
  },
}
const getters = {
  getReactions(state) {
    return state.reactions
  },
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true,
}
