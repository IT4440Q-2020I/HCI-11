import {RepositoryFactory} from '@/api/factory/repositoryFactory'
const Certificate = RepositoryFactory.get('certificate')
const namespaced = true

const state = {
  certificate: {},
  certificates: []
}

const actions = {
  async createCertificate({ commit }, data) {
    const res = await Certificate.create(data)
    commit('addCertificate', res.data)
    return res.data
  },
  async fetchCertificates({ commit }, params) {
    const res = await Certificate.fetch({
			...params
		})
    commit('setCertificates', res.data || [])
		return res.data
  },
  async fetchCertificate({ commit }, id) {
    const res = await Certificate.fetchOne(id)
    commit('setCertificate', res.data)
		return res.data
  },
  async checkCertificate({ commit }, courseId) {
    const res = await Certificate.fetch({
      course: courseId
    })
    if (res.data.length > 0 && res.data[0].data && res.data[0].data.isEnabled) {
      commit('setCertificate', res.data[0] || {})
      return true
    } else return false
  }
}

const mutations = {
  addCertificate(state, certificate) {
    state.certificates.push(certificate)
  },
  setCertificates(state, certificates) {
    state.certificates = certificates
  },
  setCertificate(state, certificate) {
    state.certificate = certificate
  },
}

const getters = {
  getList: state => {
    return state.certificates
  },
  getOne: state => {
    return state.certificate
  }
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}
