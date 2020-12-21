import axios from 'axios'
import Repository from '@/api/core'
import auth from '@/store/modules/auth'
import vendor from '@/store/modules/vendor'
const baseURL = process.env.VUE_APP_API_PAYMENT + '/user-course'

const fetch = (params) => {
  return Repository(baseURL).fetch(params)
}

const fetchOne = (id) => {
  return Repository(baseURL).fetchOne(id)
}

const interact = (id, params, option) => {
  return axios.put(baseURL + `/interact/${id}?vendorId=${vendor.state.vendor.vendorId}`, params, option)
}

const enroll = (params, option) => {
  return axios.post(
    baseURL + '/enroll',
    {
      ...params,
      user: { name: auth.state.auth.name, email: auth.state.auth.email },
      userId: auth.state.auth.id,
      vendorId: vendor.state.vendor.vendorId
    },
    option
  )
}

export default {
  fetch,
  fetchOne,
  interact,
  enroll,
}