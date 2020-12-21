<script>
import {mapGetters, mapActions} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout.vue'
const ERROR_CODES = {
	MODEL_NOT_FOUND_ITEM_WITH_FIELD: 1053,
	MODEL_FIELD_INVALID: 1052,
	MODEL_ACTION_ERROR: 1057,
}

export default {
	components: {
		MainLayout,
	},
	computed: {
		...mapGetters({
			getViewData: 'vendor/getViewData',
		}),
	},
	methods: {
		...mapActions({
			signInWithAccessToken: 'auth/signInWithAccessToken',
		}),
		$redirect(url) {
			this.$router.push(url)
		},
		openInterestPopup() {
			this.$children[0].$refs['interest-popup'].openPopup()
			localStorage.setItem(
				'is-seen-interest-popup',
				JSON.stringify({
					isSeen: true,
				})
			)
		},
	},
	async mounted() {
		const {access_token: accessToken, error} = this.$route.query
		if (accessToken) {
			try {
				await this.signInWithAccessToken(accessToken)
				this.openInterestPopup()
			} catch (error) {
				this.$message.error(this.$vuetify.lang.t('$vuetify.MESSAGES.SIGN_IN_FAIL_AND_CHECK_TOKEN'))
				this.$authPopup.close()
			}
		} else {
			switch (error) {
				case ERROR_CODES.MODEL_NOT_FOUND_ITEM_WITH_FIELD: {
					return this.$popup.error(this.$vuetify.lang.t('$vuetify.MESSAGES.NOT_FOUND_USER_INFO_AND_CONTACT_SUPPORT'))
				}
				case ERROR_CODES.MODEL_FIELD_INVALID: {
					return this.$popup.error(this.$vuetify.lang.t('$vuetify.MESSAGES.INFORMATION_INVALID'))
				}
				case ERROR_CODES.MODEL_ACTION_ERROR:
				default: {
					return this.$popup.error(this.$vuetify.lang.t('$vuetify.MESSAGES.SIGN_UP_FAIL_AND_CONTACT_SUPPORT'))
				}
			}
		}
	},
	render(createElement) {
		return this.$renderUIFromJSON.renderElement(createElement, {
			element: 'MainLayout',
		})
	},
}
</script>
