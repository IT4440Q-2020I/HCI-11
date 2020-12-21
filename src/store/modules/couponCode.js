import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const CouponCodeRepository = RepositoryFactory.get('couponCode')
const namespaced = true

const state = {
  couponCode: {}
}

const actions = {
  async validateCode({ commit }, params) {
    const res = await CouponCodeRepository.validate(params)
    commit('setCouponCode', res.data || {})
    return res.data
  },
}

const mutations = {
  setCouponCode(state, couponCode) {
    return (state.couponCode = couponCode)
  }
}

const getters = {
  getCouponCode: state => {
    return state.couponCode
  }
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}
