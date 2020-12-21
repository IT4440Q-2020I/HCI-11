import queryString from 'query-string'
import axios from 'axios'
import vendor from '@/store/modules/vendor'
import Repository from '@/api/core'
const baseURL = process.env.VUE_APP_API_PAYMENT
const utilityURL = process.env.VUE_APP_API_UTILITY

const checkCombo = (params) => {
  const query = queryString.stringify({ ...params, vendorId: vendor.state.vendor.vendorId });
  return axios.get(baseURL + '/combo/my-combo' + `?${query}`)
}

const checkCoupon = (params) => {
  return Repository(baseURL + '/coupon/validate').fetch(params)
}

const createOrder = (params) => {
  return Repository(baseURL + '/bill').createWithoutAccessToken(params)
}

const updateOrder = (id, params) => {
  return Repository(baseURL + '/bill').updateWithoutAccessToken(id, params)
}

const createContact = (params) => {
  return Repository(utilityURL + '/order').createWithoutAccessToken(params)
}

const updateContact = (id, params) => {
  return Repository(utilityURL + '/order').updateWithoutAccessToken(id, params)
}

const createSubmitForm = (params) => {
  return Repository(utilityURL + '/contact').createWithoutAccessToken(params)
}



export default {
  checkCombo,
  createOrder,
  updateOrder,
  createContact,
  updateContact,
  checkCoupon,
  createSubmitForm
}