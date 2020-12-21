import axios from 'axios'
import queryString from 'query-string'
import Repository from '@/api/core'
import auth from '@/store/modules/auth'
import vendor from '@/store/modules/vendor'
const baseURL = process.env.VUE_APP_API_RATING + '/reaction'

const count = (params) => {
  return Repository(baseURL).count(params)
}
const fetch = (params) => {
  const query = queryString.stringify(params);
  return axios.get(baseURL + `-mine?${query}`)
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
const removeMine = (params) => {
  return axios.post(baseURL + `-mine?vendorId=${vendor.state.vendor.vendorId}`, params, {
    headers: {
      Authorization: auth.state.auth.accessToken
    }
  })
}

export default {
  fetch,
  fetchOne,
  create,
  update,
  count,
  remove,
  removeMine,
}