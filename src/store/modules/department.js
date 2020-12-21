import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const DepartmentRepository = RepositoryFactory.get('department')

const namespaced = true;

const state = {
  departments: [],
  department: {},
};

const actions = {
  async fetchDepartments({ commit }, params) {
    const res = await DepartmentRepository.fetch(params)
    commit('setDepartments', res.data || [])
    return res.data || []
  },
  async fetchDepartment({ commit }, id) {
    const res = await DepartmentRepository.fetchOne(id)
    commit('setDepartment', res.data || {})
    return res.data || {}
  },
}

const mutations = {
  setDepartments(state, departments) {
    state.departments = departments
  },
  setDepartment(state, department) {
    state.department = department
  },
};

const getters = {
  getDepartments: (state) => state.departments,
  getDepartment: (state) => state.department,
};

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters,
};
