import {RepositoryFactory} from '@/api/factory/repositoryFactory'
const HomeworkRepository = RepositoryFactory.get('homework')

const state = {
  homeworks: [],
  homework: {},
  count: 0,
  sharedHomeworks: []
}

const actions = {
  async fetchHomeworks({commit}, params = {}) {
    const res = await HomeworkRepository.fetch(params)
    commit('setHomeworks', res.data || [])
    return res.data
  },
  async fetchHomeworkById({commit}, id) {
    const res = await HomeworkRepository.fetchOne(id)
    commit('setHomework', res.data)
    return res.data
  },
  async submitHomework({commit}, data) {
    const homework = await HomeworkRepository.create(data)
    commit('setHomework', homework.data)
    return homework.data
  },
  resetHomeworks({state}) {
    state.homeworks = []
    state.homework = {}
    state.count = 0
    state.sharedHomeworks = []
  },
  async fetchCount({commit}, params = {}) {
    const res = await HomeworkRepository.count(params)
    commit('setCount', res.data || 0)
  },
  async fetchSharedHomeworks({commit}, params = {}) {
    const res = await HomeworkRepository.fetch(params)
    commit('setSharedHomeworks', res.data || [])
    return res.data
  }
}

const mutations = {
  setHomeworks(state, homeworks) {
    state.homeworks = homeworks
    return homeworks
  },
  setHomework(state, homework) {
    state.homeworks.unshift(homework)
    return homework
  },
  reset(state) {
    state.homeworks = []
  },
  setCount(state, count) {
    state.count = count
  },
  toggleCommentOfSharedHomework(state, homeworkId) {
    const itemIndex = state.sharedHomeworks.findIndex(
      homework => homework.id === homeworkId
    )
    if (itemIndex >= 0) {
      const currentData = state.sharedHomeworks[itemIndex]
      state.sharedHomeworks.splice(itemIndex, 1, {
        ...currentData,
        canShowComment: !currentData.canShowComment
      })
    }
  },
  setSharedHomeworks(state, homeworks) {
    state.sharedHomeworks = homeworks
    return homeworks
  },
  updateSharedHomework(state, homework) {
    const foundIndex = state.sharedHomeworks.findIndex(
      item => item.id === homework.id
    )
    if (foundIndex >= 0) {
      state.sharedHomeworks.splice(foundIndex, 1, homework)
    }
  }
}

const getters = {
  getHomeworks: state => {
    return state.homeworks
  },
  getCount: state => {
    return state.count
  },
  getSharedHomeworks: state => {
    return state.sharedHomeworks
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
}
