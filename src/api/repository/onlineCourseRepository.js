import Repository from '@/api/core'
import queryString from 'query-string'
import axios from 'axios'
import vendor from '@/store/modules/vendor'
const baseURL = process.env.VUE_APP_API_LEARN + '/course'

const fetch = (params) => {
  const query = queryString.stringify({ ...params, vendorId: vendor.state.vendor.vendorId });
  return axios.get(baseURL + `?${query}`)
}

const search = (params) => {
  const query = queryString.stringify({ ...params, vendorId: vendor.state.vendor.vendorId });
  return axios.get(process.env.VUE_APP_API_LEARN + '/search' + `?${query}`)
}

const fetchOne = (id) => {
  return Repository(baseURL).fetchOne(id)
}

const create = (params) => {
  return Repository(baseURL).create(params)
}

const update = (id, params) => {
  return Repository(baseURL).update(id, params)
}

const remove = (id) => {
  return Repository(baseURL).delete(id)
}

export default {
  fetch,
  fetchOne,
  create,
  update,
  remove,
  search
}