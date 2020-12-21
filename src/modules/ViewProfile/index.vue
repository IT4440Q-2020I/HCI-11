<template>
	<MainLayout>
		<div class="user-profile">
			<v-layout wrap class="pa-3 pt-6" v-if="!userProfileIsEditable">
				<v-flex xs12 class="d-flex flex-column align-center">
					<TextStyle font-type="subtitle-1">{{
						$vuetify.lang.t('$vuetify.NO_ACCESS_PERMISSION')
					}}</TextStyle>
					<DecoratorButton
						class="ma-0"
						@click="$router.push('/')"
						variation="primary"
						solid
						>{{
							$vuetify.lang.t('$vuetify.BUTTON.GO_BACK_HOME')
						}}</DecoratorButton
					>
				</v-flex>
			</v-layout>
			<v-layout wrap class="pa-3" v-else>
				<v-flex xs12 sm12 md4 class="pa-3">
					<div class="white pa-3">
						<UserAvatarInfo ref="avatar-info" :profile="profile" />
					</div>
				</v-flex>
				<v-flex xs12 sm12 md8 class="pa-3">
					<div class="white pa-3">
						<UserBasicInfo
							:profile="profile"
							ref="basic-info"
							class="mb-3 pa-4"
						/>
						<div class="d-flex justify-end mr-4">
							<DecoratorButton
								class="ma-0"
								@click="updateProfile"
								:loading="loading"
								:disabled="loading"
								variation="primary"
								solid
								>{{
									$vuetify.lang.t('$vuetify.BUTTON.SAVE_CHANGES')
								}}</DecoratorButton
							>
						</div>
					</div>
				</v-flex>
			</v-layout>
		</div>
	</MainLayout>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import moment from 'moment'
import MainLayout from '@/templates/layout/MainLayout'
import UserAvatarInfo from '@/modules/ViewProfile/components/UserAvatarInfo'
import UserBasicInfo from '@/modules/ViewProfile/components/UserBasicInfo'
export default {
	components: {
		MainLayout,
		UserAvatarInfo,
		UserBasicInfo,
	},
	data() {
		return {
			loading: false,
		}
	},
	methods: {
		...mapActions({
			updateUserInfo: 'userProfile/updateProfile',
		}),
		async updateProfile() {
			const studentId = this.authUser.studentId
			let avatarInfo = this.$refs['avatar-info'].getData()
			let basicInfo = this.$refs['basic-info'].getData()
			let validate = this.$refs['basic-info'].validate()
			if (validate && studentId) {
				this.loading = true
				let userInfo = {
					...basicInfo,
					birthdate: moment(basicInfo.birthdate, 'DD/MM/YYYY').toISOString(),
					avatar: avatarInfo,
				}
				try {
					await this.updateUserInfo({
						id: studentId,
						body: userInfo,
					})
					this.$message.success(
						this.$vuetify.lang.t('$vuetify.MESSAGES.UPDATE_SUCCESS')
					)
				} catch (error) {
					this.$message.error(
						this.$vuetify.lang.t('$vuetify.MESSAGES.UPDATE_FAIL')
					)
				}
				this.loading = false
			} else if (!studentId) {
				this.$message.error(
					this.$vuetify.lang.t('$vuetify.MESSAGES.MUST_SIGN_IN_TO_ACT')
				)
			} else {
				this.$message.error(
					this.$vuetify.lang.t('$vuetify.MESSAGES.PLEASE_CHECK_INFORMATION')
				)
			}
		},
	},
	computed: {
		...mapGetters({
			profile: 'auth/getAuthUser',
			userProfileIsEditable: 'vendor/getDisplayProfile',
			authUser: 'auth/getAuthUser',
		}),
	},
}
</script>
<style lang="scss" scoped>
.user-profile {
	max-width: 1120px;
	box-sizing: border-box;
	margin: 0 auto 40px;
}
</style>