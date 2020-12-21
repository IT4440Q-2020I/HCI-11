import axios from 'axios'
import vendor from '@/store/modules/vendor'
import auth from '@/store/modules/auth'
import get from 'lodash-es/get'
const vendorId = get(vendor, 'state.vendor.vendorId')
// const authUser = get(auth, 'state.auth')
const BASE_URL = process.env.VUE_APP_API_GROUP + '/user-permission'

const APIHelper = () => ({
  fetch: (params, option) =>
    axios.get(
      BASE_URL,
      { params: { ...params, vendorId } },
      option
    ),
  fetchOne: (params, option) =>
    axios.get(
      BASE_URL + `/${auth.state.auth.id}`,
      { params: { ...params, vendorId } },
      option
    )
})
export const UserPermission = APIHelper()
export default {
  UserPermission
}
