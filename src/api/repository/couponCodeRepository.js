import Repository from '@/api/core'
const BASE_URL = process.env.VUE_APP_API_PAYMENT + '/coupon'
const validate = (params) => {
  return Repository(BASE_URL + '/validate').fetch(params)
}

export default {
  validate
}