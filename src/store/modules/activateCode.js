import { ActiveCode } from '@/api/repository/activeCodeRepository'
const namespaced = true

const state = {
  activeCode: {}
}

const actions = {
  async activeCode({ commit }, { code, authUser }) {
    const res = await ActiveCode.active(code, {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      phone: authUser.phone
    })
    commit('setActiveCode', res)
  }
}

const mutations = {
  setActiveCode(state, activeCode) {
    state.activeCode = activeCode
    return activeCode
  }
}

const getters = {
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}
