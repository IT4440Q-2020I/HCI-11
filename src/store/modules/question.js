import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const QuestionRepository = RepositoryFactory.get('question')
const state = {
  questions: [],
  count: 0
}

const actions = {
  async fetchQuestions({ commit }, params = {}) {
    const res = await QuestionRepository.fetch({
      ...params
    })
    commit('setQuestions', res.data || [])
    return res.data
  },
  resetQuestions({ state }) {
    state.questions = []
    state.count = 0
  },
  setQuestions({ state }, questions) {
    state.questions = questions
  }
}

const mutations = {
  setQuestions(state, questions) {
    state.questions = questions
    return questions
  },
  reset(state) {
    state.questions = []
  }
}

const getters = {
  getQuestions: (state) => {
    return state.questions.length ? state.questions.sort((a, b) => a.index - b.index) : state.questions
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}
