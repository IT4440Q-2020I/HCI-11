import axios from 'axios'
import auth from '@/store/modules/auth'
const baseURL = process.env.VUE_APP_API_UTILITY + '/interest'

const addMultipleInterest = (params) => {
  return axios.put(baseURL + `/add?vendorId=${auth.state.auth.vendorId}`,
    params,
    {
      headers: {
        Authorization: auth.state.auth.accessToken
      }
    })
}

export default {
  addMultipleInterest
}
