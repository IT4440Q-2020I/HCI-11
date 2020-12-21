import axios from 'axios'
const BASE_URL = process.env.VUE_APP_API_PAYMENT_SERVER + '/order'

const APIHelper = () => ({
  createPaymentURL: ({ id, domain }, options) =>
    axios.post(
      BASE_URL + '/create_payment_url',
      { id, domain },
      options
    ),
})
export const VNPay = APIHelper()
export default {
  VNPay
}
