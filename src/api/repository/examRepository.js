import Repository from '@/api/core'
const baseURL = process.env.VUE_APP_API_EXAM + '/exam'

const fetch = (params) => {
  return Repository(baseURL).fetch(params)
}

const fetchOne = (id) => {
  return Repository(baseURL).fetchOne(id)
}

export default {
  fetch,
  fetchOne,
}