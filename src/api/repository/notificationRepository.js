import Repository from '@/api/core'
const baseURL = process.env.VUE_APP_API_USER + '/notify'

const fetch = (params) => {
  return Repository(baseURL).fetch(params)
}

const fetchOne = (id) => {
  return Repository(baseURL).fetchOne(id)
}

const count = (params) => {
  return Repository(baseURL + '/count').fetch(params)
}

const create = (params) => {
  return Repository(baseURL).create(params)
}

const update = (id, params) => {
  return Repository(baseURL).update(id, params)
}

export default {
  fetch,
  fetchOne,
  create,
  update,
  count
}