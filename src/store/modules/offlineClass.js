import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const offlineClassRepository = RepositoryFactory.get('offlineClass')
const state = {
  classes: [],
  class: {},
}
const actions = {
  async fetchClasses({ commit }, params = {}) {
    const res = await offlineClassRepository.fetch(params);
    commit("setClasses", res.data || []);
    return res.data;
  },
  async fetchClassById({ commit }, id) {
    const res = await offlineClassRepository.fetchOne(id);
    commit("setClass", res.data || {});
    return res.data;
  },
}
const mutations = {
  setClasses(state, classes) {
    state.classes = classes
  },
  setClass(state, classData) {
    state.class = classData
  }
}
const getters = {
  getClasses: state => {
    return state.classes
  },
  getClassById: state => {
    return state.class
  }
}
export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}
