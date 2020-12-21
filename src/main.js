import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import global from '@/global/index.js'
import helpers from '@/helpers/index.js'
import pluginHelper from '@/helpers/pluginHelper.js'
import utils from '@/helpers/utils.js'
import clipboard from 'v-clipboard'
import vuetify from '@/plugins/vuetify'
import message from '@/plugins/message'
import notify from '@/plugins/notify'
import popup from '@/plugins/popup'
import triggerPopup from '@/plugins/triggerPopup.js'
import cartRepository from '@/api/repository/cartRepository.js'
import authPopup from '@/plugins/authPopup'
import inputRules from '@/plugins/inputRules'
import renderUIFromJSON from '@/plugins/renderUIFromJSON'
import DesignSystem from 'iztech-design-system-neo'
import 'iztech-design-system-neo/dist/system/system.css'
import '@/assets/scss/main.scss'
import cart from '@/store/modules/cart.js'
// Add the Firebase products that you want to use
global.import()
Vue.config.productionTip = false
Vue.config.performance = true
Vue.config.devtools = true

sync(store, router, { moduleName: '$route' })

Vue.use(renderUIFromJSON, {
	router,
	store
})

Vue.use(
	pluginHelper.create({
		$clipboard: clipboard,
		$utils: utils,
		$helpers: helpers,
		$message: message,
		$notify: notify,
		$popup: popup,
		$authPopup: authPopup,
		$rules: inputRules
	})
)

Vue.use(DesignSystem, {
	functions: {
		redirect: link => {
			router.push(link)
		},
		addToCart: (item) => {
      if (item.isFree) {
        router.push(`/course-online-detail/${item.id}`)
      } else {
        try {
					let newCartitems = cart.state.cartItems ? cart.state.cartItems : []
					let listItemIds = newCartitems.map(item => item.id)
					if (listItemIds.indexOf(item.id) > -1) {
						throw new Error('$vuetify.MESSAGES.PRODUCT_EXIST_IN_CART')
					} else {
						newCartitems.push(item)
						const stringtifyItems = JSON.stringify(newCartitems)
						window.localStorage.setItem('cart-items', stringtifyItems)
						cart.mutations.setCart(newCartitems)
					}
					triggerPopup.emit('show-success-popup', '$vuetify.MESSAGES.ADD_TO_CART_SUCCESS')
        } catch (error) {
          triggerPopup.emit('show-error-popup',	error)
        }
      }
		},
		submitForm: async data => {
			try {
				await cartRepository.createSubmitForm(data)
				triggerPopup.emit(
					'show-success-popup',
					'Chúng tôi đã nhận được thông tin của bạn'
				)
			} catch (err) {
				triggerPopup.emit(
					'show-error-popup',
					'Gửi thông tin thất bại. Vui lòng liên hệ với đội hỗ trợ'
				)
			}
		}
	}
})

new Vue({
	vuetify,
	router,
	store,
	render: h => h(App)
}).$mount('#app')
