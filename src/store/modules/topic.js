import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const topicRepository = RepositoryFactory.get('topic')
const state = {
  topics: [],
  topic: {},
  onlineTopics: []
}
const actions = {
  async fetchOnlineTopics({ commit }) {
    const res = await topicRepository.fetch({ type: 'online' });
    commit("setOnlineTopics", res.data || []);
    return res.data;
  },
  async fetchTopics({ commit }, params = {}) {
    const res = await topicRepository.fetch(params);
    commit("setTopics", res.data || []);
    return res.data;
  },
  async fetchTopicById({ commit }, id) {
    const res = await topicRepository.fetchOne(id);
    commit("setTopic", res.data || {});
    return res.data;
  },
}
const mutations = {
  setOnlineTopics(state, topics) {
    state.onlineTopics = topics
  },
  setTopics(state, topics) {
    state.topics = topics
  },
  setTopic(state, topic) {
    state.topic = topic
  }
}
const getters = {
  getOnlineTopics: state => {
    return state.onlineTopics
  },
  getInterestTopic: state => {
    let interestTopic = {}
    state.onlineTopics.forEach(topic => {
      if (!topic.parentId) {
        interestTopic[topic.id] = {
          id: topic.id,
          label: topic.title,
          children: []
        }
      }
    })
    state.onlineTopics.forEach(topic => {
      if (topic.parentId) {
        if (interestTopic[topic.parentId])
          interestTopic[topic.parentId].children.push({
            id: topic.id,
            label: topic.title,
          })
      }
    })
    return Object.values(interestTopic)
  },
  getTopics: state => {
    return state.topics
  },
  getTopicById: state => {
    return state.topic
  }
}
export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}
