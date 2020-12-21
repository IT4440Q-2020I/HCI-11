import {RepositoryFactory} from '@/api/factory/repositoryFactory'
const UserCertificate = RepositoryFactory.get('userCertificate')
const namespaced = true

const state = {
  userCertificates: [],
  userCertificate: {}
}

const actions = {
  async fetchUserCertificates({ commit }, params) {
    const res = await UserCertificate.fetch({
			...params
    })
    commit('setUserCertificates', res.data || [])
		return res.data
  },
  async fetchUserCertificate({ commit }, id) {
    const res = await UserCertificate.fetchOne(id)
    commit('setUserCertificate', res.data)
		return res.data
  },
  async createUserCerificate({ commit }, params) {
    const res = await UserCertificate.create({
      ...params
    })
    commit('setUserCertificate', res.data)
    return res.data
  }
}

const mutations = {
  setUserCertificates(state, userCertificates) {
    state.userCertificates = userCertificates
  },
  setUserCertificate(state, userCertificate) {
    state.userCertificate = userCertificate
  },
}

const getters = {
  getUserCertificates: state => {
    return state.userCertificates
  },
  getUserCertificate: state => {
    return state.userCertificate
  },
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}
