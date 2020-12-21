import axios from 'axios'
const BASE_URL = process.env.VUE_APP_API_PAYMENT + '/active-code'
import vendor from '@/store/modules/vendor'

const APIHelper = () => ({
  active: (code, params, option) =>
    axios.put(
      BASE_URL + `/activate?code=${code}&vendorId=${vendor.state.vendor.vendorId}`,
      params,
      option
    )
})
export const ActiveCode = APIHelper()
export default {
  ActiveCode
}
