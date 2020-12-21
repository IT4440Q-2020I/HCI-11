import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const offlineCourseRepository = RepositoryFactory.get('offlineCourse')
const state = {
  courses: [],
  course: {},
}
const actions = {
  async fetchCourses({ commit }, params = {}) {
    const res = await offlineCourseRepository.fetch(params);
    commit("setCourses", res.data || []);
    return res.data;
  },
  async fetchCourseById({ commit }, id) {
    const res = await offlineCourseRepository.fetchOne(id);
    commit("setCourse", res.data || {});
    return res.data;
  },
}
const mutations = {
  setCourses(state, courses) {
    state.courses = courses
  },
  setCourse(state, course) {
    state.course = course
  }
}
const getters = {
  getCourses: state => {
    return state.courses
  },
  getCourseById: state => {
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
