<template>
	<MainLayout>
		<CartCheckout
			:id="orderId"
			:state="state"
			:cartItems="cartItems || tempCartItems"
			:isAuthenticated="isAuthenticated"
			:comboDiscountValue="comboDiscountValue"
			:bankAccountInfo="bankAccountInfo"
			:couponDiscountValue="couponDiscountValue"
			:couponCode="couponCode"
			:transferCode="transferCode"
			:user-profile="authUser"
			@onRequestSignIn="onRequestSignIn"
			@onCreateOrder="(data) => onCreateOrder(data)"
			@onRequestSignUp="(info) => onRequestSignUp(info)"
			@onRequestCheckCoupon="(coupon) => onRequestCheckCoupon(coupon)"
			@onRemoveCartItem="(id) => onRemoveCartItem(id)"
			@onUpdateOrder="(data) => onUpdateOrder(data)"
			@onRequestHomepage="$router.push('/')"
			@onRequestMyLearning="$router.push('/purchased')"
			@onRequestCalComboDiscount="onRequestCalComboDiscount"
		/>
	</MainLayout>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout.vue'
import {VNPay} from '@/api/repository/vnpayRepository'
export default {
	components: {
		MainLayout,
	},
	data() {
		return {
			transferCode: '12039812903',
			state: 'checkCart',
			couponDiscountValue: null,
			couponCode: null,
			cartItems: [],
			orderId: null,
			contactId: null,
			typeOfRequest: null,
			isCartItemRetained: false,
		}
	},
	computed: {
		...mapGetters({
			isAuthenticated: 'auth/getAuthenticated',
			authUser: 'auth/getAuthUser',
			getCartItems: 'cart/getItems',
			getBankInfo: 'vendor/getBankInfo',
			currentCombo: 'cart/getCombo',
		}),
		bankAccountInfo() {
			return {
				accountName: this.getBankInfo.accountName,
				accountNo: this.getBankInfo.accountNumber,
				bankName: this.getBankInfo.bank,
			}
		},
		comboDiscountValue() {
			let totalComboAppliedPrice = 0
			if (this.cartItems && this.cartItems.length > 0) {
				if (this.currentCombo) {
					if (this.currentCombo.items && this.currentCombo.items.length > 0) {
						totalComboAppliedPrice = this.cartItems
							.filter(item => !item.isFree && this.currentCombo.items.includes(item.id))
							.map(item => item.price.afterDiscount)
							.reduce((a, b) => a + b, 0)
					} else {
						totalComboAppliedPrice = this.cartItems
							.filter((item) => !item.isFree)
							.map((item) => item.price.afterDiscount)
							.reduce((a, b) => a + b, 0)
					}
					if (this.currentCombo.discountType === 'percent') {
						return (totalComboAppliedPrice * (this.currentCombo.discount || 0)) / 100
					}
					return this.currentCombo.discount || 0
				}
			}
			return 0
		},
	},
	methods: {
		...mapActions({
			signUp: 'auth/signUp',
			validateCode: 'couponCode/validateCode',
			removeToCart: 'cart/removeToCart',
			checkCombo: 'cart/checkCombo',
			checkCoupon: 'cart/checkCoupon',
			createOrder: 'cart/createOrder',
			updateOrder: 'cart/updateOrder',
			createContact: 'cart/createContact',
			updateContact: 'cart/updateContact',
			clearCart: 'cart/clearCart',
		}),
		onRequestSignIn() {
			this.$authPopup.show('login')
		},
		onRemoveCartItem(id) {
			this.removeToCart(id)
		},
		async onRequestCheckCoupon(coupon) {
			try {
				const result = await this.checkCoupon({
					code: coupon,
				})
				const listItemIds = this.cartItems.map((item) => item.id)
				if (listItemIds.indexOf(result.relation) > -1) {
					this.couponCode = String(coupon)
					this.couponDiscountValue = result.discount
					this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.COUPON_CODE_VALID'))
				}
			} catch (error) {
				this.$message.error(error)
			}
		},
		getDataCheckCombo(cartItems) {
			let params = {
				onlineCourseId_in: [],
				offlineCourseId_in: [],
				eventId_in: [],
				bookId_in: [],
			}
			cartItems.forEach((element) => {
				if (element.type === 'online')
					params['onlineCourseId_in'].push(element.id)
				else if (element.type === 'offline')
					params['offlineCourseId_in'].push(element.id)
			})
			return params
		},
		async onRequestCalComboDiscount() {
			if (this.cartItems && this.cartItems.length > 0) {
				const params = this.getDataCheckCombo(this.cartItems)
				try {
					await this.checkCombo(params)
				} catch (error) {
					this.$message.error(error)
				}
			}
		},
		async onRequestSignUp(info) {
			this.$message.loading(this.$vuetify.lang.t('$vuetify.MESSAGES.UPDATING'))
			try {
				const result = await this.signUp({
					email: info.email,
					name: info.name,
					phone: info.phone,
					password: info.password,
				})
				this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.SIGN_UP_SUCCESS_AND_ACTIVATE_VIA_EMAIL'))
				const dataOrder = {
					authUser: result,
					coupon: this.couponCode,
					items: this.cartItems,
					phone: result.phone,
					email: result.email,
					name: result.name,
				}
				this.onCreateOrder(dataOrder)
			} catch (error) {
				this.$message.error(error)
			}
		},
		getAffiliatesFromStorage() {
			return JSON.parse(localStorage.getItem('affiliates'))
		},
		getListAffiliates(affiliates) {
			let affiliatesPayload = []
			if (affiliates) {
				Object.keys(affiliates).forEach((key) => {
					if (affiliates[key])
						affiliatesPayload.push({
							id: affiliates[key].affiliateId,
							timestamp: affiliates[key].timestamp,
						})
				})
				return affiliatesPayload
			} else []
		},
		async clearAffiliatesUsed(data) {
			let affiliates = await this.getAffiliatesFromStorage()
			if (data.items && data.items.length) {
				data.items.forEach((item) => {
					Object.keys(affiliates).forEach((key) => {
						if (affiliates[key].relationId === item.id) {
							delete affiliates[key]
						}
					})
				})
			}
			localStorage.setItem('affiliates', JSON.stringify(affiliates))
		},
		async createOrderRequest(data) {
			const affiliatesFromStorage = await this.getAffiliatesFromStorage()
			const affiliates = await this.getListAffiliates(affiliatesFromStorage)
			return this.createOrder({
				customerEmail: data.email,
				customerName: data.name,
				customerPhone: data.phone,
				userId: data.authUser.id,
				items: data.items.map((item) => {
					return {
						id: item.id,
						type: 'course',
					}
				}),
				affiliates,
				couponCode: data.coupon,
				purchasingProvider: '',
				combo: this.currentCombo,
				comboId: this.currentCombo.id,
			})
		},
		async redirectToVNPAY(data, bill) {
			if (data.selectPaymentMethod === 'bankOnline') {
				const url = await VNPay.createPaymentURL({
					domain: window.location.href.replace(
						'checkout',
						'course-online-detail/5f32088dccaf8a00072c9266'
					),
					id: bill.id,
				})
				if (url.data.code == '00') {
					window.location.href = url.data.data
				} else {
					this.$message.error(this.$vuetify.lang.t('$vuetify.MESSAGES.SYSTEM_ERROR'))
				}
			}
		},
		async onUpdateOrderRequest(data) {
			try {
				const bill = await this.updateOrder({
					id: this.orderId,
					params: {
						purchasingProvider: data.selectPaymentMethod,
						cod: data,
					},
				})
				this.state = 'confirm'
				this.redirectToVNPAY(data, bill)
			} catch (error) {
				this.$message.error(error)
			}
		},
		createContactRequest(data) {
			return this.createContact({
				customerEmail: data.email,
				customerName: data.name,
				customerPhone: data.phone,
				items: data.items.map((item) => {
					return {
						id: item.id,
						type: 'course',
						title: item.title,
					}
				}),
				couponCode: data.coupon,
				purchasingProvider: '',
			})
		},
		async onUpdateContactRequest(data) {
			try {
				const bill = await this.updateContact({
					id: this.contactId,
					params: {
						purchasingProvider: data.selectPaymentMethod,
						cod: data,
					},
				})
				this.state = 'confirm'
				this.redirectToVNPAY(data, bill)
			} catch (error) {
				this.$message.error(error)
			}
		},
		async onUpdateOrder(data) {
			if (this.typeOfRequest === 'order') {
				this.onUpdateOrderRequest(data)
			} else this.onUpdateContactRequest(data)
			this.onClearCart()
		},
		async onCreateOrder(data) {
			try {
				if (data.authUser) {
					this.typeOfRequest = 'order'
					const res = await this.createOrderRequest(data)
					this.orderId = res.id
					this.clearAffiliatesUsed(data)
				} else {
					this.typeOfRequest = 'contact'
					const res = await this.createContactRequest(data)
					this.contactId = res.id
				}
				this.state = 'selectPayment'
			} catch (error) {
				this.$message.error(error)
			}
		},
		onClearCart() {
			this.isCartItemRetained = true
			this.clearCart()
		},
	},
	watch: {
		getCartItems: {
			async handler(cartItems) {
				if (!this.isCartItemRetained) {
					this.cartItems = cartItems
				}
			},
			immediate: true,
		},
	},
}
</script>