import Repository from '@/api/core'
import queryString from 'query-string'
const baseURL = process.env.VUE_APP_API_UTILITY + '/zoom'

const fetch = (params) => {
  return Repository(baseURL + `?${queryString.stringify(params)}`).fetch()
}

export default {
  fetch
}
