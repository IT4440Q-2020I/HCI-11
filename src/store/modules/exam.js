import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const ExamRepository = RepositoryFactory.get('exam')
const state = {
  exams: {},
  exam: {},
  count: 0,
  isStatusReport: true,
};

const actions = {
  resetExam({ state }) {
    state.exams = {};
    state.exam = {};
    state.count = 0;
  },
  async fetchExamById({ commit }, id) {
    const res = await ExamRepository.fetchOne(id);
    return commit("setExamData", res.data);
  },
  async fetchExams({ commit }, params = {}) {
    const res = await ExamRepository.fetch({
      ...params,
    });
    commit("setExams", res.data || []);
    return res.data;
  },
  changeReportStatus({ commit }, isReport = true){
    commit("setReportView", isReport)
  }
};

const mutations = {
  setExams(state, exams) {
    return state.exams = exams;
  },
  setExamData(state, exam) {
    return (state.exam = exam);
  },
  setReportView(state, isReport){
    return state.isStatusReport = isReport
  }
};

const getters = {
  exams: (state) => {
    return state.exams;
  },
  getExam: (state) => {
    return state.exam
  },
  getReportStatus: (state) => {
    return state.isStatusReport
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
};
