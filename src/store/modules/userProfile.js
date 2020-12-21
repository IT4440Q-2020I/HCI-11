import { RepositoryFactory } from '@/api/factory/repositoryFactory'
import auth from '@/store/modules/auth'
import userProfileRepository from '../../api/repository/userProfileRepository'
const UserProfileRepository = RepositoryFactory.get('userProfile')
const namespaced = true

const state = {
  student: {},
  profile: {}
}

const actions = {
  async fetchStudent({ commit }, params) {
    const res = await userProfileRepository.fetch(params)
    commit('setStudent', res.data[0] || {})
    return res.data
  },
  async updateProfile({ commit }, payload) {
    const res = await UserProfileRepository.update(payload.id, payload.body)
    commit('setProfile', res.data || {})
    const newAuthUser = {
      ...auth.state.auth,
      ...res.data
    }
    auth.state.auth = newAuthUser
    auth.actions.saveAuthuser(newAuthUser)
    return res.data
  },
}

const mutations = {
  setProfile(state, profile) {
    return (state.profile = profile)
  },
  setStudent(state, student) {
    state.student = student
  }
}

const getters = {
  getProfile: state => {
    return state.profile
  },
  getStudent: state => {
    return state.student
  }
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters,
}
