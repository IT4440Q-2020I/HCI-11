import Repository from '@/api/core'
const baseURL = process.env.VUE_APP_API_GROUP + '/group';

const fetch = (params) => {
  return Repository(baseURL).fetch(params)
}

export default {
  fetch
}