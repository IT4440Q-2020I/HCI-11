import axios from 'axios'
import Repository from '@/api/core'
import auth from '@/store/modules/auth'
import vendor from '@/store/modules/vendor'
const baseURL = process.env.VUE_APP_API_COMMENT + '/comment'

const fetch = (params) => {
  return axios.get(
    baseURL,
    { params: { ...params, vendorId: vendor.state.vendor.vendorId, userId: auth.state.auth.id } },
  )
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

const count = (params) => {
  return axios.get(baseURL + '-count', { params: { ...params, vendorId: vendor.state.vendor.vendorId } })
}

export default {
  fetch,
  fetchOne,
  create,
  update,
  count,
}