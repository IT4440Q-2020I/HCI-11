import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const ebookRepository = RepositoryFactory.get('ebook')
const state = {
  books: [],
  book: {},
}
const actions = {
  async fetchBooks({ commit }, params = {}) {
    const res = await ebookRepository.fetch(params);
    commit("setBooks", res.data || []);
    return res.data;
  },
  async fetchBookById({ commit }, id) {
    const res = await ebookRepository.fetchOne(id);
    commit("setBook", res.data || {});
    return res.data;
  },
}
const mutations = {
  setBooks(state, books) {
    state.books = books
  },
  setBook(state, book) {
    state.book = book
  }
}
const getters = {
  getBooks: state => {
    return state.books
  },
  getBookById: state => {
    return state.book
  }
}
export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}
