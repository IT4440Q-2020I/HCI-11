import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const TeacherRepository = RepositoryFactory.get('teacher')

export default {
  namespaced: true,
  state: {
    teacher: {}
  },
  actions: {
    async fetchTeacher({ commit }, id) {
      const res = await TeacherRepository.fetchOne(id)
      commit('setTeacher', res.data || {})
    }
  },
  mutations: {
    setTeacher(state, teacher) {
      state.teacher = teacher
    }
  },
  getters: {
    getTeacher(state) {
      return state.teacher
    }
  }
}
