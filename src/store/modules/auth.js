import { Auth } from '@/api/repository/authRepository.js'
import Base64 from '@/helpers/encodeBase64.js'
import { cipher, decipher } from '@/helpers/cipher.js'
const AUTH_USER_STORAGE_NAME = 'ol-credentials-auth-user'

const state = {
	auth: null,
	authenticated: false,
	isRunning: false
}
const actions = {
	async initAuthen({ commit, dispatch, rootState }) {
		const vendorId = rootState.vendor.vendor.vendorId
		let authUser = _loadAuthUser(vendorId)
		if (authUser) {
			dispatch('validateAuthUser', { authUser, vendorId })
		} else commit('setAuth', null)
	},
	async signIn({ commit, dispatch, rootState }, payload) {
		const currentVendorId = rootState.vendor.vendor.vendorId
		if (!payload.email || !payload.password)
			throw new Error(
				`[Auth.SignIn] 'username' & 'password' && 'password' required!`
			)
		let body = {
			email: payload.email,
			password: Base64.encode(payload.password),
			vendorId: currentVendorId
		}
		const res = await Auth.signIn(body)
		Auth.subcribeNotify({
			userId: res.id,
			vendorId: res.vendorId
		}, res.accessToken).then()
		_saveAuthUser(res, currentVendorId)
		dispatch('setAuth', res)
		commit('setAuthenticated', true)
		return res
	},
	async signInWithAccessToken({ commit, dispatch, rootState }, accessToken) {
		const currentVendor = rootState.vendor.vendor
		if (!accessToken) throw new Error(`[Auth.SignIn] 'accessToken' required!`)
		const res = await Auth.signInWithAccessToken(
			accessToken,
			currentVendor.vendorId
		)
		_saveAuthUser(res, currentVendor.vendorId)
		dispatch('setAuth', res)
		commit('setAuthenticated', true)
		return res
	},
	async signUp({ rootState }, userInfo) {
		const currentVendor = rootState.vendor.vendor
		const userInfoHashPassword = {
			...userInfo,
			password: Base64.encode(userInfo.password)
		}
		return await Auth.signUp(
			userInfoHashPassword,
			currentVendor.vendorId,
			currentVendor.clientId
		)
	},
	async changePassword({ rootState, state }, payload) {
		const currentVendor = rootState.vendor.vendor
		const userInfoPassword = {
			userId: state.auth.id,
			oldPassword: Base64.encode(payload.oldPassword),
			newPassword: Base64.encode(payload.newPassword)
		}
		return await Auth.changePassword(
			userInfoPassword,
			currentVendor,
			state.auth.accessToken
		)
	},
	async sendCodeForgotPassword({ rootState }, payload) {
		const currentVendor = rootState.vendor.vendor
		return await Auth.sendCodeForgotPassword({ email: payload, vendorId: currentVendor.vendorId })
	},
	async submitForgotPassword({ rootState }, payload) {
		const currentVendor = rootState.vendor.vendor
		const data = {
			email: payload.email,
			confirmCode: payload.code,
			newPassword: Base64.encode(payload.password)
		}
		return await Auth.submitForgotPassword(data, currentVendor)
	},
	async signOut({ commit }) {
		commit('setAuth', null)
		commit('setAuthenticated', false)
		_removeAuthUser()
	},
	async refreshToken({ commit, dispatch }, authUser) {
		const newTokens = await Auth.refreshToken(authUser, state.auth.accessToken)
		const newAuthUser = {
			...authUser,
			...newTokens
		}
		dispatch('setAuth', newAuthUser)
		commit('setAuthenticated', true)
		_saveAuthUser(newAuthUser, newAuthUser.vendorId)
	},
	async validateAuthUser({ commit, dispatch }, payload) {
		const { authUser, vendorId } = payload
		let now = Date.now()
		let { accessTokenExpiredAt } = authUser
		if (accessTokenExpiredAt < now) {
			await dispatch('refreshToken', authUser)
		} else {
			dispatch('setAuth', authUser)
			commit('setAuthenticated', true)
			_saveAuthUser(authUser, vendorId)
		}
	},
	saveAuthuser(authUser) {
		_saveAuthUser(authUser, authUser.vendorId)
	},
	refreshTokenSingleton({ dispatch, state, commit }) {
		if (state.isRunning) return
		commit('setIsRunning', true)
		setInterval(async () => {
			let authUserEncoded = localStorage.getItem('ol-credentials-auth-user')
			if (authUserEncoded) {
				let authUser = JSON.parse(
					decipher(state.auth.vendorId)(authUserEncoded)
				)
				await dispatch('refreshToken', authUser)
			}
		}, 5 * 60 * 1000)
	},
	setAuth({ dispatch, commit }, authuser) {
		if (authuser) dispatch('refreshTokenSingleton')
		commit('setAuth', authuser)
	}
}
const mutations = {
	setAuth(state, auth) {
		state.auth = auth
	},
	setIsRunning(state, val) {
		state.isRunning = val
	},
	setAuthenticated(state, val) {
		state.authenticated = val
	}
}
const getters = {
	getAuthUser: state => state.auth,
	getAuthenticated: state => state.authenticated
}

// helpers

function _saveAuthUser(authUser, vendorId) {
	let authUserEncoded = cipher(vendorId)(JSON.stringify(authUser))
	return window.localStorage.setItem(AUTH_USER_STORAGE_NAME, authUserEncoded)
}

function _removeAuthUser() {
	return window.localStorage.removeItem(AUTH_USER_STORAGE_NAME)
}

function _loadAuthUser(vendorId) {
	let authUserEncoded = localStorage.getItem(AUTH_USER_STORAGE_NAME)
	try {
		return authUserEncoded
			? JSON.parse(decipher(vendorId)(authUserEncoded))
			: null
	} catch (err) {
		this.$message.error(err)
		return null
	}
}

export default {
	state,
	actions,
	getters,
	mutations,
	namespaced: true
}
