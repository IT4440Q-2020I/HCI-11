import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const CartRepository = RepositoryFactory.get('cart')
const namespaced = true
const LOCALSTORAGE_CART = 'cart-items'

const state = {
  cartItems: [],
  coupon: {},
  order: {},
  contact: {},
  combo: {},
}

const actions = {
  fetchCart({ commit }) {
    const cartItems = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_CART))
    commit('setCart', cartItems)
  },
  async checkCombo({ commit }, params) {
    const result = await CartRepository.checkCombo(params)
    commit('setCombo', result.data || {})
  },
  async checkCoupon({ commit }, params) {
    const result = await CartRepository.checkCoupon(params)
    commit('setCoupon', result.data)
    return result.data
  },
  async createOrder({ commit }, params) {
    const result = await CartRepository.createOrder(params)
    commit('setOrder', result.data)
    return result.data
  },
  async updateOrder({ commit }, { id, params }) {
    const result = await CartRepository.updateOrder(id, params)
    commit('setOrder', result.data)
    return result.data
  },
  async createContact({ commit }, params) {
    const result = await CartRepository.createContact(params)
    commit('setContact', result.data)
    return result.data
  },
  async updateContact({ commit }, { id, params }) {
    const result = await CartRepository.updateContact(id, params)
    commit('setContact', result.data)
    return result.data
  },
  addToCart({ commit, state }, newItem) {
    let newCartitems = state.cartItems ? state.cartItems : []
    let listItemIds = newCartitems.map(item => item.id)
    if (listItemIds.indexOf(newItem.id) > -1) {
      throw new Error('$vuetify.MESSAGES.PRODUCT_EXIST_IN_CART')
    } else {
      newCartitems.push(newItem)
      const stringtifyItems = JSON.stringify(newCartitems)
      window.localStorage.setItem(LOCALSTORAGE_CART, stringtifyItems)
      commit('setCart', newCartitems)
    }
  },
  removeToCart({ commit, state }, itemId) {
    const filteredItems = state.cartItems.filter(item => item.id !== itemId)
    const stringtifyItems = JSON.stringify(filteredItems)
    window.localStorage.setItem(LOCALSTORAGE_CART, stringtifyItems)
    commit('setCart', filteredItems)
  },
  clearCart({ commit }) {
    window.localStorage.removeItem(LOCALSTORAGE_CART)
    commit('setCart', [])
  }
}

const mutations = {
  setCart(state, carts) {
    state.cartItems = carts
    return carts
  },
  setCoupon(state, coupon) {
    state.coupon = coupon
  },
  setOrder(state, order) {
    state.order = order
  },
  setContact(state, contact) {
    state.contact = contact
  },
  setCombo(state, combo) {
    state.combo = combo
  },
}

const getters = {
  getItems: (state) => state.cartItems,
  getCartItemCount: (state) => state.cartItems && state.cartItems ? state.cartItems.length : 0,
  getCombo: (state) => state.combo,
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}
