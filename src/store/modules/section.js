import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const SectionRepository = RepositoryFactory.get('section')

const state = {
  sections: {},
}

const actions = {
  async fetchSections({ commit }, params = {}) {
    const res = await SectionRepository.fetch({
      ...params,
    })
    commit("setSections", res.data || [])
    return res.data
  },
}

const mutations = {
  setSections(state, sections) {
    return (state.sections = sections.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur }),
      {}
    ))
  },
}

const getters = {
  sections: (state) => {
    return Object.values(state.sections).sort((a, b) => {
      return a.index - b.index
    })
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}
