import Repository from '@/api/core'
import axios from 'axios'
import vendor from '@/store/modules/vendor'
const baseURL = process.env.VUE_APP_API_EXAM + '/homework'

const fetch = (params) => {
  return Repository(baseURL).fetch(params)
}

const fetchOne = (id) => {
  return Repository(baseURL).fetchOne(id)
}

const create = (params) => {
  return Repository(baseURL).createWithoutAccessToken(params)
}

const count = (params) => {
  return axios.get(baseURL + '/count', { params: { ...params, vendorId: vendor.state.vendor.vendorId } })
}

export default {
  fetch,
  fetchOne,
  create,
  count,
}