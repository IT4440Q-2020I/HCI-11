import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const SubmissionRepository = RepositoryFactory.get('submission')
const state = {
  submission: {},
  submissions: []
}

const actions = {
  async fetchSubmission({ commit }, params = {}) {
    const res = await SubmissionRepository.fetch({
      ...params
    })
    commit('setSubmission', res.data && res.data.length ? res.data[0] : {})
    return res.data
  },
  async fetchLastSubmission ({ commit, rootState }, params ={}){
    const res = await SubmissionRepository.fetchLast({
      ...params,
      userId: rootState.auth.auth.id,
    })
    commit('setSubmissions', res.data)
    return res.data
  },
  async fetchSubmissions({commit, rootState}, params ={}) {
    const res = await SubmissionRepository.fetch({
      ...params,
      userId: rootState.auth.auth.id,
    })
    commit('setSubmissions', res.data)
    return res.data
  },
  async updateSubmission({ commit, rootState }, { id, ...submission }) {
    const res = await SubmissionRepository.update(id, {
      ...submission,
      userId: rootState.auth.auth.id,
      name: rootState.auth.auth.name,
      email: rootState.auth.auth.email,
    })
    return commit('setSubmission', res.data)
  },
  async createSubmission({ commit }, data) {
    const submission = await SubmissionRepository.create(data)
    commit('setSubmission', submission.data)
    return submission.data
  },
}

const mutations = {
  setSubmission(state, submission) {
    state.submission = submission
  },
  reset(state) {
    state.submission = {}
  },
  setSubmissions(state, submissions){
    state.submissions = submissions
  }
}

const getters = {
  getSubmission: state => {
    return state.submission
  },
  getSubmissions: state => {
    return state.submissions
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}