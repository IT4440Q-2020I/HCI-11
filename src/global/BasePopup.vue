<template>
	<v-dialog v-model="popupData.show" width="500" persistent>
		<div class="popup__content">
			<div class="popup__title">{{ title }}</div>
			<div class="popup__message">{{ message }}</div>
			<div style="text-align: center">
				<DecoratorButton
					v-if="message === $vuetify.lang.t('$vuetify.MESSAGES.YOUR_ACCOUNT_SIGNED_IN_OTHER_DEVICE')"
					@click.native="closePopup"
					solid
					variation="primary"
					>{{$vuetify.lang.t('$vuetify.EXIT')}}</DecoratorButton
				>
				<DecoratorButton
					v-else
					@click="popupData.show = false"
					solid
					variation="primary"
					>{{$vuetify.lang.t('$vuetify.EXIT')}}</DecoratorButton
				>
			</div>
		</div>
	</v-dialog>
</template>
<script>
export default {
	data() {
		return {
			popupData: this.$popup.data,
		}
	},
	computed: {
		title() {
			const popupTitle = this.popupData.title || ''
			if (popupTitle.indexOf('$vuetify') > -1) return this.$vuetify.lang.t(popupTitle)
			return popupTitle
		},
		message() {
			const popupMessage = this.popupData.message || ''
			if (typeof popupMessage === 'object') {
				console.log(typeof popupMessage.message)
				if (typeof popupMessage.message === 'string' && popupMessage.message.indexOf('$vuetify') > -1) {
					return this.$vuetify.lang.t(popupMessage.message)
				}
				return popupMessage
			}
			if (popupMessage.indexOf('$vuetify') > -1) return this.$vuetify.lang.t(popupMessage)
			return popupMessage
		},
	},
	methods: {
		closePopup() {
			this.$popup.close()
			this.$router.push('/')
		},
	},
}
</script>

<style lang="scss" scoped>
.popup__content {
	background: #ffffff;
	border-radius: 4px;
	box-shadow: 0px 4px 8px rgba(9, 30, 66, 0.25);
	padding: 24px;
}

.popup__title {
	font-family: Roboto;
	font-style: normal;
	font-weight: 500;
	font-size: 24px;
	line-height: 32px;
	text-align: center;
	color: #3e3e3c;
	margin-bottom: 24px;
}

.popup__message {
	font-family: Roboto;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 22px;
	text-align: center;
	margin-bottom: 34px;
	color: #79797c;
}
</style>
