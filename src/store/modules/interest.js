import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const InterestRepository = RepositoryFactory.get('interest')

const state = {
  interests: {},
};

const actions = {
  async addMultipleInterest({ commit }, params = {}) {
    const res = await InterestRepository.addMultipleInterest({
      ...params,
    });
    commit("appendInterests", res.data);
    return res.data;
  },
};

const mutations = {
  appendInterests(state, interests) {
    const newIntersts = interests.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur }),
      {}
    );
    state.interests = {
      ...state.interests,
      ...newIntersts
    }
  }
};

const getters = {
  getInterests: (state) => {
    return Object.values(state.interests);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
