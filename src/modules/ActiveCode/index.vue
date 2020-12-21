<template>
	<MainLayout>
		<div class="course-online">
			<div style="text-align: center" class="active-course">
				<Heading
					level="h2"
					style="
						color: #3e3e3c;
						font-size: 36px;
						font-weight: bold;
						text-transform: uppercase;
					"
					>{{$vuetify.lang.t('$vuetify.ACTIVATE_COURSE')}}</Heading
				>
				<div>
					<TextStyle
						class="mt-6 mb-6"
						style="
							color: #79797c;
							font-weight: 500;
							font-size: 18px;
							text-align: center;
						"
						>{{$vuetify.lang.t('$vuetify.ACTIVATE_ONCE_ONLY')}}</TextStyle
					>
				</div>
				<div class="active-course__form-container">
					<div class="active-course__input-container">
						<v-text-field
							class="active-course__input"
							label="Solo"
							:placeholder="$vuetify.lang.t('$vuetify.ACTIVATE_CODE_PLACEHOLDER')"
							solo
							v-model="code"
						></v-text-field>
					</div>
				</div>
				<DecoratorButton
					style="margin-top: 16px"
					variation="primary"
					solid
					@click="useActivateCode"
					>{{$vuetify.lang.t('$vuetify.ACTIVATE_NOW')}}</DecoratorButton
				>
			</div>
		</div>
	</MainLayout>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout.vue'
export default {
	components: {
		MainLayout,
	},
	data() {
		return {
			code: '',
		}
	},
	methods: {
		...mapActions({
			activeCode: 'activateCode/activeCode',
		}),
		async useActivateCode() {
			try {
				if (this.code) {
					await this.activeCode({
						code: this.code,
						authUser: this.authUser,
					})
					this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.ACTIVATE_COURSE_SUCCESS'))
					this.$router.push('/purchased')
				} else {
					this.$message.error(this.$vuetify.lang.t('$vuetify.MESSAGES.PLEASE_ENTER_ACTIVE_CODE'))
				}
			} catch (err) {
				this.$message.error(err || this.$vuetify.lang.t('$vuetify.MESSAGES.ERROR_TRY_AGAIN'))
			}
		},
	},
	computed: {
		...mapGetters({
			authUser: 'auth/getAuthUser',
		}),
	},
}
</script>
<style lang="scss" scoped>
.active-course {
	padding: 80px;
	&__sub-title-container {
		padding-top: 30px;
		padding-bottom: 40px;
	}
	&__form-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__input-container {
		width: 60%;
	}
}
</style>
