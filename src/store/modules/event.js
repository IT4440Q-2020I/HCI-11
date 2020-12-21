import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const eventRepository = RepositoryFactory.get('event')
const state = {
  events: [],
  event: {},
}
const actions = {
  async fetchEvents({ commit }, params = {}) {
    const res = await eventRepository.fetch(params);
    commit("setEvents", res.data || []);
    return res.data;
  },
  async fetchEventById({ commit }, id) {
    const res = await eventRepository.fetchOne(id);
    commit("setEvent", res.data || {});
    return res.data;
  },
}
const mutations = {
  setEvents(state, events) {
    state.events = events
  },
  setEvent(state, event) {
    state.event = event
  }
}
const getters = {
  getEvents: state => {
    return state.events
  },
  getEventById: state => {
    return state.event
  }
}
export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}
