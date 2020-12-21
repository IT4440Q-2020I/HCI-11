import axios from 'axios'
// const AUTH_BASE_URL = process.env.VUE_APP_AUTH_API_URL
const VENDOR_BASE_URL = process.env.VUE_APP_API_VENDOR
const UTILITY_BASE_URL = process.env.VUE_APP_API_UTILITY

const APIHelper = () => ({
  getVendorIdFromOrigin: async () => {
    let cache = _loadVendorIdCache()
    if (cache) {
      return cache
    }
    // let { data: payload } = await axios.post(`${AUTH_BASE_URL}/unauthenticated/get-vendor-id-from-origin`)
    const payload = {
      vendorId: process.env.VUE_APP_FIXED_VENDOR_ID,
      clientId: '',
      rootDomain: 'admin-bigdat.izteach.vn'
    }
    if (!payload.vendorId) {
      throw new Error(
        `[GetVendorIdFromOrigin] Invalid payload '${JSON.stringify(payload)}'!`
      )
    }
    _saveVendorIdCache(payload)
    return payload
  },
  getSettingsVendor: async (vendorId) => {
    let res = await axios.get(`${VENDOR_BASE_URL}/vendor/${vendorId}`)
    return res.data.settings
  },
  fetchDataForHomePage: async (vendorId, params) => {
    let { data: payload } = await axios.post(`${UTILITY_BASE_URL}/homepage/${vendorId}`, params)
    return payload
  }
})

function _loadVendorIdCache() {
  let data = _jsonParse(localStorage.getItem('ol-amplify-vendorId-from-origin'))
  if (
    data &&
    data.origin == window.location.origin &&
    data.payload &&
    typeof data.payload.vendorId === 'string' &&
    Date.now() < data.expiredAt
  ) {
    return data.payload
  }
  localStorage.removeItem('ol-amplify-vendorId-from-origin')
  return null
}

function _saveVendorIdCache(payload) {
  let data = {
    origin: window.location.origin,
    payload,
    expiredAt: Date.now() + 24 * 60 * 60 * 1000
  }
  localStorage.setItem('ol-amplify-vendorId-from-origin', JSON.stringify(data))
}

function _jsonParse(str) {
  try {
    return JSON.parse(str)
  } catch (err) {
    return null
  }
}

export const Vendor = APIHelper()
export default {
  Vendor
}