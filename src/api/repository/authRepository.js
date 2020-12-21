import axios from 'axios'
import get from 'lodash-es/get'
const RESOURCE_BASE_URL = process.env.VUE_APP_API_RESOURCE
const USER_BASE_URL = process.env.VUE_APP_API_STUDENT
const AUTH_USER_STORAGE_NAME = 'ol-credentials-auth-user'

const APIHelper = () => ({
	signIn: async body => {
		try {
			const payload = await axios.post(USER_BASE_URL + '/student/signin', body)
			if (payload.data.accessToken && payload.data.refreshToken) {
				return payload.data
			} else {
				throw new Error(
					`[SignIn] Invalid sign in response ${JSON.stringify(payload.data)}`
				)
			}
		} catch (error) {
			throw _readAxiosError(error)
		}
	},
	async signInWithAccessToken(accessToken, vendorId) {
		try {
			if (!accessToken) {
				throw new Error(`[Auth.signInWithAccessToken] 'accessToken' required!`)
			}
			let body = { token: accessToken, vendorId }
			let { data: payload } = await axios.post(
				USER_BASE_URL + '/student/token-signin',
				body
			)
			if (payload.accessToken && payload.refreshToken) {
				return payload
			} else
				throw new Error(
					`[Auth.signInWithAccessToken] Invalid payload ${JSON.stringify(
						payload
					)}`
				)
		} catch (err) {
			throw _readAxiosError(err)
		}
	},
	signUp: async (userInfo, vendorId) => {
		try {
			let { data: payload } = await axios.post(
				USER_BASE_URL + '/student/signup',
				{ ...userInfo, vendorId }
			)
			if (payload.id) {
				return payload
			} else {
				throw new Error(
					`[SignUp] Invalid sign up payload '${JSON.stringify(payload)}'`
				)
			}
		} catch (error) {
			throw _readAxiosError(error)
		}
	},
	sendCodeForgotPassword: async (payload) => {
		try {
			if (!payload.email) {
				throw new Error(`[SendCodeForgotPassword] 'email' required!`)
			}
			return await axios.put(
				USER_BASE_URL + `/student/send-reset-password?vendorId=${payload.vendorId}`,
				{ email: payload.email },
			)
		} catch (error) {
			throw _readAxiosError(error)
		}
	},
	async submitForgotPassword(params, vendor) {
		try {
			let { data: payload } = await axios.put(
				USER_BASE_URL + `/student/confirm-reset-password?vendorId=${vendor.vendorId}`,
				params,
			)
			if (payload && payload.id) {
				return payload
			} else {
				throw new Error(
					`[SubmitForgotPassword] Invalid response '${JSON.stringify(payload)}'`
				)
			}
		} catch (error) {
			throw _readAxiosError(error)
		}
	},
	changePassword: async (userInfo, vendor, accessToken) => {
		try {
			let { data: payload } = await axios.post(USER_BASE_URL + '/student/change-password',
				{ ...userInfo, vendorId: vendor.vendorId },
				{
					headers: {
						Authorization: accessToken
					}
				})
			if (payload.id) {
				return payload
			} else {
				throw new Error(
					`[SignUp] Invalid sign up payload '${JSON.stringify(payload)}'`
				)
			}
		} catch (error) {
			throw _readAxiosError(error)
		}
	},
	refreshToken: async (authUser, accessToken) => {
		let params = {
			refreshToken: authUser.refreshToken
		}
		try {
			const payload = await axios.get(
				USER_BASE_URL + `/student/refresh/${authUser.id}`,
				{
					params: { ...params, vendorId: authUser.vendorId },
					headers: {
						Authorization: accessToken
					}
				}
			)
			return payload.data
		} catch (error) {
			const codeError = get(error, 'response.data.code')
			if (codeError === '2005') {
				window.localStorage.removeItem(AUTH_USER_STORAGE_NAME)
				throw new Error('$vuetify.MESSAGES.YOUR_ACCOUNT_SIGNED_IN_OTHER_DEVICE')
			} else throw _readAxiosError(error)
		}
	},
	getS3SignedToken: async params => {
		try {
			if (!params.key) throw new Error(`[GetS3SignedUrl] file 'key' required!`)
			if (!params.contentType)
				throw new Error(`[GetS3SignedUrl] file 'contentType' required!`)
			let body = { key: params.key, contentType: params.contentType }
			let res = await axios.get(RESOURCE_BASE_URL + 'signed-url', {
				params: body
			})
			if (!res.data) throw new Error(`[GetS3SignedToken] Invalid payload!`)
			return res.data
		} catch (err) {
			throw _readAxiosError(err)
		}
	},
	subcribeNotify(body, accessToken) {
		return axios.post(USER_BASE_URL + '/student/subscribe-notify', body, { headers: { Authorization: accessToken } })
	},
	unsubcribeNotify(body, accessToken) {
		return axios.post(USER_BASE_URL + '/student/unsubcribe-notify', body, { headers: { Authorization: accessToken } })
	}
})

function _readAxiosError(err) {
	let errorMessage = get(err, 'response.data.errorMessage')
	return errorMessage ? new Error(errorMessage) : err
}

export const Auth = APIHelper()
export default {
	Auth
}
