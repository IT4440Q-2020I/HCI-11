<template>
	<v-app id="app">
		<router-view />
		<Seo />
		<Zoom />
		<BaseMessage />
		<BasePopup />
		<BaseAuthenticationPopup />
	</v-app>
</template>
<script>
import Seo from '@/pages/Seo'
import {mapActions, mapMutations, mapGetters} from 'vuex'
import firebase from 'firebase/app'
import helpers from '@/helpers/index.js'
import 'firebase/messaging'
import '@/registerServiceWorker'
import Zoom from '@/pages/Zoom'

export default {
	components: {
		Seo,
		Zoom
	},
	methods: {
		...mapActions({
			fetchVendor: 'vendor/fetchVendor',
			getSettingsVendor: 'vendor/getSettingsVendor',
			initAuthen: 'auth/initAuthen',
			fetchCart: 'cart/fetchCart',
			fetchNotifications: 'notification/fetchNotifications',
			countNotification: 'notification/countNotification',
		}),
		...mapMutations({
			setBaitNotifications: 'notification/setBaitNotifications',
		}),
		setThemeData() {
			this.$themeData = this.themeData
			document.getElementById('favicon').href = this.$themeData.favicon
		},
		async getNotifications() {
			if (this.authenticated) {
				await this.fetchNotifications({_limit: 10})
				// await this.countNotification({read: false})
			}
		},
		async initFirseBase() {
			this.getNotifications()
			firebase.initializeApp(helpers.FIREBASE_CONFIG)
			const messaging = firebase.messaging()
			messaging.onMessage(async (payload) => {
				console.log('Message received. ', payload)
				this.getNotifications()
			})
			messaging
				.getToken({
					vapidKey:
						'BP4puuclvOyBz7qt2rLy5jeK6sSfDH-xh27aD3jLAgxnvqwKoZ4oWHGR6lcOTHaqW_6zyYOmziuT8hJwn63zkTs',
				})
				.then((currentToken) => {
					if (currentToken) {
						console.log(currentToken)
						this.$notify.setToken(currentToken)
					} else {
						console.log(
							'No registration token available. Request permission to generate one.'
						)
					}
				})
				.catch((err) => {
					console.log('An error occurred while retrieving token. ', err)
				})
		},
		setBaitNotif() {
			if (this.baitNotificationSettings.isNotificationBaited) {
				this.setBaitNotifications(this.baitNotificationSettings.baitNotifications)
			}
		},
	},
	async created() {
		await this.fetchVendor()
		await this.getSettingsVendor()
		await this.initAuthen()
		this.fetchCart()
		this.setThemeData()
		this.initFirseBase()
		this.setBaitNotif()
	},
	computed: {
		...mapGetters({
			themeData: 'vendor/getThemedata',
			authenticated: 'auth/getAuthenticated',
			baitNotificationSettings: 'vendor/getBaitNotification',
			currentLanguage: 'vendor/getCurrentLanguage',
		}),
	},
	watch: {
		authenticated: {
			handler(val) {
				if (val) {
					this.getNotifications()
				}
			},
			immediate: true,
		},
		currentLanguage: {
			handler(val) {
				if (val) {
					this.$vuetify.lang.current = val
				}
			},
			immediate: true,
		},
	},
}
</script>
<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
</style>
