import axios from 'axios'
import auth from '@/store/modules/auth'
import vendor from '@/store/modules/vendor'

const Repository = BASE_URL => ({
  count: (params, option) =>
    axios.get(
      BASE_URL + '-count',
      {
        params: { ...params, vendorId: vendor.state.vendor.vendorId }
      },
      option
    ),
  fetch: (params, option) =>
    axios.get(
      BASE_URL,
      { params: { ...params, vendorId: vendor.state.vendor.vendorId } },
      option
    ),
  fetchOne: (id, option) =>
    axios.get(
      BASE_URL + "/" + id,
      { params: { vendorId: vendor.state.vendor.vendorId } },
      option
    ),
  create: (params, options) =>
    axios.post(
      BASE_URL,
      { ...params, vendorId: vendor.state.vendor.vendorId },
      {
        headers: {
          Authorization: auth.state.auth.accessToken
        }
      },
      options
    ),
  createWithoutAccessToken: (params, options) =>
    axios.post(
      BASE_URL,
      { ...params, vendorId: vendor.state.vendor.vendorId },
      options
    ),
  update: (id, params, option) =>
    axios.put(
      BASE_URL + `/${id}?vendorId=${vendor.state.vendor.vendorId}`,
      params,
      {
        headers: {
          Authorization: auth.state.auth.accessToken
        }
      },
      option
    ),
  updateWithoutAccessToken: (id, params, option) =>
    axios.put(
      BASE_URL + `/${id}?vendorId=${vendor.state.vendor.vendorId}`,
      params,
      option
    ),
  delete: (id, option) =>
    axios.delete(
      BASE_URL + `/${id}?vendorId=${vendor.state.vendor.vendorId}`,
      {
        headers: {
          Authorization: auth.state.auth.accessToken
        }
      },
      option
    ),
  average: (params, option) =>
    axios.get(
      BASE_URL + `-average`,
      { params: { ...params, vendorId: vendor.state.vendor.vendorId } },
      option
    ),
});

export default Repository
