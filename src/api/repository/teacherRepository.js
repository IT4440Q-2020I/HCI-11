import Repository from '@/api/core'
const baseURL = process.env.VUE_APP_API_LEARN + '/author'

const fetch = (params) => {
  return Repository(baseURL).fetch(params)
}

const fetchOne = (id) => {
  return Repository(baseURL).fetchOne(id)
}

const create = (params) => {
  return Repository(baseURL).createWithoutAccessToken(params)
}

const update = (id, params) => {
  return Repository(baseURL).updateWithoutAccessToken(id, params)
}

export default {
  fetch,
  fetchOne,
  create,
  update,
}