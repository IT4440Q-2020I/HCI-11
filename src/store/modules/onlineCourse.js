import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const OnlineCourseRepository = RepositoryFactory.get('onlineCourse')
const state = {
  courses: [],
  course: {},
  count: 18,
  setSearchItems: null

}
const actions = {
  async fetchCourses({ commit }, params = {}) {
    const res = await OnlineCourseRepository.fetch(params);
    commit("setCourses", res.data || []);
    return res.data;
  },
  async searchGlobal({ commit }, params = {}) {
    const res = await OnlineCourseRepository.search(params);
    commit('setSearchItems', res.data);
    return res.data;
  },
  async fetchCourseById({ commit }, id) {
    const res = await OnlineCourseRepository.fetchOne(id);
    commit("setCourse", res.data || {});
    return res.data;
  },
}
const mutations = {
  setCourses(state, courses) {
    state.courses = courses
  },
  setSearchItems(state, searchItems) {
    state.setSearchItems = searchItems
  },
  setCourse(state, course) {
    state.course = course
  }
}
const getters = {
  getCount: state => {
    return state.count
  },
  getCourses: state => {
    return state.courses
  },
  getCourse: state => {
    return state.course
  }
}
export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}
