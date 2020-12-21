<template>
	<v-dialog v-model="authPopup.isShow" width="400">
		<div style="background-color: #ffffff">
			<Authencation
				:state="authPopup.state"
				:isLoading="authPopup.isLoading"
				@change-state="(state) => $authPopup.show(state)"
				@onRequestSignUp="(data) => onRequestSignUp(data)"
				@onRequestSignIn="(data) => onRequestSignIn(data)"
				@onRequestForgotPassword="(data) => onRequestForgotPassword(data)"
				@onConfirmForgotPassword="(data) => onConfirmForgotPassword(data)"
				@onRequestChangePassword="(data) => onRequestChangePassword(data)"
			/>
		</div>
	</v-dialog>
</template>
<script>
import {mapActions} from 'vuex'
import moment from 'moment'
export default {
	data() {
		return {
			authPopup: this.$authPopup.authPopupData,
		}
	},
	methods: {
		...mapActions({
			signIn: 'auth/signIn',
			signUp: 'auth/signUp',
			changePassword: 'auth/changePassword',
			sendCodeForgotPassword: 'auth/sendCodeForgotPassword',
			submitForgotPassword: 'auth/submitForgotPassword',
		}),
		close() {
			this.$authPopup.close()
		},
		async onRequestSignUp(data) {
			try {
				this.$authPopup.setLoading(true)
				await this.signUp({
					...data,
					birthdate: moment(data.birthdate, 'DD/MM/YYYY').toISOString(),
				})
				this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.SIGN_UP_SUCCESS_AND_ACTIVATE_VIA_EMAIL'))
				this.$authPopup.close()
			} catch (error) {
				this.$message.error(error)
				this.$authPopup.close()
			}
		},
		async onRequestSignIn(data) {
			try {
				this.$authPopup.setLoading(true)
				await this.signIn(data)
				this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.SIGN_IN_SUCCESS'))
				this.$authPopup.close()
			} catch (error) {
				this.$message.error(error)
				this.$authPopup.close()
			}
		},
		async onRequestForgotPassword(data) {
			try {
				this.$authPopup.setLoading(true)
				await this.sendCodeForgotPassword(data)
				await this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.CONFIRMATION_CODE_SENT'))
				this.$authPopup.setLoading(false)
				this.$authPopup.show('confirmForgotPassword')
			} catch (error) {
				this.$message.error(error)
				this.$authPopup.close()
			}
		},
		async onConfirmForgotPassword(data) {
			try {
				this.$authPopup.setLoading(true)
				await this.submitForgotPassword(data)
				this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.CHANGE_PASSWORD_SUCCESS_AND_SIGN_IN'))
				this.$authPopup.close()
			} catch (error) {
				this.$message.error(error)
				this.$authPopup.close()
			}
		},
		async onRequestChangePassword(data) {
			try {
				this.$authPopup.setLoading(true)
				await this.changePassword(data)
				this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.CHANGE_PASSWORD_SUCCESS'))
				this.$authPopup.close()
			} catch (error) {
				this.$message.error(error)
				this.$authPopup.close()
			}
		},
	},
}
</script>